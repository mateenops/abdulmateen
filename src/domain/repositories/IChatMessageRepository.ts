import { ChatMessage } from '../../domain/entities/ChatMessage';
import { PaginationOptions, PaginatedResult } from '../../shared/types/index';

export interface IChatMessageRepository {
  create(message: Partial<ChatMessage>): Promise<ChatMessage>;
  findByUserId(userId: string, options?: PaginationOptions): Promise<PaginatedResult<ChatMessage>>;
  getMonthlyUsage(userId: string, date: Date): Promise<number>;
}