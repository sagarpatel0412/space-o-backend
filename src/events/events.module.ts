import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { EventsModel } from './model/events.model';
import { EventImageModel } from './model/event-images.model';

@Module({
  imports: [
    ConfigModule.forRoot({ expandVariables: true }),
    SequelizeModule.forFeature([EventsModel, EventImageModel]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
