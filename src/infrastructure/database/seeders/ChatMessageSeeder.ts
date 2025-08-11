import { Repository } from 'typeorm';
import { ChatMessage } from '../../../domain/entities/ChatMessage';
import { User } from '../../../domain/entities/User';
import { AppDataSource } from '../config';
import { subDays, subHours, subMinutes } from 'date-fns';

export interface ChatMessageSeedData {
  id: string;
  userId: string;
  question: string;
  answer: string;
  tokensUsed: number;
  createdAt: Date;
}

export class ChatMessageSeeder {
  private repository: Repository<ChatMessage>;

  constructor() {
    this.repository = AppDataSource.getRepository(ChatMessage);
  }

  private getChatMessageSeedData(): ChatMessageSeedData[] {
    const now = new Date();

    const sampleQA = [
      {
        question: "What is artificial intelligence?",
        answer: "Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines that can perform tasks that typically require human intelligence. This includes learning, reasoning, problem-solving, perception, and language understanding. AI systems can be narrow (designed for specific tasks) or general (capable of performing any intellectual task that a human can do).",
        tokens: 85
      },
      {
        question: "How does machine learning work?",
        answer: "Machine learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed. It works by using algorithms to analyze data, identify patterns, and make predictions or decisions. The process involves training a model on a dataset, validating its performance, and then using it to make predictions on new, unseen data.",
        tokens: 92
      },
      {
        question: "What are the benefits of cloud computing?",
        answer: "Cloud computing offers numerous benefits including cost savings (pay-as-you-use model), scalability (easily scale resources up or down), accessibility (access from anywhere with internet), reliability (high uptime and disaster recovery), security (professional-grade security measures), and reduced IT maintenance overhead.",
        tokens: 78
      },
      {
        question: "Explain blockchain technology",
        answer: "Blockchain is a distributed ledger technology that maintains a continuously growing list of records (blocks) that are linked and secured using cryptography. Each block contains a cryptographic hash of the previous block, timestamp, and transaction data. It's decentralized, immutable, and transparent, making it ideal for applications like cryptocurrencies, supply chain tracking, and smart contracts.",
        tokens: 103
      },
      {
        question: "What is the difference between SQL and NoSQL databases?",
        answer: "SQL databases are relational databases that use structured query language (SQL) for defining and manipulating data. They have a predefined schema and support ACID transactions. NoSQL databases are non-relational and can handle unstructured data with flexible schemas. They're designed for scalability and can be document-based, key-value, column-family, or graph databases.",
        tokens: 96
      },
      {
        question: "How do I improve my coding skills?",
        answer: "To improve coding skills: 1) Practice regularly with coding challenges, 2) Read and contribute to open-source projects, 3) Learn new programming languages and frameworks, 4) Build personal projects, 5) Code review others' work, 6) Stay updated with industry trends, 7) Join coding communities, and 8) Focus on understanding algorithms and data structures.",
        tokens: 89
      },
      {
        question: "What is DevOps?",
        answer: "DevOps is a set of practices that combines software development (Dev) and IT operations (Ops) to shorten the development lifecycle and provide continuous delivery with high software quality. It emphasizes collaboration, automation, monitoring, and communication between development and operations teams throughout the entire software development process.",
        tokens: 71
      },
      {
        question: "Explain microservices architecture",
        answer: "Microservices architecture is an approach to building applications as a collection of small, independent services that communicate over well-defined APIs. Each service is responsible for a specific business function, can be developed and deployed independently, and typically uses different technologies. This approach offers benefits like scalability, flexibility, and fault isolation.",
        tokens: 87
      }
    ];

    const messages: ChatMessageSeedData[] = [];
    const userIds = [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174002',
      '123e4567-e89b-12d3-a456-426614174003',
      '123e4567-e89b-12d3-a456-426614174004',
    ];

    let messageId = 1;

    // Generate messages for each user
    userIds.forEach((userId, userIndex) => {
      const messageCount = Math.floor(Math.random() * 8) + 3; // 3-10 messages per user

      for (let i = 0; i < messageCount; i++) {
        const qaIndex = Math.floor(Math.random() * sampleQA.length);
        const qa = sampleQA[qaIndex];
        
        // Distribute messages over the last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        const hoursAgo = Math.floor(Math.random() * 24);
        const minutesAgo = Math.floor(Math.random() * 60);
        
        const createdAt = subMinutes(subHours(subDays(now, daysAgo), hoursAgo), minutesAgo);

        messages.push({
          id: `323e4567-e89b-12d3-a456-42661417${messageId.toString().padStart(4, '0')}`,
          userId,
          question: (qa as any).question,
          answer: (qa as any).answer,
          tokensUsed: (qa as any).tokens + Math.floor(Math.random() * 20) - 10, // Add some variation
          createdAt,
        });

        messageId++;
      }
    });

    return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public async seed(users: User[]): Promise<ChatMessage[]> {
    console.log('🌱 Seeding chat messages...');

    const seedData = this.getChatMessageSeedData();
    const messages: ChatMessage[] = [];

    for (const messageData of seedData) {
      const existingMessage = await this.repository.findOne({
        where: { id: messageData.id }
      });

      if (!existingMessage) {
        const message = this.repository.create(messageData);
        const savedMessage = await this.repository.save(message);
        messages.push(savedMessage);
      } else {
        messages.push(existingMessage);
      }
    }

    console.log(`✅ Chat messages seeded: ${messages.length}`);
    return messages;
  }

  public async clear(): Promise<void> {
    console.log('🧹 Clearing chat messages...');
    await this.repository.delete({});
    console.log('✅ Chat messages cleared');
  }
}