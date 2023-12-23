"use client";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import NavbarDashboard from "../../../components/NavbarDashboard";
import DashboardDrawer from "../../../components/DashboardDrawer";
import EmergencyModal from "../../../components/modals/EmergencyModal";
import { useDispatch, useSelector } from "react-redux";
import {
  IRoot,
  EnumUserRole,
  IDoctor,
  EnumDoctorStatus,
  EnumDoctorModalType,
} from "../../../redux/interfaces";
import useVerification from "../../../hooks/api-hooks/useVerification";
import { doctorModalActions, userDetailsActions } from "../../../redux/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import PageLoader from "../../../components/loaders/PageLoader";
import NotAuthorized from "../../../not-authorized/page";
import useLogout from "../../../hooks/api-hooks/useLogout";
import LogoutLoader from "../../../components/loaders/GlobalLoader";
import DataTable, { TableColumn } from "react-data-table-component";
import { customStyles } from "../../../components/datatable/datatable-theme";
import AlertMessage from "../../../components/AlertMessage";
import Image from "next/image";
import Link from "next/link";
import { FaPersonCircleQuestion, FaUserDoctor } from "react-icons/fa6";
import { IoSearchCircleSharp } from "react-icons/io5";
import AddDoctorModal from "../../../components/modals/doctors/AddDoctorModal";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import DoctorConfirmModal from "../../../components/modals/doctors/DoctorConfirmModal";
import useGetDoctors from "../../../hooks/api-hooks/doctorAPI/useGetDoctors";
import TableLoader from "../../../components/loaders/TableLoader";
import Loading from "./loading";
import { AiTwotoneEye } from "react-icons/ai";

