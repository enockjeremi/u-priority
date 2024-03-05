"use client";
import { ITask } from "@/types/workspaces";
import { Chip, Input, Textarea, Typography } from "@material-tailwind/react";
import React from "react";

const SideInfoTasksComponent = ({
  tasksInfo,
  isEdit,
}: {
  tasksInfo: ITask | undefined;
  isEdit: boolean;
}) => {
  return (
    <>
      {isEdit ? (
        <div className="w-full p-6 mt-10 flex flex-col gap-4">
          <Input
            defaultValue={tasksInfo?.name}
            crossOrigin={undefined}
            color="white"
            label="Nombre de la tarea"
          />
          <div className="w-full">
            <Textarea
              label="Message"
              color="gray"
              variant="outlined"
              defaultValue={tasksInfo?.description}
            />
          </div>

          {/* <Textarea
            color="white"
            // defaultValue={tasksInfo?.description ? tasksInfo.description : ""}
          /> */}
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
        <div className="w-full p-6 mt-10 flex flex-col gap-4">
          <Typography
            placeholder={undefined}
            variant="h3"
            color="white"
            className="font-normal leading-none"
          >
            {tasksInfo?.name || ""}
          </Typography>
          <div className="w-full cursor-pointer">
            <div className="min-h-[100px] pt-5 text-white">
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
      )}
    </>
  );
};

export default SideInfoTasksComponent;
