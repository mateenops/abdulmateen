import { SubscriptionTier, BillingCycle } from '../../domain/entities/Subscription';

export class SubscriptionPricingService {
  private static readonly PRICING = {
    [SubscriptionTier.BASIC]: {
      [BillingCycle.MONTHLY]: 9.99,
      [BillingCycle.YEARLY]: 99.99,
      maxMessages: 10,
    },
    [SubscriptionTier.PRO]: {
      [BillingCycle.MONTHLY]: 29.99,
      [BillingCycle.YEARLY]: 299.99,
      maxMessages: 100,
    },
    [SubscriptionTier.ENTERPRISE]: {
      [BillingCycle.MONTHLY]: 99.99,
      [BillingCycle.YEARLY]: 999.99,
      maxMessages: -1, // Unlimited
    },
  };

  public static getPrice(tier: SubscriptionTier, cycle: BillingCycle): number {
    return this.PRICING[tier][cycle];
  }

  public static getMaxMessages(tier: SubscriptionTier): number {
    return this.PRICING[tier].maxMessages;
  }
}
