"use client";
import React, { useState, useEffect } from "react";
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

export default function page() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [todayDate, setTodayDate] = useState(dayjs().format("ddd, MMMM D"));
  const [timeline, setTimeline] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
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
    let weekStart = dayjs().startOf("isoWeek");
    let weekEnd = dayjs().endOf("isoWeek");

    const timeline = task?.days.filter((item) => {
      const itemDate = dayjs(
        `${item.title.year}-${item.title.month}-${item.title.date}`,
        "YYYY-MMM-D"
      );

      return (
        item.complete && itemDate.isBetween(weekStart, weekEnd, "day", "[]")
      );
    });

    setTimeline(timeline?.length);
  }, [allTasks]);

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
        {/* this week performance */}
        <div className="bg-[#1e1e1e] px-5 py-6 rounded-xl space-y-2">
          <p>This Week</p>
          <p className="text-sm opacity-70">{timeline} / 7 days completed</p>
          <div>
            <Progress value={timeline} color={task?.color} />
          </div>
        </div>
        {/* action buttons */}
        <div className="rounded-xl space-x-4 flex gap-2">
          <Button
            className="flex-1 cursor-pointer bg-[#1e1e1e] border border-neutral-700"
            variant="default"
          >
            <PenLine /> Edit Habit
          </Button>
          <Button
            className="flex-1 bg-[#631a1c3a] text-red-500 hover:bg-[#932426d0] hover:text-white cursor-pointer border border-[#9324267b]"
            variant="destructive"
          >
            <Trash2 /> Edit Habit
          </Button>
        </div>
      </section>
    </div>
  );
}
