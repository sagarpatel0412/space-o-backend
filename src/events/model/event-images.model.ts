import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { EventsModel } from './events.model';

@Table({ tableName: 'event_images' })
export class EventImageModel extends Model<EventImageModel> {
  @ForeignKey(() => EventsModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  event_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => EventsModel)
  events: EventsModel;
}
