import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from '../../domain/services/SubscriptionService';
import { CreateSubscriptionDto } from '../../application/dtos/SubscriptionDto';

export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateSubscriptionDto;
      const subscription = await this.subscriptionService.createSubscription(dto);

      res.status(201).json({
        success: true,
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  };

  public getUserSubscriptions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const subscriptions = await this.subscriptionService.getUserSubscriptions(userId!);

      res.json({
        success: true,
        data: subscriptions,
      });
    } catch (error) {
      next(error);
    }
  };

  public cancel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const subscription = await this.subscriptionService.cancelSubscription(id!);

      res.json({
        success: true,
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  };
}
