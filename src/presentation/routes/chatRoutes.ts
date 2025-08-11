import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { validateBody } from '../middleware/validation';
import { ChatRequestDto } from '../../application/dtos/ChatRequestDto';

export const createChatRoutes = (chatController: ChatController): Router => {
  const router = Router();

  router.post('/', validateBody(ChatRequestDto), chatController.chat);

  return router;
};
