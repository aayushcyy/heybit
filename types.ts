type DateTitle = {
  year: string;
  month: string;
  date: string;
  day: string;
};
type Day = {
  id: string;
  title: DateTitle;
  complete: boolean;
};

type Task = {
  title: string;
  description: string;
  id: string;
  color: string;
  days: Day[];
};

export type { Day, Task, DateTitle };
