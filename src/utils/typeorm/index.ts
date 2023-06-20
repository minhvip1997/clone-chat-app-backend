import { Conversation } from './entities/Conversation';
import { Session } from './entities/Session';
import { User } from './entities/User';
// import { Participant } from './entities/Participant';

const entities = [User, Session, Conversation];

export default entities;

export { Conversation, Session, User };

