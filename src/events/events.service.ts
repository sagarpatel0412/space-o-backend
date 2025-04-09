import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectModel } from '@nestjs/sequelize';
import { EventsModel } from './model/events.model'; // Adjust the path
import { EventImageModel } from './model/event-images.model'; // Adjust the path
import { Request, Response } from 'express';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EventsModel)
    private readonly eventModel: typeof EventsModel,
    @InjectModel(EventImageModel)
    private readonly eventImageModel: typeof EventImageModel,
  ) {}

  async create(
    createEventDto: CreateEventDto,
    files: any,
    userId: any,
    req: Request,
    res: Response,
  ) {
    try {
      const eventCreate = new EventsModel();
      eventCreate.user_id = userId;
      eventCreate.name = createEventDto.name;
      eventCreate.description = createEventDto.description;
      eventCreate.start_date = createEventDto.startDate as any;
      eventCreate.end_date = createEventDto.endDate as any;
      eventCreate.total_guests = createEventDto.totalGuests as any;

      const event = await this.eventModel.create(eventCreate);

      const imageLinks: any = [];
      for (const file of files) {
        console.log(file);
        const eventCrImage = new EventImageModel();
        eventCrImage.event_id = event.id;
        eventCrImage.image = file.path;
        const eventImage = await this.eventImageModel.create(eventCrImage);
        imageLinks.push(eventCrImage.image);
      }
      return res.status(201).json({
        status: 201,
        message: 'Event created successfully with images.',
        data: { event, imageLinks },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

  async getPaginatedEvents(page, limit, req: Request, res: Response) {
    try {
      const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
      const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;

      const offset = (pageNum - 1) * parseInt(limitNum);

      const { count, rows } = await this.eventModel.findAndCountAll({
        limit: limitNum,
        offset,
        include: [
          {
            model: EventImageModel,
            as: 'events_images',
          },
        ],
        order: [['created_at', 'DESC']],
      });

      const totalPages = Math.ceil(count / limit);

      return res.status(201).json({
        status: 201,
        message: 'Event created successfully with images.',
        data: { events: rows },
        total: count,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

  async findOne(id: any, userId: number, req: Request, res: Response) {
    try {
      const eventData = await this.eventModel.findOne({
        where: { id: id.id, user_id: userId },
        include: [
          {
            model: EventImageModel,
            as: 'events_images',
          },
        ],
        order: [['created_at', 'DESC']],
      });

      return res.status(201).json({
        status: 201,
        message: 'Event created successfully with images.',
        data: eventData,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }
}
