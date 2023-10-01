import { OnModuleInit, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserEvent, UserMessageEvent } from 'src/user/user.event';
import { UserService } from 'src/user/user.service';

@WebSocketGateway()
export class MyGateway implements OnModuleInit {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      const token = <string>socket.handshake.headers.auth;

      if (token) {
        const decode: any = this.jwtService.decode(token);

        if (decode) {
          this.eventEmitter.emitAsync(
            'updateSocketId',
            new UserEvent(decode.email, socket.id),
          );
        }
      }
      console.log('Connected');
    });
  }

  @SubscribeMessage('newMessage')
  async onNewMessage(
    @MessageBody() body: { message: string; receiverId: string },
    @ConnectedSocket() client,
  ) {
    const token = client.handshake.headers.auth;

    if (token) {
      const decode: any = this.jwtService.decode(token);

      //save to db
      this.eventEmitter.emitAsync(
        'newMessage',
        new UserMessageEvent(body.message, decode._id, body.receiverId),
      );

      //send real-time
      const receiver = await this.userService.findById(body.receiverId);
      if (receiver && receiver.socketId) {
        this.server.to(receiver.socketId).emit('onMessage', {
          notification: 'New Message',
          messege: body.message,
          senderId: decode._id,
        });
      }
    }
  }
}
