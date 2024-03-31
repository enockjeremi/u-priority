import { Dialog } from "@material-tailwind/react";
import React from "react";
import TaskDetailComponent from "./task-detail-component";
import TaskEditComponent from "./task-edit-form";

const DialogTaskComponent = ({
  openDialog,
  handleOpenDetail,
  taskDetail,
  taskEdit,
  handleOpenEdit,
  statusList,
  priorityList,
}: {
  openDialog: boolean;
  handleOpenDetail: () => void;
  taskDetail: any;
  taskEdit: boolean;
  handleOpenEdit: () => void;
  statusList: any;
  priorityList: any;
}) => {
  return (
    <Dialog
      placeholder={undefined}
      open={openDialog}
      handler={handleOpenDetail}
      className="z-10"
    >
      {taskDetail ? (
        taskEdit ? (
          <TaskEditComponent
            statusList={statusList}
            priorityList={priorityList}
            taskToEdit={taskDetail}
            handleClickTaskDetail={handleOpenDetail}
            handleClickEditTask={handleOpenEdit}
          />
        ) : (
          <TaskDetailComponent
            clickToCancel={handleOpenDetail}
            handleClickEditTask={handleOpenEdit}
            tasksId={taskDetail?.id}
          />
        )
      ) : (
        ""
      )}
    </Dialog>
  );
};

export default DialogTaskComponent;
