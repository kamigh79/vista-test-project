import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserController } from './user.controller';
import { MessageModule } from 'src/messege/messege.module';
import { UserListener } from './user.listener';

@Module({
  imports: [
    MessageModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserListener],
  exports: [UserService, UserListener],
})
export class UserModule {}
