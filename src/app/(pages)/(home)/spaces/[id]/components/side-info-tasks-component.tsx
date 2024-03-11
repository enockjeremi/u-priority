"use client";
import { ITask } from "@/types/workspaces";
import { Chip, Typography } from "@material-tailwind/react";
import React, { useState } from "react";
import EditTasksComponent from "./edit-tasks-component";
import { useQuery } from "react-query";
import { tasks } from "@/app/libs/endpoints/tasks";
import instance from "@/app/server/utils/axios-instance";

const getTasksById = (id: number | undefined) => {
  if (!id) return null;
  const res = instance.get(tasks.getById(id)).then((res) => res.data);
  return res;
};

const SideInfoTasksComponent = ({
  tasksId,
  isEdit,
}: {
  tasksId: number | undefined;
  isEdit: boolean;
}) => {
  const id = tasksId;
  const { data: tasksInfo } = useQuery({
    queryKey: ["tasks", { id }],
    queryFn: () => getTasksById(id),
  });


  return (
    <>
      <div className="w-full">
        {!isEdit ? (
          <div className="w-full p-6 mt-10 flex flex-col gap-4">
            <Typography
              placeholder={undefined}
              variant="h3"
              color="black"
              className="font-normal leading-none"
            >
              {tasksInfo?.name || ""}
            </Typography>

            <div className="w-full">
              <div className="min-h-[100px] pt-5 text-black">
                {tasksInfo?.description}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Chip size="md" value={tasksInfo?.status.status || ""} />
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
        ) : (
          <EditTasksComponent taskToEdit={tasksInfo} />
        )}
      </div>
    </>
  );
};

export default SideInfoTasksComponent;
