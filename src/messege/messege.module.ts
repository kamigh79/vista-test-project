import { Module } from '@nestjs/common';
import { MessageService } from './messege.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Messege, MessegeSchema } from './messege.schema';
import { MessageListener } from './message.listener';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Messege.name,
        schema: MessegeSchema,
      },
    ]),
  ],

  providers: [MessageService, MessageListener],
  exports: [MessageService],
})
export class MessageModule {}
