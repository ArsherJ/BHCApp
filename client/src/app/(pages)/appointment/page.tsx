"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavbarDashboard from "../../components/NavbarDashboard";
import DashboardDrawer from "../../components/DashboardDrawer";
import { useDispatch, useSelector } from "react-redux";
import {
  IAppointment,
  IRoot,
  EnumUserRole,
  EnumAppointmentStatus,
} from "../../redux/interfaces";
import EmergencyModal from "../../components/modals/EmergencyModal";
import axios from "axios";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { BsFillCalendarPlusFill } from "react-icons/bs";
import { IoSearchCircleSharp } from "react-icons/io5";
import useVerification from "../../hooks/api-hooks/useVerification";
import { appointmentModalActions, userDetailsActions } from "../../redux/store";
import Link from "next/link";
import DataTable, { Alignment, TableColumn } from "react-data-table-component";
import { customStyles } from "../../components/datatable/datatable-theme";
import useGetAppointment from "../../hooks/api-hooks/appointmentAPI/useGetAppointment";
import TableLoader from "../../components/loaders/TableLoader";
import AppointmentModal from "../../components/modals/appointments/AppointmentModal";
import PageLoader from "../../components/loaders/PageLoader";
import AlertMessage from "../../components/AlertMessage";

// eslint-disable-next-line @next/next/no-async-client-component
const Appointment = () => {
  const showAlert = useSelector((state: IRoot) => state.alertMessage.showAlert);
  const showAppointmentModal = useSelector(
    (state: IRoot) => state.appointmentModal.showAppointmentModal
  );

  const showEmergencyModal = useSelector(
    (state: IRoot) => state.emergencyModal.showEmergencyModal
  );
  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );
  useState<Boolean>(true);
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    EnumAppointmentStatus | undefined
  >(undefined);

  useEffect(() => {
  }, [filterStatus]);

  const statusOptions = Object.entries(EnumAppointmentStatus)
    .filter(([key, value]) => typeof value === "number")
    .map(([key, value]) => {
      return (
        <option key={key} value={value}>
          {key}
        </option>
      );
    });

  const {
    data: dataAppointments,
    error,
    getAppointments,
    loading: isLoadingAppointments,
  } = useGetAppointment();

  const dispatch = useDispatch();
  const { role: userRole, isAuth } = userDetails;
  axios.defaults.withCredentials = true;
  const { isLoadingVerification } = useVerification();
  const filterByName = dataAppointments?.filter((item: IAppointment) => {
    const fullName = `${userDetails.first_name} ${userDetails.last_name}`;
    return item.name === fullName;
  });

  const filterByStatus = filterByName?.filter((item: IAppointment) => {
    return filterStatus === item.appointment_status;
  });

  const filterByStatusAccepted = dataAppointments?.filter(
    (item: IAppointment) =>
      item.appointment_status == EnumAppointmentStatus.ACCEPTED
  );

  const filterByStatusPending = dataAppointments?.filter(
    (item: IAppointment) =>
      item.appointment_status == EnumAppointmentStatus.PENDING
  );

  const filteredAppointments = filterByStatusAccepted?.filter(
    (item: IAppointment) =>
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const adminColumns: TableColumn<IAppointment>[] = [
    {
      name: "Name",
      selector: (row: { name: string }) => {
        return row.name;
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "Date",
      selector: (row: { appointment_date: string }) => row.appointment_date,
      sortable: true,
      id: "date",
      wrap: true,
      //@ts-ignore
      compact: "true",
      sortFunction: (a, b) => {
        const dateA = new Date(a.appointment_date);
        const dateB = new Date(b.appointment_date);

        if (dateA < dateB) {
          return -1;
        }
        if (dateA > dateB) {
          return 1;
        }
        return 0;
      },
    },
    {
      name: "Time",
      selector: (row: { appointment_time: string }) => {
        // Extract the military time from the row
        const militaryTime = row.appointment_time;

        // Parse the military time to extract the hour and minute components
        const [hourStr, minuteStr] = militaryTime.split(":");
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        // Define a function to convert military time to 12-hour format
        const convertTo12HourFormat = (hour: any) => {
          if (hour === 0) {
            return "12:00 AM";
          } else if (hour < 12) {
            return `${hour}:${minute == 0 ? "00" : minute} AM`;
          } else if (hour === 12) {
            return `12:${minute == 0 ? "00" : minute} PM`;
          } else {
            return `${hour - 12}:${minute == 0 ? "00" : minute} PM`;
          }
        };

        // Apply the conversion function and return the result
        const twelveHourTime = convertTo12HourFormat(hour);

        return twelveHourTime;
      },
      wrap: true,
      //@ts-ignore
      compact: "true",
      sortable: true,
      sortFunction: (a, b) => {
        const timeA = a.appointment_time.split(" ");
        const timeB = b.appointment_time.split(" ");

        const timeValueA = timeA[0].split(":").map(Number);
        const timeValueB = timeB[0].split(":").map(Number);

        const meridiemA = timeA[1];
        const meridiemB = timeB[1];

        if (meridiemA === "AM" && meridiemB === "PM") {
          return -1;
        } else if (meridiemA === "PM" && meridiemB === "AM") {
          return 1;
        } else if (
          timeValueA[0] === 12 &&
          timeValueB[0] !== 12 &&
          meridiemB === "PM"
        ) {
          // Special handling for "12:00 PM" and "12:30 PM"
          return -1;
        } else if (
          timeValueB[0] === 12 &&
          timeValueA[0] !== 12 &&
          meridiemA === "PM"
        ) {
          // Special handling for "12:00 PM" and "12:30 PM"
          return 1;
        } else {
          if (timeValueA[0] < timeValueB[0]) {
            return -1;
          } else if (timeValueA[0] > timeValueB[0]) {
            return 1;
          } else {
            if (timeValueA[1] < timeValueB[1]) {
              return -1;
            } else if (timeValueA[1] > timeValueB[1]) {
              return 1;
            }
            return 0;
          }
        }
      },
    },
    {
      name: "Reason",
      selector: (row: { appointment_reason: string }) => row.appointment_reason,
      sortable: true,
      wrap: true,
      //@ts-ignore
      compact: "true",
    },
  ];

  const userColumns: TableColumn<IAppointment>[] = [
    // {
    //   name: "Name",
    //   selector: (row: { name: string }) => row.name,
    //   sortable: true,
    // },
    {
      name: "Date",
      selector: (row: { appointment_date: string }) => row.appointment_date,
      sortable: true,
      id: "date",
      wrap: true,
      //@ts-ignore
      compact: "true",
      sortFunction: (a, b) => {
        const dateA = new Date(a.appointment_date);
        const dateB = new Date(b.appointment_date);

        if (dateA < dateB) {
          return -1;
        }
        if (dateA > dateB) {
          return 1;
        }
        return 0;
      },
    },
    {
      name: "Time",
      wrap: true,
      //@ts-ignore
      compact: "true",
      selector: (row: { appointment_time: string }) => {
        return row.appointment_time;
        // // Extract the military time from the row
        // const militaryTime = row.appointment_time;

        // // Parse the military time to extract the hour and minute components
        // const [hourStr, minuteStr] = militaryTime.split(":");
        // const hour = parseInt(hourStr, 10);
        // const minute = parseInt(minuteStr, 10);
        // // Define a function to convert military time to 12-hour format
        // const convertTo12HourFormat = (hour: any) => {
        //   if (hour === 0) {
        //     return "12:00 AM";
        //   } else if (hour < 12) {
        //     return `${hour}:${minute == 0 ? "00" : minute} AM`;
        //   } else if (hour === 12) {
        //     return `12:${minute == 0 ? "00" : minute} PM`;
        //   } else {
        //     return `${hour - 12}:${minute == 0 ? "00" : minute} PM`;
        //   }
        // };

        // // Apply the conversion function and return the result
        // const twelveHourTime = convertTo12HourFormat(hour);

        // return twelveHourTime;
      },
      sortable: true,
      sortFunction: (a, b) => {
        const timeA = a.appointment_time.split(" ");
        const timeB = b.appointment_time.split(" ");

        const timeValueA = timeA[0].split(":").map(Number);
        const timeValueB = timeB[0].split(":").map(Number);

        const meridiemA = timeA[1];
        const meridiemB = timeB[1];

        if (meridiemA === "AM" && meridiemB === "PM") {
          return -1;
        } else if (meridiemA === "PM" && meridiemB === "AM") {
          return 1;
        } else {
          // Check for the same meridiem (AM or PM)
          if (meridiemA === meridiemB) {
            if (timeValueA[0] < timeValueB[0]) {
              return -1;
            } else if (timeValueA[0] > timeValueB[0]) {
              return 1;
            } else {
              if (timeValueA[1] < timeValueB[1]) {
                return -1;
              } else if (timeValueA[1] > timeValueB[1]) {
                return 1;
              }
              return 0;
            }
          } else {
            // When both have the same hour but different meridiem
            if (meridiemA === "AM") {
              return -1;
            } else {
              return 1;
            }
          }
        }
      },
    },
    {
      name: "Reason",
      selector: (row: { appointment_reason: string }) => row.appointment_reason,
      sortable: true,
      wrap: true,
      //@ts-ignore
      compact: "true",
    },
    {
      name: "Status",
      selector: (row: any) => {
        const cellStyle = {};
        if (row.appointment_status == EnumAppointmentStatus.ACCEPTED) {
          return (
            <span className="text-primary shadow-sm shadow-primary">
              ACCEPTED
            </span>
          );
        } else if (row.appointment_status == EnumAppointmentStatus.PENDING) {
          return (
            <span className="text-[#e1c33c] shadow-sm shadow-[#c3b05e]">
              PENDING
            </span>
          );
        } else if (row.appointment_status == EnumAppointmentStatus.REJECTED) {
          return (
            <span className="text-[#fc2929] shadow-sm shadow-[#fc2929]">
              REJECTED
            </span>
          );
        } else {
          row.appointment_status, "<<<<<<<<<<<<<<< STATUS";
          return "Status Unknown";
        }
        return row.appointment_status;
      },
    },
  ];

  if (isLoadingVerification) {
    return (
      <div className="bg-white">
        <NavbarDashboard />
        <PageLoader />
      </div>
    );
  }
  if (isAuth) {
    return (
      <div data-theme="lemonade" className="">
        <DashboardDrawer />
        <Suspense fallback={<TableLoader />}>
          <NavbarDashboard />

          {/* -------------------------   ADMIN  -------------------------*/}

          {userRole === EnumUserRole.ADMIN && (
            <div className="flex flex-col relative px-4 pb-8 pt-[102px]">
              <div className="flex flex-col  md:flex-row justify-center md:justify-between gap-4 items-center mt-2 mb-8">
                <div className="md:ml-4 text-center">
                  <h4>Medical Appointment Schedules</h4>
                </div>
                <div className="flex items-center justify-center flex-wrap gap-3">
                  <Link
                    prefetch
                    href="/appointment/requests"
                    className="btn btn-outline btn-primary"
                  >
                    <FaPersonCircleQuestion size={25} />
                    View Requests
                    {filterByStatusPending != 0 && (
                      <span className="badge badge-secondary right-12">
                        + {filterByStatusPending?.length}
                      </span>
                    )}
                  </Link>
                  {/* Search Input */}
                  <div className="relative w-40">
                    <input
                      type="text"
                      placeholder="Search Name"
                      className="w-full pr-10 input input-primary input-bordered text-[14px]"
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                    />
                    <button className="absolute top-1/2 transform -translate-y-1/2 right-3">
                      <IoSearchCircleSharp className="text-primary" />
                    </button>
                  </div>
                </div>
              </div>
              {isLoadingAppointments && <TableLoader />}
              {dataAppointments && !isLoadingAppointments && (
                <DataTable
                  columns={adminColumns}
                  data={filteredAppointments}
                  customStyles={customStyles}
                  highlightOnHover
                  pagination
                  paginationPerPage={5}
                  responsive
                  defaultSortAsc={false}
                  defaultSortFieldId="date"
                  striped
                  paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
                />
              )}
            </div>
          )}

          {/* -------------------------   USER  -------------------------*/}

          {userRole === EnumUserRole.USER && (
            <div className="flex max-w-[100vw] flex-col relative px-4 pb-8 pt-[102px]">
              <div className="flex flex-col md:flex-row gap-3 justify-between items-center mt-2 mb-8">
                <div className="md:ml-4 text-center capitalize">
                  <h4>
                    {userDetails.first_name} {userDetails.last_name}&apos;s
                    Schedules History
                  </h4>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="form-control flex flex-row w-full gap-1">
                    <select
                      className={`select border-3 ${
                        filterStatus == EnumAppointmentStatus.ACCEPTED
                          ? `select-primary`
                          : filterStatus == EnumAppointmentStatus.PENDING
                          ? `select-warning`
                          : filterStatus == EnumAppointmentStatus.REJECTED
                          ? `select-error`
                          : `select-bordered`
                      } w-full max-w-xs`}
                      value={filterStatus}
                      onChange={(e) => {
                        let filterValue;
                        switch (+e.target.value) {
                          case 0:
                            filterValue = EnumAppointmentStatus.REJECTED;
                            break;
                          case 1:
                            filterValue = EnumAppointmentStatus.ACCEPTED;
                            break;
                          case 2: // Both 1 and 2 map to ACCEPTED
                            filterValue = EnumAppointmentStatus.PENDING;
                            break;
                          default:
                            filterValue = undefined;
                            break;
                        }
                        setFilterStatus(filterValue);
                      }}
                    >
                      <option value={undefined}>ALL STATUS</option>
                      {statusOptions}
                    </select>
                  </div>

                  <button
                    className="btn btn-outline btn-primary"
                    onClick={() =>
                      dispatch(appointmentModalActions.toggleAppointmentModal())
                    }
                  >
                    <BsFillCalendarPlusFill size={18} />
                    Request Appointment
                  </button>
                </div>
              </div>
              {isLoadingAppointments && <TableLoader />}
              {dataAppointments && !isLoadingAppointments && (
                <DataTable
                  columns={userColumns}
                  data={
                    !filterStatus && filterStatus === undefined
                      ? filterByName
                      : filterByStatus
                  }
                  customStyles={customStyles}
                  pagination
                  paginationPerPage={5}
                  responsive
                  defaultSortAsc={true}
                  defaultSortFieldId="date"
                  striped
                  paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
                />
              )}
            </div>
          )}
          {showAppointmentModal && <AppointmentModal />}
          {showEmergencyModal && <EmergencyModal />}
          <AlertMessage />
        </Suspense>
      </div>
    );
  }
};

export default Appointment;
