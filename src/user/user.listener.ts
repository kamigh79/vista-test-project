import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserEvent } from './user.event';
import { UserService } from './user.service';

@Injectable()
export class UserListener {
  constructor(private readonly userService: UserService) {}

  @OnEvent('updateSocketId')
  async handleUserEvent(event: UserEvent) {
    const user = await this.userService.findByEmail(event.email);
    if (!user) {
      return;
    }
    await this.userService.update(user.id, {
      socketId: event.socketId,
    });
  }
}
