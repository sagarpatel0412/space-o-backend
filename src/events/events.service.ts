import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectModel } from '@nestjs/sequelize';
import { EventsModel } from './model/events.model'; // Adjust the path
import { EventImageModel } from './model/event-images.model'; // Adjust the path
import { Request, Response } from 'express';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EventsModel)
    private readonly eventModel: typeof EventsModel,
    @InjectModel(EventImageModel)
    private readonly eventImageModel: typeof EventImageModel,
    // private sequelize: Sequelize,
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

  async getPaginatedEvents(
    page: string | number,
    limit: string | number,
    req: Request,
    res: Response,
  ) {
    try {
      const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
      const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
      const offset = (pageNum - 1) * limitNum;

      const { name, startDate, endDate, q, sortBy, order } = req.query;

      let whereClause: any = {};

      if (name) {
        whereClause.name = name;
      }

      if (startDate) {
        whereClause.start_date = startDate;
      }

      if (endDate) {
        whereClause.end_date = endDate;
      }

      if (q) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
        ];
      }

      let orderClause: any = [['created_at', 'DESC']];
      if (sortBy) {
        const sortOrder =
          order &&
          (String(order).toUpperCase() === 'ASC' ||
            String(order).toUpperCase() === 'DESC')
            ? String(order).toUpperCase()
            : 'DESC';
        orderClause = [[String(sortBy), sortOrder]];
      }
      const { count, rows } = await this.eventModel.findAndCountAll({
        limit: limitNum,
        offset,
        where: whereClause,
        include: [
          {
            model: EventImageModel,
            as: 'events_images',
          },
        ],
        order: orderClause,
      });

      const totalPages = Math.ceil(count / limitNum);

      return res.status(200).json({
        status: 200,
        message: 'Events fetched successfully.',
        data: { events: rows },
        total: count,
        currentPage: pageNum,
        totalPages,
      });
    } catch (error: any) {
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