const Doctors = () => {
  const [filterText, setFilterText] = useState<string>("");
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    data: dataDoctors,
    loading: isLoadingDoctors,
    error: errorDoctors,
    getDoctors,
  } = useGetDoctors();
  console.table(dataDoctors);
  const doctorDetails = useSelector(
    (state: IRoot) => state.doctorModal.doctorDetails
  );
  const showEmergencyModal = useSelector(
    (state: IRoot) => state.emergencyModal.showEmergencyModal
  );
  const showDoctorModal = useSelector(
    (state: IRoot) => state.doctorModal.showDoctorModal
  );
  const showConfirmationModal = useSelector(
    (state: IRoot) => state.doctorModal.showConfirmationModal
  );

  const filterByName = dataDoctors?.filter((item: IDoctor) => {
    return (
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  axios.defaults.withCredentials = true;
  const { isLoadingVerification } = useVerification();

  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );
  const { role: userRole, isAuth } = userDetails;

  if (isLoadingVerification) {
    return (
      <div className="bg-white">
        <NavbarDashboard />
        <PageLoader />
      </div>
    );
  }

  const doctorColumns: TableColumn<IDoctor>[] = [
    {
      name: "Image",
      // @ts-ignore
      selector: (row) => {
        if (row.image) {
          const imageURL = row.image;
          const imageSpan = (
            <span>
              <Image
                src={imageURL}
                alt="Doctor Image"
                width={65}
                height={65}
                className="py-2 max-h-120 max-w-120"
              />
            </span>
          );
          return imageSpan;
        } else {
          return (
            <span>
              <Image
                src={"/doctorImage.jpg"}
                alt="Doctor Image"
                width={65}
                height={65}
                className="py-2 max-h-120 max-w-120"
              />
            </span>
          );
        }
      },
    },
    {
      name: "Name",
      selector: (row: { name: string }) => row.name,
      sortable: true,
      id: "name",
      compact: true,
      wrap: true,
    },
    {
      name: "Position",
      selector: (row: { position: string }) => row.position,
      sortable: true,
      compact: true,
      wrap: true,
    },
    {
      name: "Specialty",
      selector: (row: { specialty: string }) => row.specialty,
      sortable: true,
      compact: true,
      wrap: true,
    },
    {
      name: "Status",
      selector: (row: { status: EnumDoctorStatus }) => row.status,
      sortable: true,
      compact: true,
      wrap: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="justify-center text-center items-center flex flex-row py-3 gap-3">
          {userRole === EnumUserRole.ADMIN && (
            <>
              <button
                className={`text-primary btn btn-square`}
                onClick={() => {
                  console.log("doctorDetails.status:", row);
                  var newRow;
                  //@ts-ignore
                  if (row.status == "ONLEAVE") {
                    newRow = { ...row, status: 0 };
                  }
                  //@ts-ignore
                  if (row.status == "ACTIVE") {
                    newRow = { ...row, status: 1 };
                  }
                  //@ts-ignore
                  if (row.status == "INACTIVE") {
                    newRow = { ...row, status: 2 };
                  }
                  dispatch(doctorModalActions.setDoctorDetails(newRow));
                  dispatch(doctorModalActions.toggleDoctorModal());
                  dispatch(
                    doctorModalActions.setDoctorModalType(
                      EnumDoctorModalType.UPDATE
                    )
                  );
                }}
              >
                <FaUserEdit size={25} className={`text-primary`} />
              </button>
              <button
                className={`text-primary btn btn-square`}
                onClick={() => {
                  dispatch(doctorModalActions.setDoctorDetails(row));
                  dispatch(doctorModalActions.toggleConfirmationModal());
                }}
              >
                <FaTrash size={20} className={`text-[#fc2929]`} />
              </button>
            </>
          )}
          {userRole === EnumUserRole.USER && (
            <>
              <button
                className={`text-primary btn btn-square`}
                onClick={() => {
                  console.log("doctorDetails.status:", row);
                  var newRow;
                  //@ts-ignore
                  if (row.status == "ONLEAVE") {
                    newRow = { ...row, status: 0 };
                  }
                  //@ts-ignore
                  if (row.status == "ACTIVE") {
                    newRow = { ...row, status: 1 };
                  }
                  //@ts-ignore
                  if (row.status == "INACTIVE") {
                    newRow = { ...row, status: 2 };
                  }
                  dispatch(doctorModalActions.setDoctorDetails(newRow));
                  dispatch(doctorModalActions.toggleDoctorModal());
                  dispatch(
                    doctorModalActions.setDoctorModalType(
                      EnumDoctorModalType.VIEW
                    )
                  );
                }}
              >
                <AiTwotoneEye size={25} className={`text-primary`} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const content = (
    <div data-theme="lemonade" className="">
      <Suspense fallback={<Loading />}>
        <NavbarDashboard />
        <DashboardDrawer />

        <div className="flex flex-col relative px-4 pb-8 pt-[102px]">
          <div className="flex flex-col gap-3 md:flex-row justify-between items-center mt-2 mb-8">
            <div className="md:ml-4 capitalize">
              <h4>Medical Professionals</h4>
            </div>

            <div className="flex items-center justify-center flex-wrap gap-3">
              {userRole === EnumUserRole.ADMIN && (
                <div className="flex flex-row gap-4">
                  <button
                    className="btn btn-outline btn-primary"
                    onClick={() => {
                      dispatch(doctorModalActions.toggleDoctorModal());
                      dispatch(
                        doctorModalActions.setDoctorModalType(
                          EnumDoctorModalType.ADD
                        )
                      );
                    }}
                  >
                    <FaUserDoctor size={18} />
                    Add Medic
                  </button>
                </div>
              )}

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
          {isLoadingDoctors ? (
            <TableLoader />
          ) : (
            <DataTable
              columns={doctorColumns}
              data={filterByName}
              customStyles={customStyles}
              pagination
              paginationPerPage={5}
              defaultSortAsc
              defaultSortFieldId="name"
              striped
              paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
            />
          )}
        </div>
        {showDoctorModal && <AddDoctorModal />}
        {showConfirmationModal && <DoctorConfirmModal />}
        {showEmergencyModal && <EmergencyModal />}
      </Suspense>
      <AlertMessage />
    </div>
  );

  if (isAuth === true) {
    return content;
  }
};

export default Doctors;
