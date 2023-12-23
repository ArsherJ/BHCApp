"use client";

import React, { Suspense, useEffect, useState } from "react";
import RegistrationCard from "../../../components/RegistrationCard";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import useVerification from "../../../hooks/api-hooks/useVerification";
import { userDetailsActions } from "../../../redux/store";
import { EnumUserRole, IRoot } from "../../../redux/interfaces";
import DashboardDrawer from "../../../components/DashboardDrawer";
import NavbarDashboard from "../../../components/NavbarDashboard";
import EmergencyModal from "../../../components/modals/EmergencyModal";
import PageLoader from "../../../components/loaders/PageLoader";
import NotAuthorized from "../../../not-authorized/page";
import AlertMessage from "../../../components/AlertMessage";
import TableLoader from "@/app/components/loaders/TableLoader";
import Loading from "./loading";

const RegistrationPage = () => {
  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );
  const { role: userRole, isAuth } = userDetails;
  axios.defaults.withCredentials = true;
  const { isLoadingVerification } = useVerification();

  const showEmergencyModal = useSelector(
    (state: IRoot) => state.emergencyModal.showEmergencyModal
  );

  if (isLoadingVerification) {
    return (
      <div className="bg-white">
        <NavbarDashboard />
        <PageLoader />
      </div>
    );
  }
  if (isAuth && userRole === EnumUserRole.ADMIN) {
    return (
      <div className="flex justify-center max-w-screen pt-[70px] bg items-center min-h-screen h-auto py-12 px-4 bg-gray-100">
        <Suspense fallback={<Loading />}>
          <NavbarDashboard />
          <DashboardDrawer />

          <div className="flex py-8 justify-center items-center ">
            <RegistrationCard />
          </div>
          <AlertMessage />
        </Suspense>
      </div>
    );
  }
};

export default RegistrationPage;
