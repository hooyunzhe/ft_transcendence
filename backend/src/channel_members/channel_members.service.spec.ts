import { Test, TestingModule } from '@nestjs/testing';
import { ChannelMembersService } from './channel_members.service';

describe('ChannelMembersService', () => {
  let service: ChannelMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelMembersService],
    }).compile();

    service = module.get<ChannelMembersService>(ChannelMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
