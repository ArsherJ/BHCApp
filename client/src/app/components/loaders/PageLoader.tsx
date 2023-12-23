import React from "react";

interface PageLoaderProps {
  loaderText?: string
}

const PageLoader = ({loaderText}: PageLoaderProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen animate-pulse my-4">
      <div className="flex flex-row text-center justify-between items-center gap-10 px-10 pb-24">
        <span className="loading loading-bars loading-lg text-primary scale-[2]" />
        {loaderText ? loaderText : "Please wait a moment"}
      </div>
    </div>
  );
};

export default PageLoader;
