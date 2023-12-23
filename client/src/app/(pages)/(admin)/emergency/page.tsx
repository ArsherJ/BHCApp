"use client";
import React, { Suspense, useEffect, useState } from "react";
import NavbarDashboard from "../../../components/NavbarDashboard";
import DashboardDrawer from "../../../components/DashboardDrawer";
import { useDispatch, useSelector } from "react-redux";
import {
  IRoot,
  INewsUpdates,
  IPatientDetails,
  EnumNewsModalType,
  IEmergencyDetails,
  IGetEmergencyResponse,
} from "../../../redux/interfaces";
import axios from "axios";
import useVerification from "../../../hooks/api-hooks/useVerification";
import PageLoader from "../../../components/loaders/PageLoader";
import useGetNewsUpdates from "../../../hooks/api-hooks/newsUpdatesAPI/useGetNewsUpdates";
import DataTable, { TableColumn } from "react-data-table-component";
import { IoNewspaperSharp, IoSearchCircleSharp } from "react-icons/io5";
import Image from "next/image";
import {
  newsModalActions,
  viewEmergencyModalActions,
} from "../../../redux/store";
import { FaTrash, FaUserDoctor } from "react-icons/fa6";
import NewsModal from "../../../components/modals/news-updates/NewsModal";
import NewsConfirmModal from "../../../components/modals/news-updates/NewsConfirmModal";
import { RiEdit2Fill } from "react-icons/ri";
import Link from "next/link";
import AlertMessage from "../../../components/AlertMessage";
import useGetEmergency from "../../../hooks/api-hooks/emergencyAPI/useGetEmergency";
import { isURL } from "../../../utilities/dataHelper";
import { AiTwotoneEye } from "react-icons/ai";
import ViewEmergencyModal from "../../../components/modals/ViewEmergencyModal";
import TableLoader from "@/app/components/loaders/TableLoader";
import Loading from "./loading";

const NewsUpdates = () => {
  const dispatch = useDispatch();
  const {
    data: dataEmergency,
    loading: isLoadingGetEmergency,
    error: errorEmergency,
    getEmergency,
  } = useGetEmergency();
  const [filterText, setFilterText] = useState("");
  const filteredNews = dataEmergency?.filter((item: IGetEmergencyResponse) => {
    return item.sender_email?.toLowerCase().includes(filterText.toLowerCase());
  });
  const { isLoadingVerification } = useVerification();

  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );

  const showViewEmergencyModal = useSelector(
    (state: IRoot) => state.viewEmergencyModal.showViewEmergencyModal
  );

  const { role: userRole, isAuth } = userDetails;
  axios.defaults.withCredentials = true;
  if (isLoadingVerification || isLoadingGetEmergency) {
    return (
      <div className="bg-white">
        <NavbarDashboard />
        <PageLoader />
      </div>
    );
  }

  const columns: TableColumn<IGetEmergencyResponse>[] = [
    {
      name: "Sender",
      //@ts-ignore
      selector: (row) => row.sender_email,
      sortable: true,
      compact: true,
      wrap: true,
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
      sortable: true,
      compact: true,
      wrap: true,
    },
    {
      name: "Message",
      selector: (row) => {
        if (row.message) {
          return row.message;
        } else {
          return "No Message Sent";
        }
      },
      sortable: true,
      compact: true,
      wrap: true,
    },
    {
      name: "Location",
      //@ts-ignore
      selector: (row) => {
        if (row.location) {
          if (isURL(row.location)) {
            return (
              <Link
                prefetch
                href={row.location}
                target="_blank"
                className="text-primary underline"
              >
                Map Link
              </Link>
            );
          } else {
            return <div>{row.location}</div>;
          }
        } else {
          return (
            <Link
              prefetch
              href="#"
              target="_blank"
              className="text-primary underline"
            >
              Link Undefined
            </Link>
          );
        }
      },
      sortable: true,
    },
    {
      name: "DateTime",
      selector: (row) => {
        if (row.created_date) {
          return row.created_date;
        } else {
          return "Unknown";
        }
      },
      sortable: true,
      width: "250px",
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <div className="justify-center text-center items-center flex flex-row py-3 gap-3">
    //       <button
    //         className={`text-primary btn btn-square`}
    //         onClick={() => {
    //           dispatch(viewEmergencyModalActions.setEmergencyDetails(row));
    //           dispatch(viewEmergencyModalActions.toggleViewEmergencyModal());
    //         }}
    //       >
    //         <AiTwotoneEye size={20} className={`text-primary`} />
    //       </button>
    //     </div>
    //   ),
    // },
  ];
  const customUserTableStyles = {
    headCells: {
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    rows: {
      style: { fontSize: "14px" }, // Define your desired font size here
    },
  };

  if (isAuth) {
    return (
      <div data-theme="lemonade" className="">
        <Suspense fallback={<Loading/>}>
          <DashboardDrawer />
          <NavbarDashboard />
          <div className="flex flex-col relative px-4 pb-8 pt-[102px]">
            <div className="flex flex-row justify-between items-center mt-2 mb-8">
              <div className="ml-4">
                <h4>Emergency Reports</h4>
              </div>
              <div className="flex items-center justify-center flex-wrap gap-3">
                <div className="relative w-50">
                  <input
                    type="text"
                    placeholder="Search Sender"
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

            {dataEmergency && (
              <DataTable
                columns={columns}
                data={filteredNews}
                customStyles={customUserTableStyles}
                pagination
                dense
                paginationPerPage={5}
                responsive
                striped
                paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
              />
            )}
          </div>
          {showViewEmergencyModal && <ViewEmergencyModal />}
          <AlertMessage />
        </Suspense>
      </div>
    );
  }
};

export default NewsUpdates;
