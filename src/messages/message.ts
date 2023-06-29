import { Message } from '../utils/typeorm';
import { CreateMessageParams, CreateMessageResponse } from '../utils/types';

export interface IMessagesService {
  createMessage(params: CreateMessageParams): Promise<CreateMessageResponse>;
  getMessagesByConversationId(conversationId: number): Promise<Message[]>;
}