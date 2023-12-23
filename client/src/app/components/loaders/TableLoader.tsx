import React from "react";

const TableLoader = () => {
  return (
    <div className="flex justify-center items-center min-h-[50vh] animate-pulse  my-4">
      <div className="flex justify-between items-center gap-10 px-10 py-4">
        <span className="loading loading-bars loading-lg text-primary" />
        <h5>Fetching Data</h5>
      </div>
    </div>
  );
};

export default TableLoader;
