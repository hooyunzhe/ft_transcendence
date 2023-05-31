import { User } from 'src/users/entities/user.entity';

export class NewRequestDto {
  sender: User;
  receiver: {
    id: number;
  };
}
