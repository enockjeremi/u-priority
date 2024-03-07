"use client";
import { TODO } from "@/types/todo.types";
import { ITask } from "@/types/workspaces";
import {
  Chip,
  Input,
  Select,
  Textarea,
  Typography,
  Option,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { useDoubleTap } from "use-double-tap";

const status = [
  { id: 1, status: "Completado" },
  { id: 2, status: "En desarrollo" },
  { id: 3, status: "Pendiente" },
  { id: 4, status: "Pausado" },
];

const SideInfoTasksComponent = ({
  tasksInfo,
}: {
  tasksInfo: ITask | undefined;
  isEdit: boolean;
}) => {
  const [form, setForm] = useState<ITask>({
    name: tasksInfo?.name,
    description: tasksInfo?.description,
    status: {
      id: tasksInfo?.status.id,
      status: tasksInfo?.status.status,
    },
    priority: {
      id: tasksInfo?.priority.id,
      priority: tasksInfo?.priority.priority,
    },
  });


  return (
    <>
      <div className="w-full p-6 mt-10 flex flex-col gap-4">
        
        <Typography
          placeholder={undefined}
          variant="h3"
          color="white"
          className="font-normal leading-none"
        >
          {tasksInfo?.name || ""}
        </Typography>

        <div className="w-full">
          <div
            className="min-h-[100px] pt-5 text-white"
          >
            {tasksInfo?.description}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Chip
            size="md"
            value={tasksInfo?.status.status || ""}
          />
          <Chip
            size="md"
            value={tasksInfo?.priority.priority || ""}
            color={
              tasksInfo?.priority.id === 1
                ? "green"
                : tasksInfo?.priority.id === 2
                ? "blue"
                : tasksInfo?.priority.id === 3
                ? "amber"
                : "red"
            }
          />
        </div>
      </div>
    </>
  );
};

export default SideInfoTasksComponent;
