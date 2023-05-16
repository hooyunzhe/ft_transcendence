import { Test, TestingModule } from '@nestjs/testing';
import { ChannelMembersController } from './channel_members.controller';
import { ChannelMembersService } from './channel_members.service';

describe('ChannelMembersController', () => {
  let controller: ChannelMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelMembersController],
      providers: [ChannelMembersService],
    }).compile();

    controller = module.get<ChannelMembersController>(ChannelMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
