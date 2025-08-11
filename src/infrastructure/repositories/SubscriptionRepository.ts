import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatus } from '../../domain/entities/Subscription';
import { ISubscriptionRepository } from '../../domain/repositories/ISubscriptionRepository';
import { AppDataSource } from '../database/config';

export class SubscriptionRepository implements ISubscriptionRepository {
  private repository: Repository<Subscription>;

  constructor() {
    this.repository = AppDataSource.getRepository(Subscription);
  }

  async findById(id: string): Promise<Subscription | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveByUserId(userId: string): Promise<Subscription[]> {
    return await this.repository.find({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
    });
  }

  async create(subscriptionData: Partial<Subscription>): Promise<Subscription> {
    const subscription = this.repository.create(subscriptionData);
    return await this.repository.save(subscription);
  }

  async save(subscription: Subscription): Promise<Subscription> {
    return await this.repository.save(subscription);
  }

  async findExpiredSubscriptions(): Promise<Subscription[]> {
    return await this.repository
      .createQueryBuilder('subscription')
      .where('subscription.endDate < :now', { now: new Date() })
      .andWhere('subscription.status = :status', { status: SubscriptionStatus.ACTIVE })
      .getMany();
  }

  async findRenewableSubscriptions(): Promise<Subscription[]> {
    return await this.repository
      .createQueryBuilder('subscription')
      .where('subscription.renewalDate <= :now', { now: new Date() })
      .andWhere('subscription.autoRenew = :autoRenew', { autoRenew: true })
      .andWhere('subscription.status = :status', { status: SubscriptionStatus.ACTIVE })
      .getMany();
  }
}
