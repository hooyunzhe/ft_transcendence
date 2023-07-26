import { Friend } from '../entities/friend.entity';

export class NewRequestEmitBodyParams {
  outgoing_request: Friend;
  incoming_request: Friend;
}
