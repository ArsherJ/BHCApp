"use client";
import React, { Suspense, useState } from "react";
import DashboardDrawer from "../../components/DashboardDrawer";
import NavbarDashboard from "../../components/NavbarDashboard";
import EmergencyModal from "../../components/modals/EmergencyModal";
import { useDispatch, useSelector } from "react-redux";
import {
  EnumUserRole,
  IPatientDetails,
  IRoot,
  IUserDetails,
} from "../../redux/interfaces";
import axios from "axios";
import useVerification from "../../hooks/api-hooks/useVerification";
import { editUserDetailActions } from "../../redux/store";
import DataTable, { TableColumn } from "react-data-table-component";
import Link from "next/link";
import { IoSearchCircleSharp } from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";
import PageLoader from "../../components/loaders/PageLoader";
import useGetPatients from "../../hooks/api-hooks/useGetPatients";
import TableLoader from "@/app/components/loaders/TableLoader";
import { useRouter } from "next/navigation";
import Loading from "./loading";
import { FaTrash } from "react-icons/fa6";
import DeleteUserModal from "@/app/components/modals/DeleteUserModal";
import AlertMessage from "@/app/components/AlertMessage";

const PatientHistory = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    data: dataPatients,
    loading: isLoadingPatients,
    error: errorPatients,
    getPatients,
  } = useGetPatients();
  const [filterText, setFilterText] = useState("");
  const filteredAdmins = dataPatients?.filter((user: any) => {
    return user.role !== EnumUserRole.ADMIN;
  });
  const filteredUsers = filteredAdmins?.filter((item: IPatientDetails) => {
    const fullName = `${item.first_name} ${item.last_name}`.toLowerCase();

    return fullName.includes(filterText.toLowerCase());
  });
  const { isLoadingVerification } = useVerification();
  const showEmergencyModal = useSelector(
    (state: IRoot) => state.emergencyModal.showEmergencyModal
  );
  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );
  const showDeleteUserModal = useSelector(
    (state: IRoot) => state.editUserDetail.showDeleteUserModal
  );
  const { role: userRole, isAuth } = userDetails;
  axios.defaults.withCredentials = true;
  if (isLoadingVerification || isLoadingPatients) {
    return (
      <div className="bg-white">
        <NavbarDashboard />
        <PageLoader />
      </div>
    );
  }

  const columns: TableColumn<IPatientDetails>[] = [
    {
      name: "Name",
      selector: (row) => {
        const capitalizedFirstName =
          row.first_name.charAt(0).toUpperCase() + row.first_name.slice(1);
        const capitalizedLastName =
          row.last_name.charAt(0).toUpperCase() + row.last_name.slice(1);
        const capitalizedName = `${capitalizedFirstName} ${capitalizedLastName}`;
        return capitalizedName;
      },
      sortable: true,
      wrap: true,
      id: "name",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
      width: "100",
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
      width: "auto",
      wrap: true,
    },
    {
      name: "Birthday",
      selector: (row) => row.birthday,
      sortable: true,
      width: "150px",
      wrap: true,

      sortFunction: (a, b) => {
        // Parse the date strings into Date objects for comparison
        const dateA = new Date(a.birthday);
        const dateB = new Date(b.birthday);

        if (dateA < dateB) {
          return -1;
        } else if (dateA > dateB) {
          return 1;
        }
        return 0;
      },
    },
    {
      name: "Contact",
      selector: (row) => row.contact,
      width: "100px",
      wrap: true,
      //@ts-ignore
      compact: "true",
    },
    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
      width: "150px",
      wrap: true,
    },
    {
      name: "Sex",
      selector: (row) => row.sex,
      sortable: true,
      width: "50px",
      //@ts-ignore
      compact: "true",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="justify-center text-center items-center flex py-3 gap-2">
          <button
            className={`text-primary btn btn-square`}
            onClick={() => {
              dispatch(editUserDetailActions.setEditUserDetails(row));
              dispatch(editUserDetailActions.toggleDeleteUserModal());
            }}
          >
            <FaTrash size={20} className={`text-[#fc2929]`} />
          </button>
          <button
            className="btn btn-md btn-square"
            onClick={() => {
              dispatch(editUserDetailActions.setEditUserDetails(row));
              router.replace(`/patient-records/${row.username}`);
            }}
          >
            <FaUserEdit size={25} className={`text-primary`} />
          </button>
        </div>
      ),
    },
  ];
  const customUserTableStyles = {
    headCells: {
      style: {
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    rows: {
      style: { fontSize: "12px" },
    },
  };

  if (isAuth) {
    return (
      <div data-theme="lemonade" className="">
        <Suspense fallback={<Loading />}>
          <NavbarDashboard />

          <DashboardDrawer />

          <div className="flex flex-col relative px-4 pb-8 pt-[102px]">
            <div className="flex flex-row justify-between items-center gap-4 mt-2 mb-8">
              <div className="md:ml-4">
                <h5 className="sm:hidden flex">Patient Records</h5>
                <h4 className="hidden sm:flex">Patient Records</h4>
              </div>
              <div className="flex items-center justify-center gap-3">
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
            {dataPatients && (
              <DataTable
                columns={columns}
                data={filteredUsers}
                customStyles={customUserTableStyles}
                pagination
                dense
                paginationPerPage={5}
                responsive
                striped
                defaultSortAsc
                defaultSortFieldId="name"
                paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
              />
            )}
          </div>
          {showEmergencyModal && <EmergencyModal />}
          {showDeleteUserModal && <DeleteUserModal />}
          <AlertMessage/>
        </Suspense>
      </div>
    );
  }
};

export default PatientHistory;
