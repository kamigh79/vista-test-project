import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserMessageEvent } from 'src/user/user.event';
import { MessageService } from './messege.service';

@Injectable()
export class MessageListener {
  constructor(private readonly messageService: MessageService) {}

  @OnEvent('newMessage')
  async newMessageEvent(event: UserMessageEvent) {
    await this.messageService.create({
      messege: event.message,
      receiverId: event.receiverId,
      senderId: event.senderId,
    });
  }
}
