import { ConversationIdentityType } from 'src/utils/types';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'conversations' })
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authorId: number;

  @Column()
  recipientId: number;

  @Column()
  identity: ConversationIdentityType;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  creator: User;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  recipient: User;
}
