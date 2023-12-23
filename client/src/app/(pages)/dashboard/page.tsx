"use client";
import React, { Suspense, useEffect, useState } from "react";
import NavbarDashboard from "../../components/NavbarDashboard";
import { useDispatch, useSelector } from "react-redux";
import {
  IRoot,
  INewsUpdates,
  IPatientDetails,
  EnumNewsModalType,
  EnumUserRole,
} from "../../redux/interfaces";
import axios from "axios";
import useVerification from "../../hooks/api-hooks/useVerification";
import PageLoader from "../../components/loaders/PageLoader";
import useGetNewsUpdates from "../../hooks/api-hooks/newsUpdatesAPI/useGetNewsUpdates";
import DataTable, { TableColumn } from "react-data-table-component";
import { IoNewspaperSharp, IoSearchCircleSharp } from "react-icons/io5";
import Image from "next/image";
import { newsModalActions } from "../../redux/store";
import { FaTrash, FaUserDoctor } from "react-icons/fa6";
import { RiEdit2Fill } from "react-icons/ri";
import Link from "next/link";
import AlertMessage from "../../components/AlertMessage";
import { MdGridView } from "react-icons/md";
import { AiTwotoneEye } from "react-icons/ai";
import TableLoader from "@/app/components/loaders/TableLoader";
import Loading from "./loading";
import DashboardDrawer from "@/app/components/DashboardDrawer";
import EmergencyModal from "../../components/modals/EmergencyModal";
import NewsConfirmModal from "@/app/components/modals/news-updates/NewsConfirmModal";
import NewsModal from "@/app/components/modals/news-updates/NewsModal";
import useGetUserDetails from "@/app/hooks/api-hooks/useGetUserDetails";
import useGetAppointment from "@/app/hooks/api-hooks/appointmentAPI/useGetAppointment";
import useGetDoctors from "@/app/hooks/api-hooks/doctorAPI/useGetDoctors";
import useGetPatients from "@/app/hooks/api-hooks/useGetPatients";

