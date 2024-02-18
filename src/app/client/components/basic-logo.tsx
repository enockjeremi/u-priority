import { Ubuntu } from "next/font/google";
import React from "react";
const ubuntu = Ubuntu({ weight: "400", subsets: ["cyrillic"] });

const BasicLogo = () => {
    return (
    <div className="flex items-center">
      <h2 className={`text-[1.30rem] uppercase font-bold -m-[0.420rem]`}>U</h2>
      <h1
        className={`text-4xl tracking-tighter ${ubuntu.className} first-letter:uppercase`}
      >
        Priority
      </h1>
    </div>
  );
};

export default BasicLogo;
