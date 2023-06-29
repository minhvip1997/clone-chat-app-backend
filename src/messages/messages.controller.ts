import { Body, Controller, Inject, Post, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { IMessagesService } from './message';
import { EventEmitter2 } from '@nestjs/event-emitter';


@Controller(Routes.MESSAGES)
export class MessagesController {
  constructor(
    @Inject(Services.MESSAGES)
    private readonly messageService: IMessagesService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createMessage(
    @AuthUser() user: User,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    const response = await this.messageService.createMessage({
      ...createMessageDto,
      user,
    });
    this.eventEmitter.emit('message.create', response );
    return;
  }

  @Get(':conversationId')
  async getMessagesFromConversation(
    @AuthUser() user: User,
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    const messages = await this.messageService.getMessagesByConversationId(
      conversationId,
    );
    return { id: conversationId, messages };
  }
}