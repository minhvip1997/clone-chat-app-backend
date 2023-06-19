import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IConversationsService } from './conversations';
import { CreateConversationParams } from 'src/utils/types';
import { Participant } from 'src/utils/typeorm/entities/Participant';
import { Conversation, User } from 'src/utils/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Services } from 'src/utils/constants';
import { IParticipantsService } from 'src/participants/participants';
import { IUserService } from 'src/users/user';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ConversationsService implements IConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @Inject(Services.PARTICIPANTS)
    private readonly participantsService: IParticipantsService,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
  ) {}

  findConversationByParticipants(participants: number[]) {
    console.log(participants);
    return this.conversationRepository
      .createQueryBuilder('conversations')
      .leftJoinAndSelect('conversations.participants', 'participants')
      .where('participants.id IN (:...participants)', { participants })
      .getOne();
  }

  async find(id: number) {
    // return this.participantsService.findParticipantConversations(id);
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversations')
      .leftJoinAndSelect('conversations.participants', 'participants')
      .where('participants.id IN (:...participants)', { participants: [id] })
      .getMany();
    const promises = conversations.map((c) => {
      return this.conversationRepository
        .findOne(c.id, { relations: ['participants', 'participants.user'] })
        .then((conversationDB) => {
          console.log(conversationDB);
          const author = conversationDB.participants.find((p) => p.id === id);
          const recipient = conversationDB.participants.find(
            (p) => p.id !== id,
          );
          author.user = instanceToPlain(recipient.user) as User;
          recipient.user = instanceToPlain(recipient.user) as User;
          return { ...conversationDB, recipient };
        });
    });
    return Promise.all(promises);
  }

  async findConversationById(id: number): Promise<Conversation> {
    return this.conversationRepository.findOne(id, {
      relations: ['participants', 'participants.user'],
    });
  }

  async createConversation(user: User, params: CreateConversationParams) {
    const userDB = await this.userService.findUser({ id: user.id });
    const { authorId, recipientId } = params;
    const participants: Participant[] = [];
    const participationIDs = [authorId, recipientId];

    const existingConvo = await this.findConversationByParticipants(
      participationIDs,
    );

    // console.log(222, existingConvo);

    if (existingConvo) {
      throw new HttpException('Conversation Exists', HttpStatus.CONFLICT);
    }

    if (!userDB.participant) {
      const participant = await this.createParticipantAndSaveUser(
        userDB,
        authorId,
      );
      participants.push(participant);
    } else participants.push(userDB.participant);

    const recipient = await this.userService.findUser({ id: recipientId });
    if (!recipient)
      throw new HttpException('Recipient Not Found', HttpStatus.BAD_REQUEST);

    if (!recipient.participant) {
      const participant = await this.createParticipantAndSaveUser(
        recipient,
        recipientId,
      );
      participants.push(participant);
    } else participants.push(recipient.participant);

   
    

    const conversation = this.conversationRepository.create({
      participants,
    });

    console.log('participants', conversation);
    return this.conversationRepository.save(conversation);
  }

  public async createParticipantAndSaveUser(user: User, id: number) {
    const participant = await this.participantsService.createParticipant({
      id,
    });
    user.participant = participant;
    await this.userService.saveUser(user);
    return participant;
  }
}
