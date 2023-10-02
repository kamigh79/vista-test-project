import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserGuard } from 'src/guards/user.guard';
import { IndexUserQueryDto } from './dto/index.query';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  async signUp(@Request() req, @Body() inputs: CreateUserDto): Promise<object> {
    const user = await this.userService.findByEmail(inputs.email);

    if (user) {
      throw new Error('User is already created.');
    }

    if (inputs.password) {
      inputs.password = await bcrypt.hash(
        inputs.password,
        parseInt(process.env.SALT_OR_ROUND),
      );
    }

    const result = await this.userService.create(inputs);
    delete result['password'];

    return {
      message: 'User created successfully.',
      data: result,
    };
  }

  @Post('login')
  async login(@Body() inputs: LoginDto, @Request() req: any): Promise<object> {
    const user = await this.userService.findByEmail(inputs.email);

    if (user && user.password) {
      if (await bcrypt.compare(inputs.password, user.password)) {
        const token = this.jwtService.sign(user.toObject());
        return {
          message: 'Login to your account successfully.',
          data: {
            token: token,
          },
        };
      } else {
        throw new Error('Password is incorrect.');
      }
    } else {
      throw new Error('User not found.');
    }
  }

  @UseGuards(UserGuard)
  @Get('/')
  async showUsers(
    @Body() inputs: any,
    @Query() query: IndexUserQueryDto,
    @Request() req: any,
  ): Promise<object> {
    const users = await this.userService.index(query);
    const result = [];
    for (const user of users) {
      user.toObject();
      const data = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      };
      result.push(data);
    }
    console.log(result);

    return {
      message: 'User indexed successfully.',
      data: result,
    };
  }
}
