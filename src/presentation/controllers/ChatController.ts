import { Request, Response, NextFunction } from 'express';
import { ChatService } from '../../domain/services/ChatService';
import { ChatRequestDto } from '../../application/dtos/ChatRequestDto';

export class ChatController {
  constructor(private chatService: ChatService) {}

  public chat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const request = req.body as ChatRequestDto;
      const response = await this.chatService.processChat(request);

      res.json({
        success: true,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };
}