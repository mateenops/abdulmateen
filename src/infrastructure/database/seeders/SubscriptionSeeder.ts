import { Repository } from 'typeorm';
import { Subscription, SubscriptionTier, BillingCycle, SubscriptionStatus } from '../../../domain/entities/Subscription';
import { User } from '../../../domain/entities/User';
import { AppDataSource } from '../config';
import { addMonths, addYears, subDays, addDays } from 'date-fns';
import { SubscriptionPricingService } from '../../../domain/services/SubscriptionPricingService';

export interface SubscriptionSeedData {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  messagesUsed: number;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
}

export class SubscriptionSeeder {
  private repository: Repository<Subscription>;

  constructor() {
    this.repository = AppDataSource.getRepository(Subscription);
  }

  private getSubscriptionSeedData(): SubscriptionSeedData[] {
    const now = new Date();

    return [
      // John Doe - Active Basic Monthly
      {
        id: '223e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        tier: SubscriptionTier.BASIC,
        billingCycle: BillingCycle.MONTHLY,
        status: SubscriptionStatus.ACTIVE,
        messagesUsed: 3,
        startDate: subDays(now, 15),
        endDate: addDays(now, 15),
        autoRenew: true,
      },
      // Jane Smith - Active Pro Yearly
      {
        id: '223e4567-e89b-12d3-a456-426614174001',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        tier: SubscriptionTier.PRO,
        billingCycle: BillingCycle.YEARLY,
        status: SubscriptionStatus.ACTIVE,
        messagesUsed: 25,
        startDate: subDays(now, 60),
        endDate: addDays(now, 305),
        autoRenew: true,
      },
      // Bob Wilson - Active Enterprise Monthly
      {
        id: '223e4567-e89b-12d3-a456-426614174002',
        userId: '123e4567-e89b-12d3-a456-426614174002',
        tier: SubscriptionTier.ENTERPRISE,
        billingCycle: BillingCycle.MONTHLY,
        status: SubscriptionStatus.ACTIVE,
        messagesUsed: 150,
        startDate: subDays(now, 10),
        endDate: addDays(now, 20),
        autoRenew: true,
      },
      // Alice Johnson - Cancelled Basic
      {
        id: '223e4567-e89b-12d3-a456-426614174003',
        userId: '123e4567-e89b-12d3-a456-426614174003',
        tier: SubscriptionTier.BASIC,
        billingCycle: BillingCycle.MONTHLY,
        status: SubscriptionStatus.CANCELLED,
        messagesUsed: 8,
        startDate: subDays(now, 20),
        endDate: addDays(now, 10),
        autoRenew: false,
      },
      // Alice Johnson - Old Expired Subscription
      {
        id: '223e4567-e89b-12d3-a456-426614174004',
        userId: '123e4567-e89b-12d3-a456-426614174003',
        tier: SubscriptionTier.PRO,
        billingCycle: BillingCycle.MONTHLY,
        status: SubscriptionStatus.EXPIRED,
        messagesUsed: 75,
        startDate: subDays(now, 90),
        endDate: subDays(now, 60),
        autoRenew: false,
      },
      // Charlie Brown - Inactive (Payment Failed)
      {
        id: '223e4567-e89b-12d3-a456-426614174005',
        userId: '123e4567-e89b-12d3-a456-426614174004',
        tier: SubscriptionTier.PRO,
        billingCycle: BillingCycle.MONTHLY,
        status: SubscriptionStatus.INACTIVE,
        messagesUsed: 95,
        startDate: subDays(now, 35),
        endDate: subDays(now, 5),
        autoRenew: false,
      },
    ];
  }

  public async seed(users: User[]): Promise<Subscription[]> {
    console.log('Seeding subscriptions...');

    const seedData = this.getSubscriptionSeedData();
    const subscriptions: Subscription[] = [];

    for (const subData of seedData) {
      const existingSubscription = await this.repository.findOne({
        where: { id: subData.id }
      });

      if (!existingSubscription) {
        const price = SubscriptionPricingService.getPrice(subData.tier, subData.billingCycle);
        const maxMessages = SubscriptionPricingService.getMaxMessages(subData.tier);

        const subscription = this.repository.create({
          ...subData,
          price,
          maxMessages,
          renewalDate: subData.endDate,
        });

        const savedSubscription = await this.repository.save(subscription);
        subscriptions.push(savedSubscription);
        console.log(`Created subscription: ${savedSubscription.tier} for user ${savedSubscription.userId}`);
      } else {
        subscriptions.push(existingSubscription);
        console.log(`Subscription already exists: ${existingSubscription.id}`);
      }
    }

    console.log(`Subscriptions seeded: ${subscriptions.length}`);
    return subscriptions;
  }

  public async clear(): Promise<void> {
    console.log('Clearing subscriptions...');
    await this.repository.delete({});
    console.log('Subscriptions cleared');
  }
}
