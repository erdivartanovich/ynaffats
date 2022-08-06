import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseTimestamp } from "./baseTimestamp";
import Week from "./shiftWeek";

@Entity()
export default class Shift extends BaseTimestamp {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({
    type: "date",
  })
  date: string;

  @Column({
    type: "time",
  })
  startTime: string;

  @Column({
    type: "time",
  })
  endTime: string;

  @Column({
    type: "uuid",
  })
  weekId: string;

  @ManyToOne(() => Week, (week) => week.shifts, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "weekId",
    referencedColumnName: "id",
  })
  week: Week;
}
