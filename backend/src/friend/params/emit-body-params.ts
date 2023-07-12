import { Friend } from '../entities/friend.entity';

export class InitConnectionEmitBodyParams {
  user_id: number;
}

export class NewRequestEmitBodyParams {
  outgoing_request: Friend;
  incoming_request: Friend;
}

export class FriendEmitBodyParams {
  friendship: Friend;
}
