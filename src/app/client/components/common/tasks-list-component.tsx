import {
  Card,
  Chip,
  Dialog,
  IconButton,
  Typography,
} from "@material-tailwind/react";

import React, { useState } from "react";
import TrashIcon from "../icons/trash-icon";
import EditIcon from "../icons/edit-icon";
import TaskDetailComponent from "./dialog/task-detail-component";
import { ITask } from "@/types/workspaces";
import TaskEditForm from "./dialog/task-edit-form";
import TaskDeleteComponent from "./dialog/task-delete-component";
import IsLoadingComponent from "./is-loading-component";

const TABLE_HEAD = ["Nombre", "Estado", "Prioridad", "Eliminar", "Modificar"];

export default function TasksListComponent<T>({
  itemList,
  isLoading,
}: {
  itemList: Array<T> | undefined;
  isLoading: boolean;
}) {
  const [taskDetail, setTaskDetail] = useState<ITask>();
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  function handleOpenDetail(task: any) {
    setTaskDetail(task);
    setOpenDetail(!openDetail);
  }

  function handleOpenEdit(task?: any) {
    setTaskDetail(task);
    setOpenEdit(!openEdit);
  }

  function handleOpenDelete(task?: any) {
    setTaskDetail(task);
    setOpenDelete(!openDelete);
  }

  return (
    <>
      <Dialog
        placeholder={undefined}
        open={openDetail}
        handler={handleOpenDetail}
      >
        <TaskDetailComponent tasksId={taskDetail?.id} />
      </Dialog>

      <Dialog placeholder={undefined} open={openEdit} handler={handleOpenEdit}>
        <TaskEditForm taskToEdit={taskDetail} handler={handleOpenEdit} />
      </Dialog>

      <Dialog
        placeholder={undefined}
        open={openDelete}
        handler={handleOpenDelete}
        size="xs"
      >
        <TaskDeleteComponent
          taskDelete={taskDetail}
          handler={handleOpenDelete}
        />
      </Dialog>
      <hr className="my-4 border-blue-gray-100" />

      <IsLoadingComponent isLoading={isLoading}>
        <Card
          placeholder={undefined}
          className="my-6 h-full w-full overflow-hidden"
        >
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-3"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                      placeholder={undefined}
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {itemList?.length === 0 || itemList === undefined ? (
                <tr className="grid even:bg-blue-gray-50/50">
                  <td className="px-2 py-1">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                      placeholder={undefined}
                    >
                      No tienes tareas disponibles
                    </Typography>
                  </td>
                </tr>
              ) : (
                <>
                  {itemList?.map((item: any, index: number) => {
                    // const table = data.update;
                    const isLast = index === itemList?.length - 1;
                    const classes = isLast
                      ? "px-2 py-1"
                      : "px-2 py-1 border-b border-blue-gray-50";

                    return (
                      <tr className=" even:bg-blue-gray-50/50" key={item.id}>
                        <td className={`${classes}`}>
                          <Typography
                            variant="small"
                            onClick={() => handleOpenDetail(item)}
                            color="blue-gray"
                            className="cursor-pointer font-normal hover:text-blue-500"
                            placeholder={undefined}
                          >
                            {item.name}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                            placeholder={undefined}
                          >
                            <Chip
                              size="sm"
                              variant="ghost"
                              value={item?.status?.status}
                              color={
                                item?.status?.id === 1
                                  ? "green"
                                  : item?.status?.id === 2
                                    ? "blue"
                                    : item?.status?.id === 3
                                      ? "amber"
                                      : "red"
                              }
                            />
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                            placeholder={undefined}
                          >
                            {item.priority.priority}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <IconButton
                            size="sm"
                            variant="text"
                            color="red"
                            placeholder={undefined}
                            onClick={() => handleOpenDelete(item)}
                          >
                            <TrashIcon className="w-5" />
                          </IconButton>
                        </td>
                        <td className={classes}>
                          <IconButton
                            size="sm"
                            variant="text"
                            onClick={() => handleOpenEdit(item)}
                            color="blue"
                            placeholder={undefined}
                          >
                            <EditIcon className="w-5" />
                          </IconButton>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </Card>
      </IsLoadingComponent>
    </>
  );
}
