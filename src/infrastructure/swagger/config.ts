import swaggerJSDoc from 'swagger-jsdoc';
import {
  SubscriptionTier,
  BillingCycle,
  SubscriptionStatus,
} from '../../domain/entities/Subscription';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Chat & Subscription System API',
      version: '1.0.0',
      description: `
        A comprehensive AI Chat system with subscription management built using Clean Architecture principles.
        
        ## Features
        - AI Chat with quota management
        - Multi-tier subscription system
        - User management with free quotas
        - Comprehensive error handling
        - Rate limiting and security
        
        ## Authentication
        Currently, this API uses user IDs for simplicity. In production, implement proper JWT authentication.
        
        ## Rate Limiting
        - 100 requests per 15 minutes per IP
        - Additional rate limiting on chat endpoints
        
        ## Error Handling
        All endpoints return structured error responses with appropriate HTTP status codes.
      `,
      contact: {
        name: 'API Support',
        email: 'support@example.com',
        url: 'https://example.com/support',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        // Error Schemas
        ApiError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  enum: [
                    'VALIDATION_ERROR',
                    'QUOTA_EXCEEDED',
                    'SUBSCRIPTION_REQUIRED',
                    'PAYMENT_FAILED',
                    'RESOURCE_NOT_FOUND',
                    'INTERNAL_ERROR',
                  ],
                  example: 'QUOTA_EXCEEDED',
                },
                message: {
                  type: 'string',
                  example: 'No active subscription with available quota',
                },
                details: {
                  type: 'string',
                  description: 'Additional error details (optional)',
                },
              },
              required: ['code', 'message'],
            },
          },
          required: ['success', 'error'],
        },

        // Success Response Wrapper
        ApiSuccess: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
          required: ['success', 'data'],
        },

        // User Schemas
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            freeMessagesUsed: {
              type: 'integer',
              minimum: 0,
              maximum: 3,
              example: 1,
              description: 'Number of free messages used this month (0-3)',
            },
            lastFreeQuotaReset: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T12:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T12:00:00.000Z',
            },
          },
          required: ['id', 'email', 'name'],
        },

        // Chat Schemas
        ChatRequest: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'UUID of the user making the request',
            },
            question: {
              type: 'string',
              minLength: 1,
              maxLength: 2000,
              example: 'What is artificial intelligence?',
              description: 'The question to ask the AI',
            },
          },
          required: ['userId', 'question'],
        },

        ChatResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '323e4567-e89b-12d3-a456-426614170001',
            },
            question: {
              type: 'string',
              example: 'What is artificial intelligence?',
            },
            answer: {
              type: 'string',
              example:
                'Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines...',
            },
            tokensUsed: {
              type: 'integer',
              minimum: 1,
              example: 85,
              description: 'Number of tokens consumed by this request',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T12:30:00.000Z',
            },
          },
          required: ['id', 'question', 'answer', 'tokensUsed', 'createdAt'],
        },

        // Subscription Schemas
        CreateSubscriptionRequest: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'UUID of the user creating the subscription',
            },
            tier: {
              type: 'string',
              enum: Object.values(SubscriptionTier),
              example: 'BASIC',
              description:
                'Subscription tier: BASIC (10 messages), PRO (100 messages), ENTERPRISE (unlimited)',
            },
            billingCycle: {
              type: 'string',
              enum: Object.values(BillingCycle),
              example: 'MONTHLY',
              description: 'Billing cycle: MONTHLY or YEARLY',
            },
            autoRenew: {
              type: 'boolean',
              example: true,
              default: true,
              description: 'Whether to automatically renew the subscription',
            },
          },
          required: ['userId', 'tier', 'billingCycle'],
        },

        SubscriptionResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '223e4567-e89b-12d3-a456-426614174000',
            },
            tier: {
              type: 'string',
              enum: Object.values(SubscriptionTier),
              example: 'BASIC',
            },
            billingCycle: {
              type: 'string',
              enum: Object.values(BillingCycle),
              example: 'MONTHLY',
            },
            maxMessages: {
              type: 'integer',
              example: 10,
              description: 'Maximum messages allowed (-1 for unlimited)',
            },
            messagesUsed: {
              type: 'integer',
              example: 3,
              description: 'Number of messages used in current period',
            },
            price: {
              type: 'number',
              format: 'decimal',
              example: 9.99,
              description: 'Subscription price',
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-02-01T00:00:00.000Z',
            },
            autoRenew: {
              type: 'boolean',
              example: true,
            },
            status: {
              type: 'string',
              enum: Object.values(SubscriptionStatus),
              example: 'ACTIVE',
            },
            remainingQuota: {
              type: 'integer',
              example: 7,
              description: 'Remaining message quota (999999999 for unlimited)',
            },
          },
          required: [
            'id',
            'tier',
            'billingCycle',
            'maxMessages',
            'messagesUsed',
            'price',
            'startDate',
            'endDate',
            'autoRenew',
            'status',
            'remainingQuota',
          ],
        },

        // Pagination Schemas
        PaginationMeta: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              minimum: 1,
              example: 1,
            },
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              example: 10,
            },
            total: {
              type: 'integer',
              minimum: 0,
              example: 25,
            },
            totalPages: {
              type: 'integer',
              minimum: 0,
              example: 3,
            },
          },
        },

        PaginatedChatMessages: {
          allOf: [
            { $ref: '#/components/schemas/ApiSuccess' },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ChatResponse' },
                    },
                    total: { type: 'integer', example: 25 },
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 10 },
                    totalPages: { type: 'integer', example: 3 },
                  },
                },
              },
            },
          ],
        },

        // Health Check Schema
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T12:00:00.000Z',
            },
            version: {
              type: 'string',
              example: '1.0.0',
            },
            uptime: {
              type: 'number',
              example: 1234.567,
              description: 'Uptime in seconds',
            },
          },
        },
      },

      // Response Templates
      responses: {
        BadRequest: {
          description: 'Bad Request - Validation Error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              example: {
                success: false,
                error: {
                  code: 'VALIDATION_ERROR',
                  message: 'userId must be a UUID',
                  details: 'Validation failed on request body',
                },
              },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized - Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              example: {
                success: false,
                error: {
                  code: 'UNAUTHORIZED',
                  message: 'Authentication required',
                },
              },
            },
          },
        },
        PaymentRequired: {
          description: 'Payment Required - Quota exceeded',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              example: {
                success: false,
                error: {
                  code: 'QUOTA_EXCEEDED',
                  message: 'No active subscription with available quota',
                },
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              example: {
                success: false,
                error: {
                  code: 'RESOURCE_NOT_FOUND',
                  message: 'User not found',
                },
              },
            },
          },
        },
        TooManyRequests: {
          description: 'Too Many Requests - Rate limit exceeded',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              example: {
                success: false,
                error: {
                  code: 'RATE_LIMIT_EXCEEDED',
                  message: 'Too many requests from this IP, please try again later',
                },
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              example: {
                success: false,
                error: {
                  code: 'INTERNAL_ERROR',
                  message: 'Internal server error',
                },
              },
            },
          },
        },
      },

      // Parameters
      parameters: {
        UserIdPath: {
          name: 'userId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'User ID',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        SubscriptionIdPath: {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'Subscription ID',
          example: '223e4567-e89b-12d3-a456-426614174000',
        },
        PageQuery: {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
          description: 'Page number for pagination',
        },
        LimitQuery: {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
          },
          description: 'Number of items per page',
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'System health and status endpoints',
      },
      {
        name: 'Chat',
        description: 'AI chat functionality with quota management',
      },
      {
        name: 'Subscriptions',
        description: 'Subscription management for premium features',
      },
      {
        name: 'Users',
        description: 'User management and profile operations',
      },
    ],
  },
  apis: [
    './src/presentation/routes/*.ts',
    './src/presentation/controllers/*.ts',
    './src/infrastructure/swagger/paths/*.yaml',
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
