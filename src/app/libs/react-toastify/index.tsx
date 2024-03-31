import { Bounce, toast } from "react-toastify";

const POSITION = "bottom-right";
const AUTO_CLOSE = 2000;
const THEME = "light";
const TRANSITION = Bounce;

export const notifySuccess = (msg: string) =>
  toast.success(msg, {
    position: POSITION,
    autoClose: AUTO_CLOSE,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: THEME,
    transition: TRANSITION,
    containerId: "NotifySuccess",
  });

export const notifyError = (msg: string) =>
  toast.error(msg, {
    position: POSITION,
    autoClose: AUTO_CLOSE,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: THEME,
    transition: TRANSITION,
    containerId: "NotifyError",
  });
