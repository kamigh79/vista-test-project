import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { GatewayModule } from './gateway/gateway.module';
import { TokenModule } from './token/jwt.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './messege/messege.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    GatewayModule,
    TokenModule,
    UserModule,
    MessageModule,
    HttpModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URI, {
      dbName: process.env.MONGO_DB_DATABASE,
      connectionFactory: (connection) => {
        if (connection.readyState) {
          console.log('Mongo database connected successfully.');
        }

        return connection;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
