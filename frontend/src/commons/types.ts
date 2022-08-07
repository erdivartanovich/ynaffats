export interface IShift {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  week: {
    id: string;
    isPublished: boolean;
  };
}
