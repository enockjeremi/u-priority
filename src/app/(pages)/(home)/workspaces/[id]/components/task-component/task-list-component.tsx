import {
  Card,
  CardBody,
  Chip,
  Button,
  Typography,
} from "@material-tailwind/react";
import React from "react";

import { ITask } from "@/types/workspaces";
import IsLoadingComponent from "@/app/client/components/common/is-loading-component";

const TasksListComponent = ({
  tasks,
  isLoading,
  openDetail,
}: {
  tasks: ITask[] | undefined;
  isLoading: boolean;
  openDetail: (task: ITask) => void;
}) => {
  return (
    <Card placeholder={undefined}>
      <CardBody className="overflow-hidden px-2" placeholder={undefined}>
        <div className="flex w-full flex-col gap-2">
          <IsLoadingComponent isLoading={isLoading}>
            {tasks?.length === 0 || tasks === undefined ? (
              <Typography
                variant="h6"
                className="text-sm"
                color="black"
                placeholder={undefined}
              >
                No tienes tareas disponibles.
              </Typography>
            ) : (
              <>
                {tasks?.map((task) => (
                  <Button
                    key={task.id}
                    placeholder={undefined}
                    variant="text"
                    color="black"
                    type="button"
                    onClick={() => {
                      openDetail(task);
                    }}
                    size="sm"
                    className="flex w-full items-center justify-between px-4"
                  >
                    <p>{task?.name}</p>
                    <Chip
                      size="sm"
                      variant="ghost"
                      value={task?.status?.status}
                      color={
                        task?.status?.id === 1
                          ? "green"
                          : task?.status?.id === 2
                            ? "blue"
                            : task?.status?.id === 3
                              ? "amber"
                              : "red"
                      }
                    />
                  </Button>
                ))}
              </>
            )}
          </IsLoadingComponent>
        </div>
      </CardBody>
    </Card>
  );
};

export default TasksListComponent;
