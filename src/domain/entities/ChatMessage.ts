import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @ManyToOne(() => User, user => user.messages)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column('text')
  question!: string;

  @Column('text')
  answer!: string;

  @Column('int')
  tokensUsed!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
