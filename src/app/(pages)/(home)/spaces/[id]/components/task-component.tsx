"use client";
import { Chip, Spinner, Typography } from "@material-tailwind/react";
import EditTaskComponent from "./edit-task-component";
import { useQuery } from "react-query";
import { tasks } from "@/app/libs/endpoints/tasks";
import instance from "@/app/server/utils/axios-instance";
import { IPriority, IStatus } from "@/types/workspaces";

const getTasksById = (id: number | undefined) => {
  if (!id) return null;
  const res = instance.get(tasks.getById(id)).then((res) => res.data);
  return res;
};

const TasksComponent = ({
  tasksId,
  isEdit,
  statusList,
  priorityList,
}: {
  tasksId: number | undefined;
  isEdit: boolean;
  statusList: IStatus[];
  priorityList: IPriority[];
}) => {
  const id = tasksId;
  const { data: tasksInfo, isLoading } = useQuery(
    ["tasks", id],
    () => getTasksById(id),
    {
      enabled: id !== undefined,
      retry: 0,
    }
  );

  return (
    <>
      {isLoading ? (
        <div className="w-full flex h-[50vh] items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <div className="w-full">
          {!isEdit ? (
            <div className="w-full h-full p-6 mt-10 flex flex-col gap-4">
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
            <EditTaskComponent
              statusList={statusList}
              priorityList={priorityList}
              taskToEdit={tasksInfo}
            />
          )}
        </div>
      )}
    </>
  );
};

export default TasksComponent;
