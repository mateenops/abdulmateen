import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/User';
import { AppDataSource } from '../config';

export interface UserSeedData {
  id: string;
  email: string;
  name: string;
  freeMessagesUsed: number;
  lastFreeQuotaReset: Date;
}

export class UserSeeder {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  private getUserSeedData(): UserSeedData[] {
    return [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'john.doe@example.com',
        name: 'John Doe',
        freeMessagesUsed: 0,
        lastFreeQuotaReset: new Date(),
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        freeMessagesUsed: 2,
        lastFreeQuotaReset: new Date(),
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174002',
        email: 'bob.wilson@example.com',
        name: 'Bob Wilson',
        freeMessagesUsed: 3,
        lastFreeQuotaReset: new Date(),
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174003',
        email: 'alice.johnson@example.com',
        name: 'Alice Johnson',
        freeMessagesUsed: 1,
        lastFreeQuotaReset: new Date(),
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174004',
        email: 'charlie.brown@example.com',
        name: 'Charlie Brown',
        freeMessagesUsed: 0,
        lastFreeQuotaReset: new Date(),
      },
    ];
  }

  public async seed(): Promise<User[]> {
    console.log('🌱 Seeding users...');

    const seedData = this.getUserSeedData();
    const users: User[] = [];

    for (const userData of seedData) {
      const existingUser = await this.repository.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const user = this.repository.create(userData);
        const savedUser = await this.repository.save(user);
        users.push(savedUser);
        console.log(`Created user: ${savedUser.email}`);
      } else {
        users.push(existingUser);
        console.log(`User already exists: ${existingUser.email}`);
      }
    }

    console.log(`Users seeded: ${users.length}`);
    return users;
  }

  public async clear(): Promise<void> {
    console.log('Clearing users...');
    await this.repository.delete({});
    console.log('Users cleared');
  }
}
