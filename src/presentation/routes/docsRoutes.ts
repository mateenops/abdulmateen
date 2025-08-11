import { Router } from 'express';
import { swaggerMiddleware, swaggerJsonMiddleware } from '../../infrastructure/swagger/middleware';

export const createDocsRoutes = (): Router => {
  const router = Router();

  // Swagger UI documentation
  router.use('/', ...swaggerMiddleware);

  // Raw swagger.json
  router.get('/json', swaggerJsonMiddleware);

  // Postman collection export
  router.get('/postman.json', (req, res) => {
    // Convert Swagger to Postman collection format
    const postmanCollection = {
      info: {
        name: 'AI Chat & Subscription API',
        description: 'API collection for AI Chat & Subscription System',
        version: '1.0.0',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      auth: {
        type: 'bearer',
        bearer: [
          {
            key: 'token',
            value: '{{auth_token}}',
            type: 'string'
          }
        ]
      },
      variable: [
        {
          key: 'base_url',
          value: 'http://localhost:3000',
          type: 'string'
        },
        {
          key: 'user_id',
          value: '123e4567-e89b-12d3-a456-426614174000',
          type: 'string'
        }
      ],
      item: [
        {
          name: 'Health Check',
          request: {
            method: 'GET',
            header: [],
            url: {
              raw: '{{base_url}}/health',
              host: ['{{base_url}}'],
              path: ['health']
            }
          }
        },
        {
          name: 'Send Chat Message',
          request: {
            method: 'POST',
            header: [
              {
                key: 'Content-Type',
                value: 'application/json'
              }
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify({
                userId: '{{user_id}}',
                question: 'What is artificial intelligence?'
              })
            },
            url: {
              raw: '{{base_url}}/api/chat',
              host: ['{{base_url}}'],
              path: ['api', 'chat']
            }
          }
        },
        {
          name: 'Create Subscription',
          request: {
            method: 'POST',
            header: [
              {
                key: 'Content-Type',
                value: 'application/json'
              }
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify({
                userId: '{{user_id}}',
                tier: 'BASIC',
                billingCycle: 'MONTHLY',
                autoRenew: true
              })
            },
            url: {
              raw: '{{base_url}}/api/subscriptions',
              host: ['{{base_url}}'],
              path: ['api', 'subscriptions']
            }
          }
        },
        {
          name: 'Get User Subscriptions',
          request: {
            method: 'GET',
            header: [],
            url: {
              raw: '{{base_url}}/api/subscriptions/user/{{user_id}}',
              host: ['{{base_url}}'],
              path: ['api', 'subscriptions', 'user', '{{user_id}}']
            }
          }
        }
      ]
    };

    res.json(postmanCollection);
  });

  return router;
};
