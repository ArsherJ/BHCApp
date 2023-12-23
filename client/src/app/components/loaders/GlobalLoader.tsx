import React from "react";

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute inset-0 bg-white backdrop-blur-lg disabled opacity-40" />
      <div className="flex justify-center items-center min-h-screen my-4">
        <div className="flex bg-white p-4 rounded-md flex-row text-center justify-between items-center gap-10">
          <span className="loading loading-spinner loading-lg text-primary " />
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
