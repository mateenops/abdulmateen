import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { AppDataSource } from './infrastructure/database/config';
import { errorHandler } from './presentation/middleware/errorHandler';

import { UserRepository } from './infrastructure/repositories/UserRepository';
import { ChatMessageRepository } from './infrastructure/repositories/ChatMessageRepository';
import { SubscriptionRepository } from './infrastructure/repositories/SubscriptionRepository';
import { ChatService } from './domain/services/ChatService';
import { SubscriptionService } from './domain/services/SubscriptionService';

import { ChatController } from './presentation/controllers/ChatController';
import { SubscriptionController } from './presentation/controllers/SubscriptionController';

import { createChatRoutes } from './presentation/routes/chatRoutes';
import { createSubscriptionRoutes } from './presentation/routes/subscriptionRoutes';
import { createDocsRoutes } from './presentation/routes/docsRoutes';
import { enhancedHealthCheck } from './infrastructure/swagger/middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', enhancedHealthCheck);
app.use('/api-docs', createDocsRoutes());

// Initialize database
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');

    // Initialize repositories
    const userRepository = new UserRepository();
    const chatMessageRepository = new ChatMessageRepository();
    const subscriptionRepository = new SubscriptionRepository();

    // Initialize services
    const chatService = new ChatService(
      chatMessageRepository,
      userRepository,
      subscriptionRepository
    );
    const subscriptionService = new SubscriptionService(subscriptionRepository, userRepository);

    // Initialize controllers
    const chatController = new ChatController(chatService);
    const subscriptionController = new SubscriptionController(subscriptionService);

    // Routes
    app.use('/api/chat', createChatRoutes(chatController));
    app.use('/api/subscriptions', createSubscriptionRoutes(subscriptionController));

    app.use(errorHandler);

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Route not found',
          hint: 'Visit /api-docs for API documentation',
        },
      });
    });

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
      console.log(`🔍 Health Check: http://localhost:${port}/health`);
      console.log(`📄 Swagger JSON: http://localhost:${port}/api-docs/json`);
      console.log(`📮 Postman Collection: http://localhost:${port}/api-docs/postman.json`);
    });

    setInterval(
      async () => {
        try {
          await subscriptionService.processRenewals();
          console.log('Subscription renewals processed');
        } catch (error) {
          console.error('Error processing renewals:', error);
        }
      },
      60 * 60 * 1000
    );
  })
  .catch(error => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });

export default app;
