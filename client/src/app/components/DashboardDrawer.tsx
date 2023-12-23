"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import {
  BsHouseDoorFill,
  BsCalendarFill,
  BsPeopleFill,
  BsBagFill,
  BsNewspaper,
} from "react-icons/bs";
import { IoIosMenu, IoMdAlert } from "react-icons/io";
import { IoCloseSharp, IoSettings } from "react-icons/io5";
import { FaEnvelope, FaPhone, FaUserAlt, FaUserMd } from "react-icons/fa";
import { FaNewspaper, FaUserPlus } from "react-icons/fa6";
import { MdWorkHistory } from "react-icons/md";
import { AiFillSound } from "react-icons/ai";
import {
  RiAlarmWarningFill,
  RiChatHistoryFill,
  RiLogoutBoxRFill,
} from "react-icons/ri";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  IRoot,
  EnumUserRole,
  IAppointment,
  EnumAppointmentStatus,
} from "../redux/interfaces";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import {
  appointmentModalActions,
  drawerActions,
  emergencyModalActions,
  userDetailsActions,
} from "../redux/store";
import useLogout from "../hooks/api-hooks/useLogout";
import useGetAppointment from "../hooks/api-hooks/appointmentAPI/useGetAppointment";
import useGetUserDetails from "../hooks/api-hooks/useGetUserDetails";

