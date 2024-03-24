import { ReactNode } from "react";
import { Bounce, toast } from "react-toastify";

const POSITION = "bottom-right";
const AUTO_CLOSE = 2000;
const THEME = "light";
const TRANSITION = Bounce;

export const notifyUpdateTasks = () =>
  toast.success("Tarea modificada!", {
    position: POSITION,
    autoClose: AUTO_CLOSE,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: THEME,
    transition: TRANSITION,
    containerId: "NotifyUpdateTasks",
  });

export const notifyUpdateWorkspacesSuccessfully = () =>
  toast.success("Proyecto modificado!", {
    position: POSITION,
    autoClose: AUTO_CLOSE,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: THEME,
    transition: TRANSITION,
    containerId: "NotifyUpdateWorkspaces",
  });

export const notifyTaskDeletedError = () =>
  toast.error("No se a podido eliminar la tarea.", {
    position: POSITION,
    autoClose: AUTO_CLOSE,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: THEME,
    transition: TRANSITION,
    containerId: "NotifyDeleteSuccessTasks",
  });

export const notifyWorkspacesUpdateError = () =>
  toast.error("No se a podido actualizar el proyecto.", {
    position: POSITION,
    autoClose: AUTO_CLOSE,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: THEME,
    transition: TRANSITION,
    containerId: "NotifyWorkspacesUpdateError",
  });

export const notifyTaskDeletedSuccessfully = () =>
  toast.success("Tarea eliminada!", {
    position: POSITION,
    autoClose: AUTO_CLOSE,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: THEME,
    transition: TRANSITION,
    containerId: "NotifyDeleteSuccessTasks",
  });

export const notifyToConfirmToDeleteTask = (Node: ReactNode) => {
  toast(Node, {
    position: POSITION,
    autoClose: false,
    closeButton: false,
    closeOnClick: false,
    draggable: false,
    progress: undefined,
    theme: THEME,
    transition: TRANSITION,
    containerId: "NotifyOnConfimTasks",
    toastId: "NotifyOnConfimTasks",
  });
};

export const notifyCreateTaskSuccessfully = () => {
  toast.success("Tarea creada exitosamente!.", {
    position: POSITION,
    autoClose: AUTO_CLOSE,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: THEME,
    transition: TRANSITION,
    containerId: "NotifyOnCreateTaskSuccess",
  });
};

export const notifyCreateTaskError = () => {
  toast.error("No se a podido crear la tarea.", {
    position: POSITION,
    autoClose: AUTO_CLOSE,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: THEME,
    transition: TRANSITION,
    containerId: "NotifyOnCreateTaskError",
  });
};

export const notifyWorkspacesDeleteSuccessfully = () =>
  toast.error("El proyecto se ha sido eliminado.", {
    position: POSITION,
    autoClose: AUTO_CLOSE,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: THEME,
    transition: TRANSITION,
    containerId: "NotifyWorkspacesDeleteSuccessfully",
  });

export const notifyWorkspacesDeleteError = () =>
  toast.error("No se a podido eliminar el proyecto.", {
    position: POSITION,
    autoClose: AUTO_CLOSE,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: THEME,
    transition: TRANSITION,
    containerId: "NotifyWorkspacesDeleteError",
  });
