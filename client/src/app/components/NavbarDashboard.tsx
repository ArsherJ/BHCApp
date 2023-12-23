'use client'
import React from "react";
import { IoMdAlert } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";
import { AiFillSound } from "react-icons/ai";
import { IoIosMenu } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { IRoot, EnumUserRole } from "../redux/interfaces";
import { drawerActions, emergencyModalActions } from "../redux/store";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const NavbarDashboard = () => {
  const dispatch = useDispatch();
  const showDrawer = useSelector((state: IRoot) => state.drawer.showDrawer);
  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );
  const editUserDetails = useSelector(
    (state: IRoot) => state.editUserDetail.editUserDetails
  );

  const { role: userRole } = userDetails;
  const router = useRouter();
  const pathname = usePathname();
  const handleDrawerToggle = () => {
    dispatch(drawerActions.toggleDrawer());
  };

  const navbarTitle =
    pathname === "/dashboard"
      ? "Dashboard"
      : pathname === "/appointment"
      ? "Appointments"
      : pathname === "/doctors"
      ? "Medical Professionals"
      : pathname === "/inventory"
      ? "Inventory"
      : pathname === "/emergency"
      ? "Emergency"
      : pathname === "/news-updates"
      ? "News Updates"
      : pathname === "/registration"
      ? "Patient Registration"
      : pathname === "/settings"
      ? "User Settings"
      : pathname === "/patient-records"
      ? "Patients Records"
      : pathname ===
        `/patient-records/${
          userRole === EnumUserRole.ADMIN
            ? editUserDetails?.username
            : editUserDetails?.username
        }`
      ? "Patient Records"
      : "Dashboard";

  return (
    <div className="navbar flex max-w-[100vw] justify-between fixed top-0 h-[5vh] shadow-md z-20 px-4 bg-primary text-white">
      <div className="flex-none">
        <button
          className="btn btn-ghost btn-md btn-circle"
          onClick={handleDrawerToggle}
        >
          <IoIosMenu className="inline-block w-6 h-6 stroke-current" />
        </button>
      </div>
      {pathname === "/appointment/requests" ? (
        <div className="breadcrumbs max-sm:hidden sm:flex-1">
          <ul>
            <li>
              <Link prefetch className="text-[13px] md:text-[17px]" href="/appointment">
                Appointments
              </Link>
            </li>
            <li>
              <Link
                prefetch
                className="text-[13px] md:text-[17px]"
                href="/appointment/requests"
              >
                Requests
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <div className="flex-1">
          <h5 className={`${userRole === EnumUserRole.USER ? `sm:text-[17px] max-sm:hidden` : `text-[17px]`} ${pathname === `/patient-records/${editUserDetails?.username}` && `md:flex hidden`  }`}>{navbarTitle}</h5>
        </div>
      )}

      {userRole === EnumUserRole.USER && (
        <button
          className="btn border-primary flex"
          style={{ backgroundColor: "#fc2929", color: "#fff" }}
          onClick={() => dispatch(emergencyModalActions.toggleEmergencyModal())}
        >
          <AiFillSound className="mr-1" />
          Emergency
          <IoMdAlert className="ml-1" />
        </button>
      )}

      {userRole === EnumUserRole.ADMIN &&
        pathname === "/appointment/requests" && (
          <button
            className="group justify-end btn btn-sm md:btn-md border-white bg-primary hover:bg-white hover:text-primary hover:border-primary text-white cursor-pointer flex md:justify-between"
            onClick={() => router.replace("/appointment")}
          >
            <IoArrowBackOutline
              className="group-hover:mr-2 duration-150"
              size={20}
            />
            <span className="sm:flex hidden">Back to Schedules</span>
            <span className="sm:hidden flex">Back</span>

          </button>
        )}
      {userRole === EnumUserRole.ADMIN &&
        pathname === `/patient-records/${editUserDetails?.username}` && (
          <button
            className="group btn btn-md border-white bg-primary hover:bg-white hover:text-primary hover:border-primary text-white cursor-pointer flex justify-between"
            onClick={() => router.replace("/patient-records")}
          >
            <IoArrowBackOutline
              className="group-hover:mr-2 duration-150"
              size={20}
            />
            <span className="sm:flex hidden">Back to All Records</span>
            <span className="sm:hidden flex">Back</span>
          </button>
        )}
    </div>
  );
};

export default NavbarDashboard;
