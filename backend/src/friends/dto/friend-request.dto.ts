import { User } from 'src/users/entities/user.entity';

export class FriendRequestDto {
  sender: User;
  receiver: {
    id: number;
  };
}
