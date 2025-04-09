import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import * as Validation from 'joi';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      validationSchema: Validation.object({
        SALT: Validation.string().required(),
        PORT: Validation.number().port().required(),
        // DB
        MYSQL_HOST: Validation.string().required(),
        MYSQL_PORT: Validation.number().port().required(),
        MYSQL_DB: Validation.string().required(),
        MYSQL_USERNAME: Validation.string().required(),
        MYSQL_PASSWORD: Validation.string().required(),
        JWT_SECRET: Validation.string().required(),
        JWT_EXPIRES: Validation.number().required(),
      }),
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT!),
      database: process.env.MYSQL_DB,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      autoLoadModels: true,
      synchronize: false,
    }),
    AuthModule,
    UsersModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
