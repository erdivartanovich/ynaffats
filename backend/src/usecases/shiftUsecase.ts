import * as shiftRepository from "../database/default/repository/shiftRepository";
import * as weekRepository from "../database/default/repository/weekRepository";
import { FindManyOptions, FindOneOptions } from "typeorm";
import Shift from "../database/default/entity/shift";
import { ICreateShift, IUpdateShift } from "../shared/interfaces";
import Week from "../database/default/entity/shiftWeek";
import { IValidateResult } from "../shared/interfaces/validate";

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
  console.log(week);
  const weekValid = await validateWeek(week);
  if (!weekValid.valid) {
    throw new Error(weekValid.validateMessage);
  }
  const shift = new Shift();
  shift.name = payload.name;
  shift.date = payload.date;
  shift.startTime = payload.startTime;
  shift.endTime = payload.endTime;
  shift.weekId = week.id;
  const shiftValid = await validateShift(shift);
  if (!shiftValid.valid) {
    throw new Error(shiftValid.validateMessage);
  }
  return shiftRepository.create(shift);
};

export const updateById = async (
  id: string,
  payload: IUpdateShift
): Promise<Shift> => {
  const weekValid = await validateWeek(payload.weekId);
  if (!weekValid.valid) {
    throw new Error(weekValid.validateMessage);
  }
  const shiftValid = await validateShift(payload);
  if (!shiftValid.valid) throw new Error(shiftValid.validateMessage);
  return shiftRepository.updateById(id, {
    ...payload,
  });
};

export const deleteById = async (id: string | string[]) => {
  const shift = await shiftRepository.findById(id as string);
  const weekValid = await validateWeek(shift.week);
  if (!weekValid.valid) {
    throw new Error(weekValid.validateMessage);
  }
  return shiftRepository.deleteById(id);
};

export const validateShift = async (
  shift: Partial<Shift>
): Promise<IValidateResult> => {
  let valid = true;
  let validateMessage = "";

  console.log("NEW SHIFT", shift.startTime, shift.endTime);
  const overlappingShift = await shiftRepository.query(
    `
    select count(id) from shift
    where not (
      ($1 = "startTime" and $2 = "endTime")
      or ($1 >= "endTime")
      or ($2 <= "startTime")
    );`,
    [shift.startTime, shift.endTime]
  );

  if (overlappingShift[0].count > 0) {
    valid = false;
    validateMessage = "Overlapping shift exists!";
  }
  return {
    valid,
    validateMessage: validateMessage,
  };
};

export const validateWeek = async (
  week: Week | string
): Promise<IValidateResult> => {
  let valid = true;
  let validateMessage = "";
  let theWeek: Week;
  theWeek =
    typeof week === "string"
      ? await weekRepository.findById(week as string)
      : week;
  if (theWeek.isPublished) {
    valid = false;
    validateMessage = "Cannot create/update/delete shift in published week!";
  }
  return {
    valid,
    validateMessage,
  };
};

export const publishOrUnpublish = (weekId: string, isPublish: boolean) => {
  return weekRepository.updateById(weekId, {
    isPublished: isPublish,
  });
};
