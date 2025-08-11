import { ISubscriptionRepository } from '../../domain/repositories/ISubscriptionRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import {
  CreateSubscriptionDto,
  SubscriptionResponseDto,
} from '../../application/dtos/SubscriptionDto';
import { Subscription, SubscriptionStatus } from '../../domain/entities/Subscription';
import { SubscriptionPricingService } from '../../domain/services/SubscriptionPricingService';
import { AppError, ErrorCode } from '../../shared/types/index';
import { addMonths, addYears } from 'date-fns';

export class SubscriptionService {
  constructor(
    private subscriptionRepo: ISubscriptionRepository,
    private userRepo: IUserRepository
  ) {}

  public async createSubscription(dto: CreateSubscriptionDto): Promise<SubscriptionResponseDto> {
    const user = await this.userRepo.findById(dto.userId);
    if (!user) {
      throw new AppError('User not found', ErrorCode.RESOURCE_NOT_FOUND, 404);
    }

    const price = SubscriptionPricingService.getPrice(dto.tier, dto.billingCycle);
    const maxMessages = SubscriptionPricingService.getMaxMessages(dto.tier);

    const startDate = new Date();
    const endDate =
      dto.billingCycle === 'MONTHLY' ? addMonths(startDate, 1) : addYears(startDate, 1);

    const subscription = await this.subscriptionRepo.create({
      userId: dto.userId,
      tier: dto.tier,
      billingCycle: dto.billingCycle,
      maxMessages,
      price,
      startDate,
      endDate,
      renewalDate: endDate,
      autoRenew: dto.autoRenew ?? true,
      status: SubscriptionStatus.ACTIVE,
    });

    return this.mapToResponseDto(subscription);
  }

  public async getUserSubscriptions(userId: string): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.subscriptionRepo.findByUserId(userId);
    return subscriptions.map(sub => this.mapToResponseDto(sub));
  }

  public async cancelSubscription(subscriptionId: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepo.findById(subscriptionId);
    if (!subscription) {
      throw new AppError('Subscription not found', ErrorCode.RESOURCE_NOT_FOUND, 404);
    }

    subscription.cancel();
    const updated = await this.subscriptionRepo.save(subscription);

    return this.mapToResponseDto(updated);
  }

  public async processRenewals(): Promise<void> {
    const renewableSubscriptions = await this.subscriptionRepo.findRenewableSubscriptions();

    for (const subscription of renewableSubscriptions) {
      try {
        // Simulate payment processing (randomly fail 10% of the time)
        if (Math.random() < 0.1) {
          subscription.status = SubscriptionStatus.INACTIVE;
          subscription.autoRenew = false;
          await this.subscriptionRepo.save(subscription);
          continue;
        }

        // Renew subscription
        subscription.messagesUsed = 0;
        subscription.startDate = new Date();
        subscription.endDate =
          subscription.billingCycle === 'MONTHLY'
            ? addMonths(subscription.startDate, 1)
            : addYears(subscription.startDate, 1);
        subscription.renewalDate = subscription.endDate;

        await this.subscriptionRepo.save(subscription);
      } catch (error) {
        console.error(`Failed to renew subscription ${subscription.id}:`, error);
      }
    }
  }

  private mapToResponseDto(subscription: Subscription): SubscriptionResponseDto {
    return new SubscriptionResponseDto(
      subscription.id,
      subscription.tier,
      subscription.billingCycle,
      subscription.maxMessages,
      subscription.messagesUsed,
      subscription.price,
      subscription.startDate,
      subscription.endDate,
      subscription.autoRenew,
      subscription.status,
      subscription.getRemainingQuota()
    );
  }
}
