import { IsEnum, IsBoolean, IsUUID, IsOptional } from 'class-validator';
import { SubscriptionTier, BillingCycle } from '../../domain/entities/Subscription';

export class CreateSubscriptionDto {
  @IsUUID()
  userId!: string;

  @IsEnum(SubscriptionTier)
  tier!: SubscriptionTier;

  @IsEnum(BillingCycle)
  billingCycle!: BillingCycle;

  @IsBoolean()
  @IsOptional()
  autoRenew?: boolean = true;
}

export class SubscriptionResponseDto {
  constructor(
    public id: string,
    public tier: SubscriptionTier,
    public billingCycle: BillingCycle,
    public maxMessages: number,
    public messagesUsed: number,
    public price: number,
    public startDate: Date,
    public endDate: Date,
    public autoRenew: boolean,
    public status: string,
    public remainingQuota: number
  ) {}
}
