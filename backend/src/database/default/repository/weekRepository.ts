import { endOfWeek, startOfWeek } from "date-fns";
import { getRepository } from "typeorm";
import Week from "../entity/shiftWeek";

export const findOrCreate = async (date: Date): Promise<Week> => {
  const weekRepository = getRepository(Week);
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  return (
    (await weekRepository.findOne({
      where: {
        startOfWeek: weekStart,
      },
    })) ??
    (await weekRepository.save({
      startOfWeek: weekStart,
      endOfWeek: weekEnd,
    }))
  );
};

export const updateById = async (id: string, payload: Partial<Week>) => {
  console.log("UPDATE WEEK", id);
  const weekRepository = getRepository(Week);
  await weekRepository.update(id, payload);
  return await weekRepository.findOne(id);
};

export const findById = async (id: string) => {
  const weekRepository = getRepository(Week);
  return await weekRepository.findOne(id);
};
