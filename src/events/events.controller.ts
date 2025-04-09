import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpUserId } from 'src/auth/decorators/http-user-id.decorator';
import { Request, Response } from 'express';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('create')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/events',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtName = extname(file.originalname);
          callback(null, `${uniqueSuffix}${fileExtName}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFiles() files: any[],
    @HttpUserId() userId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.eventsService.create(createEventDto, files, userId, req, res);
  }

  @Get('all')
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.eventsService.getPaginatedEvents(page, limit, req, res);
  }

  @Get('all/:id')
  find(
    @Param() id: number,
    @HttpUserId() userId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.eventsService.findOne(id, userId, req, res);
  }
}
