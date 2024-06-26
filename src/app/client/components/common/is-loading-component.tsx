import { Spinner } from "@material-tailwind/react";
import { ReactNode } from "react";

const IsLoadingComponent = ({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: ReactNode;
}) => {
  return !isLoading ? (
    children
  ) : (
    <div className="flex w-full items-center justify-center p-2">
      <Spinner />
    </div>
  );
};

export default IsLoadingComponent;
