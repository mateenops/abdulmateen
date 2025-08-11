import { Router } from 'express';
import { SubscriptionController } from '../controllers/SubscriptionController';
import { validateBody } from '../middleware/validation';
import { CreateSubscriptionDto } from '../../application/dtos/SubscriptionDto';

export const createSubscriptionRoutes = (subscriptionController: SubscriptionController): Router => {
  const router = Router();

  router.post('/', validateBody(CreateSubscriptionDto), subscriptionController.create);
  router.get('/user/:userId', subscriptionController.getUserSubscriptions);
  router.patch('/:id/cancel', subscriptionController.cancel);

  return router;
};
