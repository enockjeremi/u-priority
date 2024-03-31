"use client";
import { useQuery } from "react-query";

import {
  Chip,
  DialogBody,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";

import { CloseIcon } from "@/app/client/components/icons/close-icon";

import instance from "@/app/server/utils/axios-instance";
import { tasks } from "@/app/libs/endpoints/tasks";

import IsLoadingComponent from "@/app/client/components/common/is-loading-component";

const getTasksById = (id: number | undefined) => {
  if (!id) return null;
  const res = instance.get(tasks.getById(id)).then((res) => res.data);
  return res;
};

const TaskDetailComponent = ({ tasksId }: { tasksId: number | undefined }) => {
  const { data: task, isLoading } = useQuery(
    ["task", tasksId],
    () => getTasksById(tasksId),
    { retry: 0 },
  );

  return (
    <IsLoadingComponent isLoading={isLoading}>
      <DialogHeader
        placeholder={undefined}
        className="flex items-center justify-between"
      >
        <Typography
          placeholder={undefined}
          className="w-full"
          variant="h5"
          color="blue-gray"
        >
          {task?.name || ""}
        </Typography>
        <IconButton
          placeholder={undefined}
          color="blue-gray"
          size="sm"
          variant="text"
          className="w-[20%]"
          // onClick={clickToCancel}
        >
          <CloseIcon />
        </IconButton>
      </DialogHeader>
      <DialogBody placeholder={undefined}>
        <div className="flex flex-col justify-between gap-8">
          <Typography placeholder={undefined} color="gray" variant="paragraph">
            {task?.description || ""}
          </Typography>
          <div>
            <div className="flex items-center justify-between">
              <Chip size="md" value={task?.status.status || ""} />
              <Chip
                size="md"
                value={task?.priority.priority || ""}
                color={
                  task?.priority.id === 1
                    ? "green"
                    : task?.priority.id === 2
                      ? "blue"
                      : task?.priority.id === 3
                        ? "amber"
                        : "red"
                }
              />
            </div>
          </div>
        </div>
      </DialogBody>
    </IsLoadingComponent>
  );
};

export default TaskDetailComponent;
