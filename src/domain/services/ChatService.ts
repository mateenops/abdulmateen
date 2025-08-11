import { IChatMessageRepository } from '../../domain/repositories/IChatMessageRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ISubscriptionRepository } from '../../domain/repositories/ISubscriptionRepository';
import { ChatRequestDto } from '../../application/dtos/ChatRequestDto';
import { ChatResponseDto } from '../../application/dtos/ChatResponseDto';
import { AppError, ErrorCode } from '../../shared/types/index';
import { User } from '../../domain/entities/User';

export class ChatService {
  constructor(
    private chatMessageRepo: IChatMessageRepository,
    private userRepo: IUserRepository,
    private subscriptionRepo: ISubscriptionRepository
  ) {}

  public async processChat(request: ChatRequestDto): Promise<ChatResponseDto> {
    const user = await this.userRepo.findById(request.userId);
    if (!user) {
      throw new AppError('User not found', ErrorCode.RESOURCE_NOT_FOUND, 404);
    }

    // Reset quota if needed
    if (user.needsQuotaReset()) {
      user.resetFreeQuota();
      await this.userRepo.save(user);
    }

    // Check quota and deduct usage
    await this.checkAndDeductQuota(user);

    // Simulate OpenAI API call with delay
    const response = await this.simulateOpenAICall(request.question);

    // Save chat message
    const chatMessage = await this.chatMessageRepo.create({
      userId: request.userId,
      question: request.question,
      answer: response.answer,
      tokensUsed: response.tokensUsed,
    });

    return new ChatResponseDto(
      chatMessage.id,
      chatMessage.question,
      chatMessage.answer,
      chatMessage.tokensUsed,
      chatMessage.createdAt
    );
  }

  private async checkAndDeductQuota(user: User): Promise<void> {
    // Try to use free message first
    if (user.canUseFreeMessage()) {
      user.useFreeMessage();
      await this.userRepo.save(user);
      return;
    }

    // Check subscriptions
    const subscriptions = await this.subscriptionRepo.findActiveByUserId(user.id);
    const activeSubscriptions = subscriptions.filter(sub => sub.isActive() && sub.hasQuota());

    if (activeSubscriptions.length === 0) {
      throw new AppError(
        'No active subscription with available quota',
        ErrorCode.SUBSCRIPTION_REQUIRED,
        402
      );
    }

    // Use subscription with highest remaining quota
    const subscription = activeSubscriptions.sort(
      (a, b) => b.getRemainingQuota() - a.getRemainingQuota()
    )[0];

    subscription!.useMessage();
    await this.subscriptionRepo.save(subscription!);
  }

  private async simulateOpenAICall(question: string): Promise<{ answer: string; tokensUsed: number }> {
    // Simulate API delay
    const delay = parseInt(process.env.OPENAI_API_DELAY_MS || '2000', 10);
    await new Promise(resolve => setTimeout(resolve, delay));

    // Mock response
    const answers = [
      'That\'s a great question! Based on my knowledge, here\'s what I can tell you...',
      'I understand your question. Let me provide you with a comprehensive answer...',
      'Thanks for asking! Here\'s my response to your inquiry...',
      'That\'s an interesting topic. Allow me to explain...',
    ];

    const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
    const tokensUsed = Math.floor(Math.random() * 100) + 50; // 50-149 tokens

    return {
      answer: `${randomAnswer} [This is a mocked response for: "${question}"]`,
      tokensUsed,
    };
  }
}