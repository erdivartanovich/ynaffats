import { Box, IconButton, Typography } from "@material-ui/core";
import { addWeeks, endOfWeek, format, startOfWeek } from "date-fns";
import React, { FC, useEffect, useState } from "react";

export type Week = {
  startOfWeek: Date;
  endOfWeek: Date;
};

interface Prop {
  initialDate?: Date;
  onSelectedChange: (value: Week) => void;
}

const getStartOfWeek = (param: Date | number) =>
  startOfWeek(param, { weekStartsOn: 1 });
const getEndOfWeek = (param: Date | number) =>
  endOfWeek(param, { weekStartsOn: 1 });

const WeekPicker: FC<Prop> = ({
  initialDate = new Date(),
  onSelectedChange,
}) => {
  const initialState: Week = {
    startOfWeek: getStartOfWeek(initialDate),
    endOfWeek: getEndOfWeek(initialDate),
  };

  const [selected, setSelected] = useState<Week>(initialState);

  const select = (isNext?: Boolean) => {
    const startOfWeek = addWeeks(selected.startOfWeek, isNext ? 1 : -1);
    const newWeek = {
      startOfWeek: startOfWeek,
      endOfWeek: getEndOfWeek(startOfWeek),
    };
    setSelected(newWeek);
  };

  const nextWeek = () => select(true);
  const previousWeek = () => select(false);

  useEffect(() => {
    onSelectedChange(selected);
  }, [selected]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: 300,
      }}
    >
      <IconButton onClick={(_) => previousWeek()}>{"<"}</IconButton>
      <Typography>{`${format(selected.startOfWeek, "dd MMM")} - ${format(
        selected.endOfWeek,
        "dd MMM"
      )}`}</Typography>
      <IconButton onClick={(_) => nextWeek()}>{">"}</IconButton>
    </Box>
  );
};

export default WeekPicker;