const DashboardDrawer = () => {
  const {
    data: dataAppointments,
    error: errorAppointments,
    getAppointments,
    loading: isLoadingAppointments,
  } = useGetAppointment();
  const showDrawer = useSelector((state: IRoot) => state.drawer.showDrawer);
  const { doLogout } = useLogout();
  const editUserDetails = useSelector(
    (state: IRoot) => state.editUserDetail.editUserDetails
  );
  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );

  const { loading: isLoadingUserDetails } = useGetUserDetails();
  const userSettingsDetails = useSelector(
    (state: IRoot) => state.userSettings.userSettingsDetails
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { role: userRole, first_name, last_name } = userDetails;
  const { first_name: first_name_settings, last_name: last_name_settings } =
    userSettingsDetails;
  const handleLogout = () => {
    dispatch(drawerActions.toggleDrawer());
    doLogout();
  };
  const filterByStatusPending = dataAppointments?.filter(
    (item: IAppointment) =>
      item.appointment_status == EnumAppointmentStatus.PENDING
  );

  return (
    <>
      {showDrawer && (
        <div
          className="fixed inset-0 min-h-full bg-black backdrop-blur-lg opacity-40 z-40"
          onClick={() => dispatch(drawerActions.toggleDrawer())}
        />
      )}
      <div
        className={` duration-150  text-black bg-slate-100 ease-in-out fixed left-0 top-0 z-50 h-full ${
          showDrawer ? "" : `translate-x-[-500px]`
        }`}
      >
        <div className="flex relative flex-row justify-between items-center h-[64px] px-8 bg-primary text-white">
          <div className="flex-row flex items-center gap-4">
            <Image
              src="/dasmariñasLogo.png"
              alt="Dasmariñas Logo"
              width={30}
              height={30}
            />
            {userDetails.role === EnumUserRole.ADMIN ? (
              <h5 className="text-[16px]">BHC Navigation</h5>
            ) : (
              <h5 className="text-[16px]">BHC Navigation</h5>
            )}
          </div>
          <button
            className="btn btn-ghost btn-circle btn-md absolute right-4"
            onClick={() => dispatch(drawerActions.toggleDrawer())}
          >
            <IoCloseSharp
              className="inline-block w-6 h-6 stroke-current"
              aria-label="Menu"
            />
          </button>
        </div>
        <div className="flex flex-col justify-end items-start">
          <div className="px-8 flex flex-row pt-8 justify-center items-center gap-3 capitalize">
            <FaUserAlt size={20} />
            <h5>
              {first_name_settings || first_name}{" "}
              {last_name_settings || last_name}
            </h5>
          </div>
          <div className="divider" />

          <ul className="menu px-4 w-[330px] text-xl h-[4/5]">
            {/* USER */}
            {userRole === EnumUserRole.USER ? (
              <>
                <li>
                  <Link
                    prefetch
                    href="/dashboard"
                    className={`group ${
                      pathname === "/dashboard"
                        ? "bg-gray-300 btn-disabled border-l-[6px] border-primary opacity-80"
                        : ""
                    } `}
                    onClick={() => dispatch(drawerActions.toggleDrawer())}
                  >
                    <BsHouseDoorFill className="mr-2 group-hover:text-primary " />
                    Dashboard
                  </Link>
                </li>

                <li>
                  <Link
                    prefetch
                    href="/appointment"
                    className={`group ${
                      pathname === "/appointment"
                        ? "bg-gray-300 btn-disabled border-l-[6px] border-primary opacity-80"
                        : ""
                    } `}
                    onClick={() => dispatch(drawerActions.toggleDrawer())}
                  >
                    <BsCalendarFill className="mr-2 group-hover:text-primary " />
                    Set Appointment
                  </Link>
                </li>
                <li>
                  <button
                    className={`group ${
                      pathname === "/doctors"
                        ? "bg-gray-300 btn-disabled border-l-[6px] border-primary opacity-80"
                        : ""
                    } `}
                    onClick={() => {
                      dispatch(drawerActions.toggleDrawer());
                      router.replace("/doctors");
                    }}
                  >
                    <FaUserMd className="mr-2 group-hover:text-primary " />
                    Medical Professionals
                  </button>
                </li>
                <li>
                  <Link
                    prefetch
                    href={`/patient-records/${userDetails.username}`}
                    className={`group ${
                      pathname === `/patient-records/${userDetails.username}`
                        ? "bg-gray-300 btn-disabled border-l-[6px] border-primary opacity-80"
                        : ""
                    } `}
                    onClick={() => dispatch(drawerActions.toggleDrawer())}
                  >
                    <RiChatHistoryFill className="mr-2 group-hover:text-primary " />
                    My Records
                  </Link>
                </li>

                <li>
                  <Link
                    prefetch
                    href="/settings"
                    className={`group ${
                      pathname === "/settings"
                        ? "bg-gray-300 btn-disabled border-l-[6px] border-primary opacity-80"
                        : ""
                    } `}
                    onClick={() => dispatch(drawerActions.toggleDrawer())}
                  >
                    <IoSettings className="mr-2 group-hover:text-primary " />
                    Settings
                  </Link>
                </li>
                <li>
                  <Link
                    prefetch
                    href="/"
                    className="group"
                    onClick={handleLogout}
                  >
                    <RiLogoutBoxRFill className="mr-2 group-hover:text-primary " />
                    Log Out
                  </Link>
                </li>
              </>
            ) : userRole === EnumUserRole.ADMIN ? (
              // ADMIN
              <>
                <li>
                  <Link
                    prefetch
                    href="/dashboard"
                    className={`group ${
                      pathname === "/dashboard"
                        ? "bg-gray-300 btn-disabled border-l-[6px] border-primary opacity-80"
                        : ""
                    } `}
                    onClick={() => dispatch(drawerActions.toggleDrawer())}
                  >
                    <BsHouseDoorFill className="mr-2 group-hover:text-primary " />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    prefetch
                    href="/registration"
                    className={`group ${
                      pathname === "/registration"
                        ? "bg-gray-300 btn-disabled border-l-[6px] border-primary opacity-80"
                        : ""
                    } `}
                    onClick={() => dispatch(drawerActions.toggleDrawer())}
                  >
                    <FaUserPlus className="mr-2 group-hover:text-primary " />
                    Register User
                  </Link>
                </li>
                <li>
                  <Link
                    prefetch
                    href="/patient-records"
                    className={`group ${
                      pathname === "/patient-records" ||
                      pathname ===
                        `/patient-records/${editUserDetails?.username}`
                        ? "bg-gray-300 btn-disabled border-l-[6px] border-primary opacity-80"
                        : ""
                    } `}
                    onClick={() => dispatch(drawerActions.toggleDrawer())}
                  >
                    <MdWorkHistory className="mr-2 group-hover:text-primary " />
                    Patient Records
                  </Link>
                </li>
                <li>
                  <Link
                    prefetch
                    href="/appointment"
                    className={`group relative ${
                      pathname === "/appointment" ||
                      pathname === "/appointment/requests"
                        ? "bg-gray-300 btn-disabled border-l-[6px] border-primary opacity-80"
                        : ""
                    } `}
                    onClick={() => dispatch(drawerActions.toggleDrawer())}
                  >
                    <BsCalendarFill className="mr-2 group-hover:text-primary " />
                    Appointments
                    {filterByStatusPending?.length > 0 ? (
                      <span className="absolute badge badge-secondary right-12">
                        {`+${filterByStatusPending?.length}`}
                      </span>
                    ) : null}
                  </Link>
                </li>
                <li>
                  <button
                    className={`group ${
                      pathname === "/inventory"
                        ? "bg-gray-300 btn-disabled border-l-[6px] border-primary opacity-80"
                        : ""
                    } `}
                    onClick={() => {
                      dispatch(drawerActions.toggleDrawer());
                      router.replace("/inventory");
                    }}
                  >
                    <BsBagFill className="mr-2 group-hover:text-primary " />
                    Inventory
                  </button>
                </li>
                <li>
                  <button
                    className={`group ${
                      pathname === "/doctors"
                        ? "bg-gray-300 btn-disabled border-l-[6px] border-primary opacity-80"
                        : ""
                    } `}
                    onClick={() => {
                      dispatch(drawerActions.toggleDrawer());
                      router.replace("/doctors");
                    }}
                  >
                    <FaUserMd className="mr-2 group-hover:text-primary " />
                    Medical Professionals
                  </button>
                </li>
                <li>
                  <button
                    className={`group ${
                      pathname === "/emergency"
                        ? "bg-gray-300 btn-disabled border-l-[6px] border-primary opacity-80"
                        : ""
                    } `}
                    onClick={() => {
                      dispatch(drawerActions.toggleDrawer());
                      router.replace("/emergency");
                    }}
                  >
                    <RiAlarmWarningFill className="mr-2 group-hover:text-primary " />
                    Emergency Reports
                  </button>
                </li>

                <div className="divider" />
                <li>
                  <button
                    className={`group ${
                      pathname === "/settings"
                        ? "bg-gray-300 btn-disabled border-l-[6px] border-primary opacity-80"
                        : ""
                    } `}
                    onClick={() => {
                      dispatch(drawerActions.toggleDrawer());
                      router.replace("/settings");
                    }}
                  >
                    <IoSettings className="mr-2 group-hover:text-primary " />
                    Settings
                  </button>
                </li>
                <li>
                  <Link
                    prefetch
                    href="/"
                    className="group"
                    onClick={handleLogout}
                  >
                    <RiLogoutBoxRFill className="mr-2 group-hover:text-primary " />
                    Log Out
                  </Link>
                </li>
              </>
            ) : (
              ""
            )}
          </ul>
          {userRole !== EnumUserRole.ADMIN && (
            <>
              <div className="divider" />
              <div className="flex justify-center items-center w-full ">
                <button
                  className="btn cursor-pointer w-4/5 flex justify-between"
                  style={{ backgroundColor: "#fc2929", color: "#fff" }}
                  onClick={() =>
                    dispatch(emergencyModalActions.toggleEmergencyModal())
                  }
                >
                  <AiFillSound className="mr-1" />
                  Emergency
                  <IoMdAlert className="ml-1" />
                </button>
              </div>
              <div className="divider" />
            </>
          )}
          <div className="p-8 absolute bottom-[20px] gap-4 flex flex-col h-1/5 ">
            <div className="flex flex-row animate-pulse justify-center items-center ">
              {/* <Image
                src="/dasmariñasLogo.png"
                alt="Dasmariñas Logo"
                width={100}
                height={100}
              /> */}
              {/* <div className="ml-3 flex flex-col">
                <h5 className="font-bold mr-3">CHO3 </h5>
                <h5>Health Center</h5>
              </div> */}
            </div>
            {/* <div className="flex flex-col gap-1">
              <Link prefetch 
                href="mailto:contact@example.com"
                className="text-primary flex flex-row items-center gap-2"
              >
                <FaEnvelope /> cityhealthoffice3@gmail.com
              </Link>
              <Link prefetch 
                href="tel:+1234567890"
                className="text-primary flex flex-row items-center gap-2"
              >
                <FaPhone /> +1 (234) 567-890
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardDrawer;
