import * as shiftRepository from "../database/default/repository/shiftRepository";
import * as weekRepository from "../database/default/repository/weekRepository";
import { Between, FindManyOptions, FindOneOptions } from "typeorm";
import Shift from "../database/default/entity/shift";
import { ICreateShift, IUpdateShift } from "../shared/interfaces";
import Week from "../database/default/entity/shiftWeek";

export const find = async (opts: FindManyOptions<Shift>): Promise<Shift[]> => {
  return shiftRepository.find(opts);
};

export const findById = async (
  id: string,
  opts?: FindOneOptions<Shift>
): Promise<Shift> => {
  return shiftRepository.findById(id, opts);
};

export const create = async (payload: ICreateShift): Promise<Shift> => {
  const week = await weekRepository.findOrCreate(new Date(payload.date));
  if (validateWeek(week)) {
    const shift = new Shift();
    shift.name = payload.name;
    shift.date = payload.date;
    shift.startTime = payload.startTime;
    shift.endTime = payload.endTime;
    shift.weekId = week.id;
    if (validateShift(shift)) {
      return shiftRepository.create(shift);
    }
  }
};

export const updateById = async (
  id: string,
  payload: IUpdateShift
): Promise<Shift> => {
  if (validateShift(payload)) {
    return shiftRepository.updateById(id, {
      ...payload,
    });
  }
};

export const deleteById = async (id: string | string[]) => {
  return shiftRepository.deleteById(id);
};

export const validateShift = async (shift: Partial<Shift>) => {
  const overlappingShift = await shiftRepository.find({
    where: [
      { startTime: Between(shift.startTime, shift.endTime) },
      { endTime: Between(shift.startTime, shift.endTime) },
    ],
  });

  if (overlappingShift.length) {
    throw new Error("Overlapping shift exist!");
  }
  return true;
};

export const validateWeek = (week: Week) => {
  if (week.isPublish) {
    throw new Error("Shift week already published!");
  }
  return true;
};
