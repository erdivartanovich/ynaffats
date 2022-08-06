import {
  Between,
  Equal,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from "typeorm";

export const queryFilterMapper = (query: Record<string, any>) => {
  const { order, where = {} } = query;
  const whereColomns = Object.keys(where);
  const whereValues = Object.values(where);
  const operator = {
    between: Between,
    eq: Equal,
    lt: LessThan,
    lte: LessThanOrEqual,
    gt: MoreThan,
    gte: MoreThanOrEqual,
    not: Not,
    like: Like,
  };
  const whereConditions = whereColomns.reduce((acc, col, index) => {
    let filterValue: Record<string, any>;
    let val = whereValues[index];
    if (val instanceof Object) {
      const op = Object.keys(val)?.[0];
      filterValue =
        op === "between"
          ? operator[op](Object.values(val)[0][0], Object.values(val)[0][1])
          : operator[op](Object.values(val)[0]);
    }
    acc[col] = filterValue;
    return acc;
  }, {});
  return { where: whereConditions, order };
};
