import { Repository } from 'typeorm';
import { ChatMessage } from '../../domain/entities/ChatMessage';
import { IChatMessageRepository } from '../../domain/repositories/IChatMessageRepository';
import { PaginationOptions, PaginatedResult } from '../../shared/types/index';
import { AppDataSource } from '../../infrastructure/database/config';
import { startOfMonth, endOfMonth } from 'date-fns';

export class ChatMessageRepository implements IChatMessageRepository {
  private repository: Repository<ChatMessage>;

  constructor() {
    this.repository = AppDataSource.getRepository(ChatMessage);
  }

  async create(messageData: Partial<ChatMessage>): Promise<ChatMessage> {
    const message = this.repository.create(messageData);
    return await this.repository.save(message);
  }

  async findByUserId(
    userId: string,
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<ChatMessage>> {
    const [data, total] = await this.repository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    });

    return {
      data,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  async getMonthlyUsage(userId: string, date: Date): Promise<number> {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const count = await this.repository.count({
      where: {
        userId,
        createdAt: {
          $gte: start,
          $lte: end,
        } as any,
      },
    });

    return count;
  }
}
