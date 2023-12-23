
import DashboardDrawer from "@/app/components/DashboardDrawer";
import NavbarDashboard from "@/app/components/NavbarDashboard";
import PageLoader from "@/app/components/loaders/PageLoader";
import React from "react";


const Loading = () => {
  return (
    <div className="bg-white min-h-screen">
      <PageLoader/>
    </div>
  );
};

export default Loading;
