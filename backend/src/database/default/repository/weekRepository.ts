import { endOfWeek, startOfWeek } from "date-fns";
import { getRepository } from "typeorm";
import Week from "../entity/shiftWeek";

export const findOrCreate = async (date: Date): Promise<Week> => {
  const weekRepository = getRepository(Week);
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  return;
  (await weekRepository.findOne({
    where: {
      startOfWeek: weekStart,
    },
  })) ??
    (await weekRepository.save({
      startOfWeek: weekStart,
      endOfWeek: weekEnd,
    }));
};
