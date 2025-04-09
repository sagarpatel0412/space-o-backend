import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { AllowUnauthorized } from 'src/auth/decorators/allow-unauthorized.decorator';
import { HttpUserId } from 'src/auth/decorators/http-user-id.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @AllowUnauthorized()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  registerUser(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.usersService.registerUser(createUserDto, req, res);
  }

  @Post('login')
  @AllowUnauthorized()
  loginUser(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.usersService.loginUser(createUserDto, req, res);
  }

  @Get('me')
  @AllowUnauthorized()
  getProfile(
    @HttpUserId() userId: number,
    @Req()
    req: Request,
    @Res() res: Response,
  ) {
    return this.usersService.getProfile(userId, req, res);
  }
}
