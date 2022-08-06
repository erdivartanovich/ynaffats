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
  const { order = {}, where = {} } = query;
  let whereConditions: Record<string, any> | Record<string, any>[];
  if (where instanceof Array) {
    whereConditions = where;
  } else {
    const whereColomns = Object.keys(where);
    const whereValues = Object.values(where);
    whereConditions = whereColomns.reduce((acc, col, index) => {
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
  }
  return { where: whereConditions, order };
};
