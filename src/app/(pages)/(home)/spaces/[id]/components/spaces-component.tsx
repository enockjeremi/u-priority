"use client";
import { workspaces as workSpacesEndpoint } from "@/app/libs/endpoints/workspaces";
import instance from "@/app/server/utils/axios-instance";
import { IStatus, IWorkspaces } from "@/types/workspaces";
import {
  Card,
  CardBody,
  Chip,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";

const TABLE_HEAD = ["Nombre", "Estado"];

const SpacesComponent = ({
  workspaces,
  statusList,
}: {
  workspaces: IWorkspaces;
  statusList: IStatus[];
}) => {
  const queryClient = useQueryClient();
  const [selectTasksByStatus, setSelectTasksByStatus] = useState<number>(0);

  const allStatusList = [{ id: 0, status: "Todas las tareas" }, ...statusList];
  const { id: spacesID } = workspaces;

  const { data, isLoading } = useQuery<IWorkspaces>({
    queryKey: ["tasksByStatusInWorkspaces", { spacesID, selectTasksByStatus }],
    queryFn: async () => {
      return await instance
        .get(workSpacesEndpoint.filterByStatus(spacesID, selectTasksByStatus))
        .then((res) => res.data);
    },
    enabled: selectTasksByStatus !== 0,
  });

  const taskList = selectTasksByStatus !== 0 ? data : workspaces;
  const taskListEmpty =
    taskList?.tasks?.length !== undefined ? taskList.tasks.length > 0 : false;

  const handleSelectStatusChange = (value: any) => {
    setSelectTasksByStatus(Number(value));
    queryClient.invalidateQueries("tasksByStatusInWorkspaces");
  };

  return (
    <div className="w-full pt-10">
      <div className="w-full flex flex-col gap-4">
        <Typography
          className="ml-2"
          placeholder={undefined}
          variant="h5"
          color="blue-gray"
        >
          {workspaces.name}
        </Typography>
        <div className="pt-2">
          <Select
            onChange={handleSelectStatusChange}
            label="Selecciona por estado"
            placeholder={"Selecciona un estado"}
          >
            {allStatusList?.map((item) => (
              <Option key={item.id} value={item.id.toString()}>
                {item.status}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <Card placeholder={undefined}>
        <CardBody className="px-0 overflow-hidden" placeholder={undefined}>
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      placeholder={undefined}
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Typography
                        placeholder={undefined}
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        cargando...
                      </Typography>
                    </div>
                  </td>
                </tr>
              ) : taskListEmpty ? (
                taskList?.tasks?.map(({ id, name, status }, index) => {
                  const isLast = index === taskList?.tasks?.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
                  return (
                    <tr key={id}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Typography
                            placeholder={undefined}
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {name}
                          </Typography>
                        </div>
                      </td>

                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            size="sm"
                            variant="ghost"
                            value={status.status}
                            color={
                              status.id === 1
                                ? "green"
                                : status.id === 2
                                ? "blue"
                                : status.id === 3
                                ? "amber"
                                : "red"
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="pt-5 pl-4 pr-4">
                    <div className="flex items-center gap-3">
                      <Typography
                        placeholder={undefined}
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        Aun no has asignado ninguna tarea...
                      </Typography>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default SpacesComponent;
