import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ChatMessage } from './ChatMessage';
import { Subscription } from './Subscription';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column({ default: 3 })
  freeMessagesUsed!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastFreeQuotaReset!: Date;

  @OneToMany(() => ChatMessage, message => message.user)
  messages!: ChatMessage[];

  @OneToMany(() => Subscription, subscription => subscription.user)
  subscriptions!: Subscription[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  public needsQuotaReset(): boolean {
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);
    
    return this.lastFreeQuotaReset < currentMonthStart;
  }

  public resetFreeQuota(): void {
    this.freeMessagesUsed = 0;
    this.lastFreeQuotaReset = new Date();
  }

  public canUseFreeMessage(): boolean {
    return this.freeMessagesUsed < 3;
  }

  public useFreeMessage(): void {
    if (!this.canUseFreeMessage()) {
      throw new Error('No free messages remaining');
    }
    this.freeMessagesUsed++;
  }
}