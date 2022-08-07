import { format } from "date-fns";
import { getAxiosInstance } from ".";
import { IShift } from "../../commons/types";

export const getShifts = async (
  fromDate: Date,
  toDate: Date
): Promise<{ results: IShift[] }> => {
  const api = getAxiosInstance();
  const from = format(fromDate, "yyyy-MM-dd");
  const to = format(toDate, "yyyy-MM-dd");
  const { data } = await api.get(
    `/shifts?where[date][between][]=${from}&where[date][between][]=${to}&order[date]=DESC&order[startTime]=ASC`
  );
  return data;
};

export const getShiftById = async (id: string) => {
  const api = getAxiosInstance();
  const { data } = await api.get(`/shifts/${id}`);
  return data;
};

export const createShifts = async (payload: any) => {
  const api = getAxiosInstance();
  const { data } = await api.post("/shifts", payload);
  return data;
};

export const updateShiftById = async (id: string, payload: any) => {
  const api = getAxiosInstance();
  const { data } = await api.patch(`/shifts/${id}`, payload);
  return data;
};

export const deleteShiftById = async (id: string) => {
  const api = getAxiosInstance();
  const { data } = await api.delete(`/shifts/${id}`);
  return data;
};

export const publishOrUnpublish = async (id: string, action: string) => {
  const api = getAxiosInstance();
  const { data } = await api.patch(`/shifts/${action}/week/${id}`);
  return data;
};