const NewsUpdates = () => {
  const dispatch = useDispatch();
  const {
    data: dataNewsUpdates,
    loading: isLoadingNewsUpdates,
    error: errorNewsUpdates,
    getNewsUpdates,
  } = useGetNewsUpdates();
  const {
    data: dataAppointments,
    loading: isLoadingAppointments,
    error: errorAppointments,
    getAppointments,
  } = useGetAppointment();
  const {
    data: dataDoctors,
    loading: isLoadingDoctors,
    error: errorDoctors,
    getDoctors,
  } = useGetDoctors();
  const {
    data: dataPatients,
    loading: isLoadingPatients,
    error: errorPatients,
    getPatients,
  } = useGetPatients();

  const [filterText, setFilterText] = useState("");
  const filteredNews = dataNewsUpdates?.filter((item: INewsUpdates) => {
    return item.headline?.includes(filterText.toLowerCase());
  });
  const { isLoadingVerification } = useVerification();
  const { loading: isLoadingUserDetails } = useGetUserDetails();

  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );
  const showNewsModal = useSelector(
    (state: IRoot) => state.newsModal.showNewsModal
  );
  const showEmergencyModal = useSelector(
    (state: IRoot) => state.emergencyModal.showEmergencyModal
  );
  const showNewsConfirmationModal = useSelector(
    (state: IRoot) => state.newsModal.showNewsConfirmationModal
  );
  const { role: userRole, isAuth } = userDetails;
  axios.defaults.withCredentials = true;

  if (isLoadingVerification || isLoadingUserDetails) {
    return (
      <div className="bg-white">
        <NavbarDashboard />
        <PageLoader />
      </div>
    );
  }

  const columns: TableColumn<INewsUpdates>[] = [
    {
      name: "Image",
      //@ts-ignore
      selector: (row) => {
        if (row.image) {
          const imageURL = row.image;
          const imageSpan = (
            <span>
              <Image
                src={imageURL}
                alt="News/Event Image"
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
                src={"/image1.jpg"}
                alt="News/Event Image"
                width={65}
                height={65}
                className="py-2 max-h-120 max-w-120"
              />
            </span>
          );
        }
      },
      sortable: true,
      compact: true,
      wrap: true,
    },
    {
      name: "Headline",
      selector: (row) => row.headline,
      sortable: true,
      id: "headline",
      compact: true,
      wrap: true,
    },
    {
      name: "Link",
      //@ts-ignore
      selector: (row) => {
        if (row.fb_link) {
          return (
            <Link
              prefetch
              href={row.fb_link}
              target="_blank"
              className="text-primary underline"
            >
              Facebook Link
            </Link>
          );
        } else {
          return <div className="text-ghost">Not Provided</div>;
        }
      },
      compact: true,
      wrap: true,
      sortable: true,
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
                  dispatch(newsModalActions.setNewsDetails(row));
                  dispatch(newsModalActions.toggleNewsModal());
                  dispatch(
                    newsModalActions.setNewsModalType(EnumNewsModalType.UPDATE)
                  );
                }}
              >
                <RiEdit2Fill size={25} className={`text-primary`} />
              </button>
              <button
                className={`text-primary btn btn-square`}
                onClick={() => {
                  dispatch(newsModalActions.setNewsDetails(row));
                  dispatch(newsModalActions.toggleNewsConfirmationModal());
                }}
              >
                <FaTrash size={20} className={`text-[#fc2929]`} />
              </button>
            </>
          )}
          {userRole === EnumUserRole.USER && (
            <button
              className={`text-primary btn btn-square`}
              onClick={() => {
                dispatch(newsModalActions.setNewsDetails(row));
                dispatch(newsModalActions.toggleNewsModal());
                dispatch(
                  newsModalActions.setNewsModalType(EnumNewsModalType.VIEW)
                );
              }}
            >
              <AiTwotoneEye size={25} className={`text-primary`} />
            </button>
          )}
        </div>
      ),
    },
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

  const cardStylings = `col-span-1 bg-primary opacity-90 text-white shadow-md justify-center items-center flex py-4  px-1 max-h-[250px] max-w-[400px] border-[1px] border-primary shadow-sm rounded-md`;

  if (isAuth) {
    return (
      <div data-theme="lemonade" className="">
        <NavbarDashboard />
        <Suspense fallback={<Loading />}>
          <DashboardDrawer />
          <div className="flex flex-col relative px-4 pb-8 pt-[120px]">
            {/* <div className="grid grid-cols-1 text-center my-12 lg:grid-cols-2 xl:grid-cols-3 gap-4 px-[100px] items-center justify-center">
              <div className="flex justify-center items-center">
                <div className={cardStylings}>
                  <div className="grid grid-cols-3">
                    <div className="flex col-span-2 flex-col justify-start items-center gap-1">
                      <div>
                        <FaUserDoctor size={40} />
                      </div>
                      <span className="text-[18px] text-center font-extrabold">
                        MEDICAL PROFESSIONALS
                      </span>
                    </div>
                    <div className="flex text-black font-extrabold justify-end items-center col-span-1">
                      <h2 className="bg-gray-100 p-4 rounded-full">
                        {dataDoctors.length}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className={cardStylings}>
                  <div className="grid grid-cols-3">
                    <div className="flex col-span-2 flex-col text-start justify-start items-center gap-1">
                      <div>
                        <FaUserDoctor size={40} />
                      </div>
                      <span className="text-[18px]  text-center font-extrabold">
                        REGISTERED PATIENTS
                      </span>
                    </div>
                    <div className="flex text-black font-extrabold justify-end items-center col-span-1">
                      <h2 className="bg-gray-100 p-4 rounded-full">
                        {dataPatients.length}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className={cardStylings}>
                  <div className="grid grid-cols-3">
                    <div className="flex col-span-2 flex-col justify-start items-center gap-1">
                      <div>
                        <FaUserDoctor size={40} />
                      </div>
                      <span className="text-[18px] text-center font-extrabold">
                        MEDICAL PROFESSIONALS
                      </span>
                    </div>
                    <div className="flex text-black font-extrabold justify-end items-center col-span-1">
                      <h2 className="bg-gray-100 p-4 rounded-full">
                        {dataDoctors.length}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="flex flex-col gap-4 md:flex-row justify-between items-center mt-2 mb-8">
              <div className="md:ml-4">
                <h5 className="md:hidden flex">News and Events</h5>
                <h4 className="hidden md:flex">News and Events</h4>
              </div>
              <div className="flex items-center justify-center flex-wrap gap-3">
                {userRole === EnumUserRole.ADMIN && (
                  <div className="flex flex-row gap-4">
                    <button
                      className="btn btn-outline btn-primary"
                      onClick={(e: any) => {
                        e.preventDefault();
                        dispatch(newsModalActions.toggleNewsModal());
                        dispatch(
                          newsModalActions.setNewsModalType(
                            EnumNewsModalType.ADD
                          )
                        );
                      }}
                    >
                      <IoNewspaperSharp size={18} />
                      Add News/Events
                    </button>
                  </div>
                )}

                <div className="relative flex-shrink w-50">
                  <input
                    type="text"
                    placeholder="Search Headline"
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
            {dataNewsUpdates && (
              <DataTable
                columns={columns}
                data={filteredNews}
                customStyles={customUserTableStyles}
                pagination
                dense
                paginationPerPage={5}
                responsive
                striped
                defaultSortAsc
                defaultSortFieldId="headline"
                paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
              />
            )}
          </div>
          {showNewsModal && <NewsModal />}
          {showNewsConfirmationModal && <NewsConfirmModal />}
          {showEmergencyModal && <EmergencyModal />}

          <AlertMessage />
        </Suspense>
      </div>
    );
  }
};

export default NewsUpdates;
