import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseTimestamp } from "./baseTimestamp";
import Shift from "./shift";

@Entity()
export default class Week extends BaseTimestamp {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({
    type: "date",
  })
  startOfWeek: Date;

  @Column({
    type: "date",
  })
  endOfWeek: Date;

  @Column({
    type: "bool",
  })
  isPublish: boolean;

  @OneToMany(() => Shift, (shift) => shift.week)
  shifts: Shift[];
}
