import { DataSource } from 'typeorm';
import { User } from '../../domain/entities/User';
import { ChatMessage } from '../../domain/entities/ChatMessage';
import { Subscription } from '../../domain/entities/Subscription';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'postgres',
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, ChatMessage, Subscription],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
});
