import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

export enum SubscriptionTier {
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @ManyToOne(() => User, user => user.subscriptions)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({
    type: 'enum',
    enum: SubscriptionTier,
  })
  tier!: SubscriptionTier;

  @Column({
    type: 'enum',
    enum: BillingCycle,
  })
  billingCycle!: BillingCycle;

  @Column('int')
  maxMessages!: number;

  @Column('int', { default: 0 })
  messagesUsed!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'timestamp' })
  startDate!: Date;

  @Column({ type: 'timestamp' })
  endDate!: Date;

  @Column({ type: 'timestamp', nullable: true })
  renewalDate!: Date | null;

  @Column({ default: true })
  autoRenew!: boolean;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status!: SubscriptionStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  public isActive(): boolean {
    const now = new Date();
    return (
      this.status === SubscriptionStatus.ACTIVE && this.startDate <= now && this.endDate >= now
    );
  }

  public isExpired(): boolean {
    return new Date() > this.endDate;
  }

  public hasQuota(): boolean {
    if (this.tier === SubscriptionTier.ENTERPRISE) {
      return true;
    }
    return this.messagesUsed < this.maxMessages;
  }

  public getRemainingQuota(): number {
    if (this.tier === SubscriptionTier.ENTERPRISE) {
      return Number.MAX_SAFE_INTEGER;
    }
    return Math.max(0, this.maxMessages - this.messagesUsed);
  }

  public useMessage(): void {
    if (!this.hasQuota()) {
      throw new Error('No quota remaining');
    }
    if (this.tier !== SubscriptionTier.ENTERPRISE) {
      this.messagesUsed++;
    }
  }

  public cancel(): void {
    this.autoRenew = false;
    this.status = SubscriptionStatus.CANCELLED;
  }
}
