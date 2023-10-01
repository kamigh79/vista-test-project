import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [MyGateway],
  exports: [MyGateway],
})
export class GatewayModule {}
