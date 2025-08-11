# AI Chat & Subscription System

A robust AI chat system with subscription management built using Clean Architecture principles, TypeScript, and PostgreSQL.

## 🏗️ Architecture

This project follows Clean Architecture (Domain-Driven Design) with the following layers:

- **Domain Layer**: Entities, repositories interfaces, and domain services
- **Application Layer**: Use cases, DTOs, and application services
- **Infrastructure Layer**: Database, repositories implementations
- **Presentation Layer**: Controllers, routes, and middleware

## 🚀 Features

### AI Chat Module
- ✅ Process user questions with mocked OpenAI responses
- ✅ Track token usage and store conversations
- ✅ Monthly free quota system (3 messages per user)
- ✅ Subscription-based quota management
- ✅ Multiple subscription tiers support
- ✅ Automatic quota deduction from best available subscription
- ✅ Simulated API response delays

### Subscription Module
- ✅ Multiple subscription tiers (Basic, Pro, Enterprise)
- ✅ Monthly and yearly billing cycles
- ✅ Auto-renewal functionality
- ✅ Payment failure simulation
- ✅ Subscription cancellation
- ✅ Usage tracking and quota management

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Validation**: class-validator & class-transformer
- **Security**: Helmet, CORS, Rate Limiting
- **Code Quality**: ESLint, Prettier

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```
4. Run docker:
   ```bash
   docker compose up -d
   ```

5. Seed Database:
   ```bash
   npm run db:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## 🔗 API Endpoints

### Chat Module
```
POST /api/chat
Content-Type: application/json
{
  "userId": "uuid",
  "question": "Your question here"
}
```

### Subscription Module
```
POST /api/subscriptions
Content-Type: application/json
{
  "userId": "uuid",
  "tier": "BASIC|PRO|ENTERPRISE",
  "billingCycle": "MONTHLY|YEARLY",
  "autoRenew": true
}

GET /api/subscriptions/user/:userId
PATCH /api/subscriptions/:id/cancel
```

## 💾 Database Schema

### Users
- id (UUID, Primary Key)
- email (String, Unique)
- name (String)
- freeMessagesUsed (Integer, Default: 0)
- lastFreeQuotaReset (Timestamp)

### Chat Messages
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- question (Text)
- answer (Text)
- tokensUsed (Integer)
- createdAt (Timestamp)

### Subscriptions
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- tier (Enum: BASIC, PRO, ENTERPRISE)
- billingCycle (Enum: MONTHLY, YEARLY)
- maxMessages (Integer)
- messagesUsed (Integer, Default: 0)
- price (Decimal)
- startDate (Timestamp)
- endDate (Timestamp)
- renewalDate (Timestamp)
- autoRenew (Boolean, Default: true)
- status (Enum: ACTIVE, INACTIVE, EXPIRED, CANCELLED)

## 🎯 Business Rules

### Free Quota
- Each user gets 3 free messages per month
- Quota resets automatically on the 1st of each month
- Free messages are used before subscription quota

### Subscription Tiers
- **Basic**: 10 messages/month at $9.99/month or $99.99/year
- **Pro**: 100 messages/month at $29.99/month or $299.99/year
- **Enterprise**: Unlimited messages at $99.99/month or $999.99/year

### Quota Management
- System uses subscription with highest remaining quota first
- Throws structured errors when quota is exceeded
- Tracks usage across all subscriptions

### Auto-Renewal
- Subscriptions auto-renew if enabled
- Random payment failures (10% chance)
- Failed payments mark subscription as inactive

## 📝 Scripts

- `npm run build` - Build for production
- `npm run dev` - Start development server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run db:migrate` - Run database migrations

## 🔒 Security Features

- Helmet for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation with class-validator
- SQL injection protection via TypeORM
- Environment variable configuration

## 📊 Error Handling

The system includes comprehensive error handling with structured error responses:

```json
{
  "success": false,
  "error": {
    "code": "QUOTA_EXCEEDED",
    "message": "No active subscription with available quota"
  }
}
```

Error codes include:
- `VALIDATION_ERROR`
- `QUOTA_EXCEEDED`
- `SUBSCRIPTION_REQUIRED`
- `PAYMENT_FAILED`
- `RESOURCE_NOT_FOUND`
- `INTERNAL_ERROR`

## 📈 Monitoring

- Health check endpoint: `GET /health`
- Comprehensive logging
- Error tracking
- Database connection monitoring

This implementation showcases enterprise-level TypeScript DDD development with proper architecture, error handling, and business logic separation.