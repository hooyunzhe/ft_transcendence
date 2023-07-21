import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { RemoveMessageDto } from './dto/remove-message.dto';
import {
  MessageGetQueryParams,
  MessageSearchType,
} from './params/get-query-params';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() messageDto: CreateMessageDto): Promise<Message> {
    return this.messageService.create(messageDto);
  }

  @Get()
  async find(
    @Query() queryParams: MessageGetQueryParams,
  ): Promise<Message[] | Message | null> {
    switch (queryParams.search_type) {
      case MessageSearchType.ALL:
        return this.messageService.findAll();
      case MessageSearchType.ONE:
        return this.messageService.findOne(queryParams.search_number);
      case MessageSearchType.CHANNEL:
        return this.messageService.findMessagesInChannel(
          queryParams.search_number,
        );
      case MessageSearchType.USER:
        return this.messageService.findMessagesFromUser(
          queryParams.search_number,
          queryParams.second_search_number,
        );
    }
  }

  @Patch()
  async update(@Body() messageDto: UpdateMessageDto): Promise<void> {
    this.messageService.update(messageDto);
  }

  @Delete()
  async remove(@Body() messageDto: RemoveMessageDto): Promise<void> {
    this.messageService.remove(messageDto);
  }
}
