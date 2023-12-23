"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavbarDashboard from "../../../components/NavbarDashboard";
import DashboardDrawer from "../../../components/DashboardDrawer";
import { useDispatch, useSelector } from "react-redux";
import {
  IAppointment,
  IRoot,
  ISelectedAppointmentRows,
  EnumUserRole,
  EnumAppointmentStatus,
  EnumAppointmentConfirmModal,
} from "../../../redux/interfaces";
import axios from "axios";
import {
  AiFillSchedule,
  AiFillCheckCircle,
  AiFillCloseCircle,
} from "react-icons/ai";
import { IoSearchCircleSharp } from "react-icons/io5";
import useVerification from "../../../hooks/api-hooks/useVerification";
import {
  appointmentModalActions,
  userDetailsActions,
} from "../../../redux/store";
import DataTable, { Alignment, TableColumn } from "react-data-table-component";
import { customStyles } from "../../../components/datatable/datatable-theme";
import TableLoader from "../../../components/loaders/TableLoader";
import PageLoader from "../../../components/loaders/PageLoader";
import useGetAppointment from "../../../hooks/api-hooks/appointmentAPI/useGetAppointment";
import NotAuthorized from "../../../not-authorized/page";
import AlertMessage from "../../../components/AlertMessage";
import ConfirmModal from "../../../components/modals/appointments/AppointmentConfirmModal";
import AppointmentConfirmModal from "../../../components/modals/appointments/AppointmentConfirmModal";

const AppointmentRequests = () => {
  const [filterText, setFilterText] = useState("");
  const {
    data: dataAppointments,
    error,
    getAppointments,
    loading: isLoadingAppointments,
  } = useGetAppointment();


  const showConfirmationModal = useSelector(
    (state: IRoot) => state.appointmentModal.showConfirmationModal
  );
  const confirmModalType = useSelector(
    (state: IRoot) => state.appointmentModal.confirmModalType
  );
  const selectedAppointmentRows = useSelector(
    (state: IRoot) => state.appointmentModal.selectedAppointmentRows
  );

  const filterByStatusPending = dataAppointments?.filter(
    (item: IAppointment) =>
      item.appointment_status == EnumAppointmentStatus.PENDING
  );
  const filteredAppointmentRequests = filterByStatusPending?.filter(
    (item: IAppointment) =>
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const dispatch = useDispatch();
  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );
  const { role: userRole, isAuth } = userDetails;
  axios.defaults.withCredentials = true;
  const { isLoadingVerification } = useVerification();

  if (isLoadingVerification) {
    return (
      <div className="bg-white">
        <NavbarDashboard />
        <PageLoader />
      </div>
    );
  }

  const columns: TableColumn<IAppointment>[] = [
    {
      name: "Name",
      selector: (row: { name: string }) => row.name,
      sortable: true,
      compact: true,
      wrap: true,
    },
    {
      name: "Date",
      selector: (row: { appointment_date: string }) => row.appointment_date,
      sortable: true,
      id: "date",
      compact: true,
      wrap: true,
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
      selector: (row: { appointment_time: string }) => row.appointment_time,
      sortable: true,
      compact: true,
      wrap: true,
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
      compact: true,
      wrap: true,
    },
    {
      name: "Actions",
      wrap: true,
      cell: (row) => (
        <div className="justify-center text-center items-center flex gap-3 py-2">
          <button
            className="btn btn-circle text-primary cursor-pointer"
            // onClick={() => handleSingleAccept(row)}
            onClick={() => {
              dispatch(
                appointmentModalActions.setConfirmModalType(
                  EnumAppointmentConfirmModal.ACCEPT
                )
              );
              dispatch(appointmentModalActions.toggleConfirmationModal());
              dispatch(
                appointmentModalActions.setAppointmentConfirmationDetails(row)
              );
            }}
          >
            <AiFillCheckCircle size={25} />
          </button>
          <button
            className="btn btn-circle text-[#fc2929] cursor-pointer"
            onClick={() => {
              dispatch(
                appointmentModalActions.setConfirmModalType(
                  EnumAppointmentConfirmModal.REJECT
                )
              );
              dispatch(appointmentModalActions.toggleConfirmationModal());
              dispatch(
                appointmentModalActions.setAppointmentConfirmationDetails(row)
              );
            }}
          >
            <AiFillCloseCircle size={25} />
          </button>
        </div>
      ),
    },
  ];

  const handleBulkAccept = () => {
    dispatch(
      appointmentModalActions.setConfirmModalType(
        EnumAppointmentConfirmModal.BULK_ACCEPT
      )
    );
    dispatch(appointmentModalActions.toggleConfirmationModal());
    dispatch(
      appointmentModalActions.setSelectedAppointmentRows(
        selectedAppointmentRows
      )
    );
  };

  const handleBulkReject = () => {
    dispatch(
      appointmentModalActions.setConfirmModalType(
        EnumAppointmentConfirmModal.BULK_REJECT
      )
    );
    dispatch(appointmentModalActions.toggleConfirmationModal());
    dispatch(
      appointmentModalActions.setSelectedAppointmentRows(
        selectedAppointmentRows
      )
    );
  };

  const handleSelectionChange = ({
    selectedRows,
  }: ISelectedAppointmentRows) => {
    dispatch(appointmentModalActions.setSelectedAppointmentRows(selectedRows));
  };
  if (isAuth && userRole === EnumUserRole.ADMIN) {
    return (
      <div data-theme="lemonade" className="overflow-x-hidden">
        <Suspense fallback={<TableLoader />}>
          <DashboardDrawer />
          <NavbarDashboard />
          <div className="flex flex-col relative px-2 sm:px-4 pb-8 pt-[110px]">
            <div className="flex flex-col md:flex-row justify-center text-center gap-4 md:justify-between items-center my-2 mx-4">
              <div>
                <h4>Medical Appointment Requests</h4>
              </div>
              <div className="flex sm:flex-row flex-col-reverse items-center justify-center flex-wrap gap-3">
                <div className="flex-row flex gap-3">
                  <button
                    className="btn btn-outline text-[12px] sm:text-[14px] btn-primary"
                    onClick={handleBulkAccept}
                    disabled={
                      !selectedAppointmentRows ||
                      selectedAppointmentRows?.length === 0
                    }
                  >
                    <AiFillCheckCircle size={22} />
                    Bulk Accept
                  </button>
                  <button
                    className="btn btn-outline text-[12px] sm:text-[14px] text-[#fc2929] hover:bg-[#fc2929] hover:border-white"
                    onClick={handleBulkReject}
                    disabled={
                      !selectedAppointmentRows ||
                      selectedAppointmentRows?.length === 0
                    }
                  >
                    <AiFillCloseCircle size={22} />
                    Bulk Reject
                  </button>
                </div>
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
            <div className="flex flex-col relative py-8">
              {isLoadingAppointments && <TableLoader />}
              {dataAppointments && (
                <DataTable
                  columns={columns}
                  data={filteredAppointmentRequests}
                  customStyles={customStyles}
                  pagination
                  paginationPerPage={5}
                  responsive
                  selectableRows
                  defaultSortAsc={false}
                  defaultSortFieldId="date"
                  striped
                  paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
                  onSelectedRowsChange={handleSelectionChange}
                />
              )}
            </div>
          </div>
          {showConfirmationModal && <AppointmentConfirmModal />}
          <AlertMessage />
        </Suspense>
      </div>
    );
  }
};

export default AppointmentRequests;
