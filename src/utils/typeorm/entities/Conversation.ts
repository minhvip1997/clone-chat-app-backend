import { ConversationIdentityType } from 'src/utils/types';
import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { Participant } from './Participant';

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

  @ManyToMany(() => Participant, (participant) => participant.conversations)
  participants: Participant[];
}
