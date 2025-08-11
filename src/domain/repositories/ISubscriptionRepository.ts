import { Subscription } from '../../domain/entities/Subscription';
import { PaginationOptions, PaginatedResult } from '@/shared/types';

export interface ISubscriptionRepository {
  findById(id: string): Promise<Subscription | null>;
  findByUserId(userId: string): Promise<Subscription[]>;
  findActiveByUserId(userId: string): Promise<Subscription[]>;
  create(subscription: Partial<Subscription>): Promise<Subscription>;
  save(subscription: Subscription): Promise<Subscription>;
  findExpiredSubscriptions(): Promise<Subscription[]>;
  findRenewableSubscriptions(): Promise<Subscription[]>;
}
