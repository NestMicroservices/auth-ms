import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { bcryptAdapter, Services } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('AuthService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  constructor(
    @Inject(Services.NATS_SERVICE) private readonly client: ClientProxy,
  ) {
    super();
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, name, password } = registerUserDto;
    try {
      const isUserExist = await this.user.findUnique({ where: { email } });

      if (isUserExist) {
        throw new RpcException({
          status: 400,
          message: 'User already exists',
        });
      }

      const user = await this.user.create({
        data: { email, name, password: await bcryptAdapter.hash(password) },
      });

      const { password: _, ...rest } = user;
      return { user: rest, token: 'token' };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const user = await this.user.findUnique({
        where: { email: loginUserDto.email },
      });

      if (!user) {
        throw new RpcException({
          status: 401,
          message: 'Invalid credentials',
        });
      }

      const isAuth = await bcryptAdapter.compare(
        loginUserDto.password,
        user.password,
      );

      if (!isAuth) {
        throw new RpcException({
          status: 401,
          message: 'Invalid credentials',
        });
      }

      const { password: _, ...rest } = user;
      return { user: rest, token: 'token' };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
