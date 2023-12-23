import NavbarDashboard from "../../components/NavbarDashboard";
import PageLoader from "../../components/loaders/PageLoader";
import React from "react";

const Loading = () => {
  return (
    <div className="bg-white">
      <PageLoader />
    </div>
  );
};

export default Loading;
