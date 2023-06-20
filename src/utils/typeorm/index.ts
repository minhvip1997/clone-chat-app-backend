import { Conversation } from './entities/Conversation';
import { Message } from './entities/Message';
import { Session } from './entities/Session';
import { User } from './entities/User';
// import { Participant } from './entities/Participant';

const entities = [User, Session, Conversation, Message];

export default entities;

export { Conversation, Session, User, Message };

