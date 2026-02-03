"use client";
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
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import fireSvg from "@/public/fire-svg.svg";
import trophySvg from "@/public/trophy-svg.svg";
import calendarSvg from "@/public/calendar-svg.svg";
import {
  ArrowLeft,
  EllipsisVertical,
  Check,
  Trash2,
  PenLine,
  Plus,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Task } from "@/types";
import Loader from "@/components/compo/Loader";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isBetween from "dayjs/plugin/isBetween";
import { ConfettiButton } from "@/components/ui/confetti";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

const colors = [
  "#a855f7",
  "#ec4899",
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#14b8a6",
];

export default function page() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [todayDate, setTodayDate] = useState(dayjs().format("ddd, MMMM D"));
  const [timeline, setTimeline] = useState<number>();
  const [progressTvalue, setProgressTvalue] = useState(7);
  const [loading, setLoading] = useState(true);
  const [progressWeekly, setProgressWeekly] = useState(true);
  const [taskname, setTaskname] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  let myPra = useParams().task as string;
  dayjs.extend(isoWeek);
  dayjs.extend(isBetween);
  const task = allTasks.find((t) => t.id === myPra) || null;

  //finding todayDay
  let todayKey = dayjs().format("YYYY MMM D");
  let todayDay = allTasks
    .find((item) => item.id === myPra)
    ?.days.find(
      (d) =>
        d.title.year.concat(" ", d.title.month, " ", d.title.date) === todayKey
    );
  const isCompleted = todayDay?.complete ?? false;

  //updating tasks from local storage
  useEffect(() => {
    let stored = localStorage.getItem("tasks") ?? "";
    if (!stored) {
      setLoading(false);
      return;
    }
    let parseTask: Task[] = JSON.parse(stored);
    setAllTasks(parseTask);
    setLoading(false);
  }, []);

  let handleClick = (
    parentId: string,
    childId: string | undefined = todayDay?.id
  ) => {
    setAllTasks((prev) =>
      prev.map((task) => {
        if (task.id !== parentId) return task;

        return {
          ...task,
          days: task.days.map((day) =>
            day.id === childId ? { ...day, complete: !day.complete } : day
          ),
        };
      })
    );
  };

  //update storage if any changes being made in the local state
  useEffect(() => {
    if (allTasks.length === 0) return;
    localStorage.setItem("tasks", JSON.stringify(allTasks));
  }, [allTasks]);

  //calculating this week's timeline
  useEffect(() => {
    let monthStart = dayjs().startOf("month");
    let monthEnd = dayjs().endOf("month");
    let weekStart = dayjs().startOf("isoWeek");
    let weekEnd = dayjs().endOf("isoWeek");

    const timeline = task?.days.filter((item) => {
      const itemDate = dayjs(
        `${item.title.year}-${item.title.month}-${item.title.date}`,
        "YYYY-MMM-D"
      );

      if (progressWeekly) {
        setProgressTvalue(7);
        return (
          item.complete && itemDate.isBetween(weekStart, weekEnd, "day", "[]")
        );
      }

      if (!progressWeekly) {
        const daysInMonth = dayjs().daysInMonth();
        console.log("total days this month: ", daysInMonth);
        setProgressTvalue(daysInMonth);
        return (
          item.complete && itemDate.isBetween(monthStart, monthEnd, "day", "[]")
        );
      }
    });

    setTimeline(timeline?.length);
    console.log(timeline);
    console.log(progressWeekly);
  }, [allTasks, progressWeekly]);

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-[#0F0F0F] text-white">
      <div className="w-full flex justify-between items-center py-4 border-b border-[#1E1E1E] px-20">
        <div className="text-xl font-medium flex items-center gap-2">
          <Link
            href="/"
            className="rounded-sm p-2 cursor-pointer hover:bg-[#1E1E1E]"
          >
            <ArrowLeft className="size-4" />
          </Link>
          {task?.title}
        </div>
        <div className="rounded-sm p-2 cursor-pointer hover:bg-[#1E1E1E]">
          <EllipsisVertical size="18" />
        </div>
      </div>

      <section className="px-20 w-full py-5 space-y-5">
        {/* habit summary */}
        <div className="bg-[#1e1e1e] px-5 py-6 rounded-xl space-y-4">
          <p className="text-sm opacity-70">{task?.description}</p>
          <div className="grid grid-cols-3 grid-rows-1 gap-4">
            <div className="bg-[#282a2d] rounded-lg flex flex-col gap-1 items-center py-2">
              <div
                className="flex items-center pr-3 py-1 px-2 gap-2 rounded-xl"
                //style={{ backgroundColor: `${task.color}33` }}
              >
                <Image
                  src={fireSvg}
                  alt="streak-icon"
                  width={100}
                  height={100}
                  className="h-6 w-6"
                />
                <p className="font-semibold text-2xl">{5}</p>
              </div>
              <p className="text-xs opacity-70">Current Streak</p>
            </div>
            <div className="bg-[#282a2d] rounded-lg flex flex-col gap-1 items-center py-2">
              <div
                className="flex items-center pr-3 py-1 px-2 gap-2 rounded-xl"
                //style={{ backgroundColor: `${task.color}33` }}
              >
                <Image
                  src={trophySvg}
                  alt="streak-icon"
                  width={100}
                  height={100}
                  className="h-6.5 w-6.5 pt-1"
                />
                <p className="font-semibold text-2xl">{5}</p>
              </div>
              <p className="text-xs opacity-70">Best Streak</p>
            </div>
            <div className="bg-[#282a2d] rounded-lg flex flex-col gap-1 items-center py-2">
              <div
                className="flex items-center pr-3 py-1 px-2 gap-2 rounded-xl"
                //style={{ backgroundColor: `${task.color}33` }}
              >
                <Image
                  src={calendarSvg}
                  alt="streak-icon"
                  width={100}
                  height={100}
                  className="h-6.5 w-6.5 pt-1"
                />
                <p className="font-semibold text-2xl">{15}</p>
              </div>
              <p className="text-xs opacity-70">Best Streak</p>
            </div>
          </div>
        </div>
        {/* complete mark toggle */}
        <div className="bg-[#1e1e1e] px-5 py-6 rounded-xl flex flex-col">
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm opacity-70">{todayDate}</p>
            <ConfettiButton
              className="border-3 border-white h-24 w-24 rounded-full flex items-center justify-center"
              style={
                todayDay?.complete
                  ? { backgroundColor: task?.color, borderColor: task?.color }
                  : {}
              }
              onClickCapture={(e) => {
                if (isCompleted) {
                  e.stopPropagation();
                }

                handleClick(myPra);
              }}
            >
              <Check className="size-12" />
            </ConfettiButton>

            <p
              className="font-medium"
              style={todayDay?.complete ? { color: task?.color } : {}}
            >
              {todayDay?.complete ? "Completed Today!" : "Mark today as done"}
            </p>
          </div>
        </div>
        {/* timeline */}
        <div className="bg-[#1e1e1e] px-5 py-6 rounded-xl space-y-4">
          <p>Timeline</p>
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {allTasks.map((item, i) =>
              item.id === myPra
                ? item.days.map((eachDay) => (
                    <div
                      key={eachDay.id}
                      className={`hover:bg-[#45494e9a] dark:bg-[#282A2D] cursor-pointer transition-all ease-in-out duration-200 rounded-xl py-2 px-2 space-y-1 text-center dark:hover:bg-[#45494e] ${
                        dayjs().format("MMM D") ===
                        eachDay.title.month.concat(" ", eachDay.title.date)
                          ? ""
                          : "dark:border-[#282A2D]"
                      }`}
                      style={{
                        borderWidth:
                          dayjs().format("MMM D") ===
                          eachDay.title.month.concat(" ", eachDay.title.date)
                            ? 2
                            : undefined,
                        borderColor:
                          dayjs().format("MMM D") ===
                          eachDay.title.month.concat(" ", eachDay.title.date)
                            ? item.color
                            : undefined,
                      }}
                      onClick={() => handleClick(myPra, eachDay.id)}
                    >
                      <p className="text-xs font-medium">{eachDay.title.day}</p>
                      <p
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold text-blue-950 ${
                          eachDay.complete ? "" : "bg-gray-200"
                        }`}
                        style={{
                          backgroundColor: eachDay.complete
                            ? item.color
                            : undefined,
                        }}
                      >
                        {eachDay.complete ? <Check /> : eachDay.title.date}
                      </p>
                    </div>
                  ))
                : ""
            )}
          </div>
        </div>
        {/* progress performance */}
        <div className="bg-[#1e1e1e] px-5 py-6 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <p>Progress</p>
            <div className="relative p-1 rounded-full bg-[#282A2D] flex items-center text-xs font-medium w-fit">
              {/* Sliding background */}
              <div
                className="absolute top-1 bottom-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] rounded-full transition-transform duration-300 ease-in-out"
                style={{
                  backgroundColor: task?.color,
                  transform: progressWeekly
                    ? "translateX(0%)"
                    : "translateX(100%)",
                }}
              />

              {/* Weekly */}
              <p
                className="relative z-10 py-1.5 px-3.5 cursor-pointer rounded-full transition-colors duration-200"
                onClick={() => setProgressWeekly(true)}
              >
                Weekly
              </p>

              {/* Monthly */}
              <p
                className="relative z-10 py-1.5 px-3.5 cursor-pointer rounded-full transition-colors duration-200"
                onClick={() => setProgressWeekly(false)}
              >
                Monthly
              </p>
            </div>
          </div>
          <p className="text-sm opacity-70">
            {timeline} / {progressTvalue} days completed
          </p>
          <div>
            <Progress
              value={timeline}
              totalValue={progressTvalue}
              color={task?.color}
            />
          </div>
        </div>
        {/* action buttons */}
        {/* <Dialog>
          <div className="flex gap-5 items-center">
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
                    placeholder={task?.title}
                    value={taskname}
                    onChange={(e) => setTaskname(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="username"
                    placeholder={task?.description}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="colors">Color</Label>
                  <div className="flex gap-5">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`h-10 w-10 cursor-pointer rounded-full border-2 transition
                    ${
                      color === c
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

          <div className="rounded-xl space-x-4 flex gap-2">
            <DialogTrigger className="flex-1 border border-neutral-700 rounded-lg overflow-hidden">
              <Button
                variant="default"
                className="w-full cursor-pointer bg-[#1e1e1e]"
              >
                <PenLine /> Edit Habit
              </Button>
            </DialogTrigger>
            <Button
              className="flex-1 bg-[#631a1c3a] text-red-500 hover:bg-[#932426d0] hover:text-white cursor-pointer border border-[#9324267b]"
              variant="destructive"
            >
              <Trash2 /> Edit Habit
            </Button>
          </div>
        </Dialog> */}
      </section>
    </div>
  );
}
