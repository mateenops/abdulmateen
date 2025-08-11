import 'reflect-metadata';
import { AppDataSource } from '../config';
import { UserSeeder } from './UserSeeder';
import { SubscriptionSeeder } from './SubscriptionSeeder';
import { ChatMessageSeeder } from './ChatMessageSeeder';

class DatabaseSeeder {
  private userSeeder: UserSeeder;
  private subscriptionSeeder: SubscriptionSeeder;
  private chatMessageSeeder: ChatMessageSeeder;

  constructor() {
    this.userSeeder = new UserSeeder();
    this.subscriptionSeeder = new SubscriptionSeeder();
    this.chatMessageSeeder = new ChatMessageSeeder();
  }

  public async seedAll(options: { clear?: boolean } = {}): Promise<void> {
    console.log('🌱 Starting database seeding...');
    
    try {
      if (options.clear) {
        await this.clearAll();
      }

      // Seed users first (required for foreign keys)
      const users = await this.userSeeder.seed();
      
      // Seed subscriptions
      const subscriptions = await this.subscriptionSeeder.seed(users);
      
      // Seed chat messages
      const messages = await this.chatMessageSeeder.seed(users);

      console.log('✅ Database seeding completed successfully!');
      console.log(`📊 Summary:`);
      console.log(`   👥 Users: ${users.length}`);
      console.log(`   💳 Subscriptions: ${subscriptions.length}`);
      console.log(`   💬 Chat Messages: ${messages.length}`);
      
    } catch (error) {
      console.error('❌ Error during seeding:', error);
      throw error;
    }
  }

  public async clearAll(): Promise<void> {
    console.log('🧹 Clearing all seed data...');
    
    // Clear in reverse order due to foreign key constraints
    await this.chatMessageSeeder.clear();
    await this.subscriptionSeeder.clear();
    await this.userSeeder.clear();
    
    console.log('✅ All seed data cleared');
  }

  public async seedUsers(): Promise<void> {
    await this.userSeeder.seed();
  }

  public async seedSubscriptions(): Promise<void> {
    const users = await this.userSeeder.seed();
    await this.subscriptionSeeder.seed(users);
  }

  public async seedChatMessages(): Promise<void> {
    const users = await this.userSeeder.seed();
    await this.chatMessageSeeder.seed(users);
  }
}

// CLI script runner
async function runSeeder(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';
  const clear = args.includes('--clear');

  try {
    await AppDataSource.initialize();
    console.log('📦 Database connection established');

    const seeder = new DatabaseSeeder();

    switch (command) {
      case 'all':
        await seeder.seedAll({ clear });
        break;
      case 'users':
        if (clear) await seeder.clearAll();
        await seeder.seedUsers();
        break;
      case 'subscriptions':
        if (clear) await seeder.clearAll();
        await seeder.seedSubscriptions();
        break;
      case 'messages':
        if (clear) await seeder.clearAll();
        await seeder.seedChatMessages();
        break;
      case 'clear':
        await seeder.clearAll();
        break;
      default:
        console.log('❌ Unknown command. Available commands: all, users, subscriptions, messages, clear');
        process.exit(1);
    }

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('👋 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  runSeeder().catch(console.error);
}

export { DatabaseSeeder };