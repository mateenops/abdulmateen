import { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config';

// Custom CSS for better Swagger UI appearance
const customCss = `
  .swagger-ui .topbar { display: none; }
  .swagger-ui .info .title { color: #3b82f6; }
  .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; margin: 20px 0; border-radius: 8px; }
  .swagger-ui .info { margin: 20px 0; }
  .swagger-ui .info .description { line-height: 1.6; }
  .swagger-ui .opblock.opblock-post { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
  .swagger-ui .opblock.opblock-get { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
  .swagger-ui .opblock.opblock-patch { border-color: #f59e0b; background: rgba(245, 158, 11, 0.05); }
  .swagger-ui .opblock.opblock-delete { border-color: #ef4444; background: rgba(239, 68, 68, 0.05); }
`;

// Custom Swagger UI options
const swaggerUiOptions: swaggerUi.SwaggerUiOptions = {
  customCss,
  customSiteTitle: 'AI Chat & Subscription API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    docExpansion: 'none',
    filter: true,
    showRequestDuration: true,
    tryItOutEnabled: true,
    requestSnippetsEnabled: true,
    requestSnippets: {
      generators: {
        'curl_bash': {
          title: 'cURL (bash)',
          syntax: 'bash'
        },
        'javascript_fetch': {
          title: 'JavaScript (fetch)',
          syntax: 'javascript'  
        },
        'node_native': {
          title: 'Node.js (native)',
          syntax: 'javascript'
        }
      },
      defaultExpanded: false,
      languages: ['curl_bash', 'javascript_fetch', 'node_native']
    }
  }
};

// Middleware to serve Swagger documentation
export const swaggerMiddleware = [
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
];

// Middleware to serve swagger.json
export const swaggerJsonMiddleware = (req: Request, res: Response): void => {
  res.json(swaggerSpec);
};

// Enhanced health check with API documentation info
export const enhancedHealthCheck = (req: Request, res: Response): void => {
  const startTime = process.hrtime();
  const [seconds, nanoseconds] = process.hrtime(startTime);
  const uptime = process.uptime();

  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: uptime,
    environment: process.env.NODE_ENV || 'development',
    documentation: {
      swagger: '/api-docs',
      json: '/api-docs/json',
      postman: '/api-docs/postman.json'
    },
    endpoints: {
      health: '/health',
      chat: '/api/chat',
      subscriptions: '/api/subscriptions'
    }
  });
};