import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UsersModel } from '../../users/model/users.model';
import { EventImageModel } from './event-images.model';

@Table({ tableName: 'events' })
export class EventsModel extends Model<EventsModel> {
  @ForeignKey(() => UsersModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  start_date: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  end_date: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  total_guests: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => UsersModel)
  users: UsersModel;

  @HasMany(() => EventImageModel)
  events_images: EventImageModel[];
}
