import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Fab,
  Grid,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Alert from "@material-ui/lab/Alert";
import React, { FunctionComponent, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link as RouterLink, useHistory } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import WeekPicker, { Week } from "../components/WeekPicker";
import {
  deleteShiftById,
  getShifts,
  publishOrUnpublish as publishOrUnpublishApi,
} from "../helper/api/shift";
import { getErrorMessage } from "../helper/error/index";
import { staffanyTheme as theme } from "../commons/theme";
import { IShift } from "../commons/types";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  fab: {
    position: "absolute",
    bottom: 40,
    right: 40,
    backgroundColor: "white",
    color: theme.color.turquoise,
  },
}));

interface ActionButtonProps {
  id: string;
  onDelete: () => void;
}
const ActionButton: FunctionComponent<ActionButtonProps> = ({
  id,
  onDelete,
}) => {
  return (
    <div>
      <IconButton
        size="small"
        aria-label="delete"
        component={RouterLink}
        to={`/shift/${id}/edit`}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" aria-label="delete" onClick={() => onDelete()}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

const Shift = () => {
  const classes = useStyles();
  const history = useHistory();

  const [rows, setRows] = useState<IShift[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [selectedWeek, setSelectedWeek] = useState<Week>();
  const [week, setWeek] = useState<{ id: string; isPublished: boolean }>();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const onDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowDeleteConfirm(true);
  };

  const onCloseDeleteDialog = () => {
    setSelectedId(null);
    setShowDeleteConfirm(false);
  };

  const publishOrUnpublish = async (id: string, action: string) => {
    try {
      setIsLoading(true);
      setErrMsg("");
      const { results } = await publishOrUnpublishApi(id, action);
      setWeek(results);
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (selectedWeek) {
      const getData = async () => {
        try {
          setIsLoading(true);
          setErrMsg("");
          const { results } = await getShifts(
            selectedWeek.startOfWeek,
            selectedWeek.endOfWeek
          );
          setRows(results);
        } catch (error) {
          const message = getErrorMessage(error);
          setErrMsg(message);
        } finally {
          setIsLoading(false);
        }
      };
      getData();
    }
  }, [selectedWeek]);

  useEffect(() => {
    if (rows?.length) {
      setWeek(rows[0].week);
    }
  }, [rows]);

  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Date",
      selector: "date",
      sortable: true,
    },
    {
      name: "Start Time",
      selector: "startTime",
      sortable: true,
    },
    {
      name: "End Time",
      selector: "endTime",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <ActionButton id={row.id} onDelete={() => onDeleteClick(row.id)} />
      ),
    },
  ];

  const deleteDataById = async () => {
    try {
      setDeleteLoading(true);
      setErrMsg("");

      if (selectedId === null) {
        throw new Error("ID is null");
      }

      console.log(deleteDataById);

      await deleteShiftById(selectedId);

      const tempRows = [...rows];
      const idx = tempRows.findIndex((v: any) => v.id === selectedId);
      tempRows.splice(idx, 1);
      setRows(tempRows);
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    } finally {
      setDeleteLoading(false);
      onCloseDeleteDialog();
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <WeekPicker
                onSelectedChange={(week) => {
                  console.log("week change", week);
                  setSelectedWeek(week);
                }}
              />
            }
            action={
              <Box>
                <Button
                  component={RouterLink}
                  variant="outlined"
                  style={{
                    marginRight: 10,
                    color: theme.palette.success.main,
                    borderColor: theme.palette.success.main,
                  }}
                  to={`/shift/add`}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  style={{
                    color: rows.length
                      ? theme.palette.secondary.contrastText
                      : theme.color.turquoise,
                    backgroundColor: rows.length
                      ? theme.palette.success.main
                      : "silver",
                  }}
                  disabled={!rows.length}
                  onClick={() => {
                    if (week) {
                      week.isPublished
                        ? publishOrUnpublish(week.id, "unpublish")
                        : publishOrUnpublish(week.id, "publish");
                    }
                  }}
                >
                  {week?.isPublished ? "Unpublish" : "Publish"}
                </Button>
              </Box>
            }
          />
          <CardContent>
            {errMsg.length > 0 ? (
              <Alert severity="error">{errMsg}</Alert>
            ) : (
              <></>
            )}
            <DataTable
              title="Shifts"
              columns={columns}
              data={rows}
              pagination
              progressPending={isLoading}
            />
          </CardContent>
        </Card>
      </Grid>
      <Fab
        size="medium"
        aria-label="add"
        className={classes.fab}
        onClick={() => history.push("/shift/add")}
      >
        <AddIcon />
      </Fab>
      <ConfirmDialog
        title="Delete Confirmation"
        description={`Do you want to delete this data ?`}
        onClose={onCloseDeleteDialog}
        open={showDeleteConfirm}
        onYes={deleteDataById}
        loading={deleteLoading}
      />
    </Grid>
  );
};

export default Shift;
