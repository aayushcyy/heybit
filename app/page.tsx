"use client";
import { Task, Day, DateTitle } from "@/types";
import dayjs from "dayjs";
import {
  Plus,
  Moon,
  Sun,
  Check,
  EllipsisVertical,
  Pen,
  Trash,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import fireSvg from "@/public/fire-svg.svg";
import ToastComp from "@/components/compo/ToastComp";
import { useRouter } from "next/navigation";

const colors = [
  "#a855f7",
  "#ec4899",
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#14b8a6",
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todayDate, setTodayDate] = useState(dayjs().format("MMM D"));
  const [dark, setDark] = useState(true);
  const [taskname, setTaskname] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskColor, setTaskColor] = useState("#a855f7");
  const [showToast, setShowToast] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const router = useRouter();

  //updating tasks from local storage
  useEffect(() => {
    let taskStorage = localStorage.getItem("tasks") ?? "";
    if (!taskStorage) return;
    let parseTask: Task[] = JSON.parse(taskStorage);
    setTasks(parseTask);
    setLoaded(true);
  }, []);

  //helper function for creating future days
  function generateFutureDays(startIndex: number, count: number) {
    return Array.from({ length: count }, (_, i) => {
      const offset = startIndex + i;
      const d = dayjs().add(offset, "day");
      return {
        id: `day-${offset + 1}`,
        complete: false,
        title: {
          year: d.format("YYYY"),
          month: d.format("MMM"),
          date: d.format("D"),
          day: d.format("ddd"),
        },
      };
    });
  }

  //creating future days
  useEffect(() => {
    if (!loaded || tasks.length === 0) return;
    setTasks((prev) =>
      prev.map((task) => {
        const lastStored = task.days[task.days.length - 1];
        const lastDate = dayjs(
          `${lastStored.title.year}-${lastStored.title.month}-${lastStored.title.date}`,
          "YYYY-MMM-D"
        );

        const targetLastDate = dayjs().add(24, "day");
        // how many new days are missing
        const daysToAdd = targetLastDate.diff(lastDate, "day");

        if (daysToAdd <= 0) return task;

        return {
          ...task,
          days: [
            ...task.days,
            ...generateFutureDays(task.days.length, daysToAdd),
          ],
        };
      })
    );
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks, loaded]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  let handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    let taskDays: Day[] = [];
    for (let i = 0; i < 25; i++) {
      let eachDay = {
        id: `day-${i + 1}`,
        title: {
          year: dayjs().add(i, "day").format("YYYY"),
          month: dayjs().add(i, "day").format("MMM"),
          date: dayjs().add(i, "day").format("D"),
          day: dayjs().add(i, "day").format("ddd"),
        },
        complete: false,
      };
      taskDays.push(eachDay);
    }
    setTasks((prev) => [
      ...prev,
      {
        title: taskname,
        description: taskDesc,
        color: taskColor,
        id: dayjs().format("DMMMYYHms"),
        days: [...taskDays],
      },
    ]);
  };

  let handleClick = (itemIndex: number, index: number) => {
    setTasks((prev) =>
      prev.map((task, tIndex) => {
        if (tIndex !== itemIndex) return task;

        return {
          ...task,
          days: task.days.map((day, dIndex) =>
            dIndex === index ? { ...day, complete: !day.complete } : day
          ),
        };
      })
    );
  };

  let handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
    setShowToast(true);
    let timer = setTimeout(() => {
      setShowToast(false);
    }, 2000);

    return () => clearTimeout(timer);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-white dark:bg-[#0F0F0F] text-black px-20">
      <Dialog>
        <div className="w-full flex justify-between mb-5 fixed top-0 px-20 h-16 items-center bg-white dark:bg-[#0F0F0F] opacity-100 z-10">
          <p className="text-xl font-medium dark:text-white">Heybit</p>
          <div className="flex gap-5 items-center">
            <div
              className="rounded-lg cursor-pointer hover:bg-gray-100 dark:text-white dark:bg-[#1E1E1E] px-1.5 py-1 mx-auto"
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </div>
            <span className="w-px h-5 dark:bg-[#1E1E1E]"></span>
            <DialogTrigger className="flex items-center font-normal gap-1 cursor-pointer bg-white dark:bg-[#1E1E1E] dark:text-white px-3 py-1.5 rounded-lg text-black">
              <Plus className="size-5.5" />
              Add Task
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a new task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Task Name</Label>
                  <Input
                    id="name-1"
                    name="name"
                    placeholder="Drink water"
                    value={taskname}
                    onChange={(e) => setTaskname(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="username"
                    placeholder="Drinking 3L of water daily"
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="colors">Color</Label>
                  <div className="flex gap-5">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setTaskColor(c)}
                        className={`h-10 w-10 cursor-pointer rounded-full border-2 transition
                    ${
                      taskColor === c
                        ? "border-white ring-2 ring-black"
                        : "border-transparent"
                    }
                    `}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose
                  type="submit"
                  className="capitalize px-5 cursor-pointer py-2 text-sm bg-white text-black rounded-lg font-medium"
                  onClick={(e) => handleSubmit(e)}
                >
                  Add
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </div>
        </div>
        {tasks.length === 0 && (
          <div className="dark:text-white flex flex-col items-center text-center">
            <div className="text-center flex flex-col items-center gap-1">
              <p className="text-6xl mb-10">✨</p>
              <h1 className="text-3xl font-medium">No habits yet</h1>
              <p className="text-lg text-gray-300">
                Add your first habit, one habit today changes everything.
              </p>
            </div>
            <DialogTrigger className="flex items-center text-black bg-white px-3 py-2 text-center rounded-lg text-xm font-medium gap-1 cursor-pointer mt-5">
              <Plus className="size-5 stroke-3" />
              Add Habit
            </DialogTrigger>
          </div>
        )}
      </Dialog>

      <div className="w-full h-full py-10 pt-24 flex flex-col-reverse gap-5">
        {tasks.map((item, itemIndex) => (
          <div
            key={itemIndex}
            className={`bg-white dark:bg-[#1E1E1E] dark:text-[#F8FAFC] inset-shadow-2xs shadow-lg rounded-2xl px-6 py-5 space-y-4 border-l-6 cursor-pointer`}
            style={{ borderLeftColor: item.color }}
            onClick={() => router.push(`/${item.id}`)}
          >
            <div className="flex justify-between items-center pr-0">
              <div>
                <p className="text-lg font-medium w-100 truncate">
                  {item.title}
                </p>
                <p className="opacity-55 dark:opacity-100 dark:text-[#94A3B8] text-sm w-140 truncate">
                  {item.description}
                </p>
              </div>
              <div
                className="flex items-center gap-5 cursor-default relative"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div
                  className="flex items-center pr-3 py-1 px-2 gap-1 rounded-xl"
                  style={{ backgroundColor: `${item.color}33` }}
                >
                  <Image
                    src={fireSvg}
                    alt="streak-icon"
                    width={100}
                    height={100}
                    className="h-5 w-5"
                  />
                  <p className="font-semibold dark:text-white text-black">
                    101
                  </p>
                </div>
                <button
                  className="bg-red-500/5 hover:bg-red-500/10 text-red-500 py-2 px-2 rounded-lg cursor-pointer flex items-center justify-center transition-all duration-100 ease-in-out"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash className="size-5" />
                </button>
              </div>
            </div>
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {tasks[itemIndex].days.map((task, index) => (
                <div
                  key={index}
                  className={`hover:bg-gray-200 dark:bg-[#282A2D] cursor-pointer transition-all ease-in-out duration-200 rounded-xl py-2 px-2 space-y-1 text-center border-2 dark:hover:bg-[#45494e] ${
                    todayDate === task.title.month.concat(" ", task.title.date)
                      ? ""
                      : "border-white dark:border-[#282A2D]"
                  }`}
                  style={{
                    borderColor:
                      todayDate ===
                      task.title.month.concat(" ", task.title.date)
                        ? item.color
                        : undefined,
                  }}
                  onClick={() => handleClick(itemIndex, index)}
                >
                  <p className="text-xs font-medium">{task.title.day}</p>
                  <p
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold text-blue-950 ${
                      task.complete ? "" : "bg-gray-200"
                    }`}
                    style={{
                      backgroundColor: task.complete ? item.color : undefined,
                    }}
                  >
                    {task.complete ? <Check /> : task.title.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
        {showToast && <ToastComp />}
      </div>
    </div>
  );
}
