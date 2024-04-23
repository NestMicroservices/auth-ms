import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NastModule } from 'src/transports/nast.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [NastModule],
})
export class AuthModule {}
