import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersModel } from './model/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel) private userModel: typeof UsersModel,
    private readonly configService: ConfigService,
    private authService: AuthService,
  ) {}

  private hashPassword(pwd: string): string {
    return crypto
      .createHash('sha256')
      .update(`${pwd}${this.configService.get<string>('SALT')}`)
      .digest('base64');
  }

  public async registerUser(
    createUserDto: CreateUserDto,
    req: Request,
    res: Response,
  ) {
    try {
      const getUser = await this.userModel.findOne({
        where: { email: createUserDto.email },
      });
      if (!getUser) {
        const createUser = new UsersModel();
        createUser.email = createUserDto.email;
        createUser.password = this.hashPassword(createUserDto.password);
        const userContent = await this.userModel.create(createUser);
        return res.status(201).json({
          status: 201,
          message: 'User created Successully',
        });
      } else {
        throw new ConflictException(`user already exists`);
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'Something went wrong',
      });
    }
  }

  public async loginUser(
    createUserDto: CreateUserDto,
    req: Request,
    res: Response,
  ) {
    try {
      const pass = this.hashPassword(createUserDto.password);
      const user = await this.userModel.findOne({
        where: { email: createUserDto.email, password: pass },
      });
      if (!user) {
        throw new NotFoundException(`User Not found`);
      } else {
        const token = await this.authService.createAccessToken({
          sub: user.id,
          email: user.email,
        });

        return res.status(201).json({
          status: 201,
          message: 'User created Successully',
          data: { user, token },
        });
      }
    } catch (error) {
      console.log(error, 'error');
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

  public async getProfile(userId: number, req: Request, res: Response) {
    try {
      const user = await this.userModel.findOne({
        where: { id: userId },
      });
      if (user) {
        return res.status(201).json({
          status: 201,
          message: 'User created Successully',
          data: { user },
        });
      } else {
        throw new NotFoundException(`No user found`);
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'Something went wrong',
      });
    }
  }
}
