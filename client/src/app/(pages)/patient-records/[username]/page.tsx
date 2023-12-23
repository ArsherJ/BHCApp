"use client";
import AlertMessage from "../../../components/AlertMessage";
import DashboardDrawer from "../../../components/DashboardDrawer";
import NavbarDashboard from "../../../components/NavbarDashboard";
import { Suspense } from "react";
import { customStyles } from "../../../components/datatable/datatable-theme";
import PageLoader from "../../../components/loaders/PageLoader";
import EmergencyModal from "../../../components/modals/EmergencyModal";
import RecordsModal from "../../../components/modals/RecordsModal";
import useGetRecordTable from "../../../hooks/api-hooks/recordTableAPI/useGetRecordTable";
import useGetPatients from "../../../hooks/api-hooks/useGetPatients";
import useUpdatePatientRecords from "../../../hooks/api-hooks/useUpdatePatientRecords";
import useUpdateUserRecords from "../../../hooks/api-hooks/useUpdatePatientRecords";
import useVerification from "../../../hooks/api-hooks/useVerification";
import {
  EnumCovidVaccineStatus,
  EnumDoctorModalType,
  EnumInjury,
  EnumMentalHealthStatus,
  EnumPWD,
  EnumPhilhealthStatus,
  EnumSenior,
  EnumTobaccoUse,
  EnumUserRole,
  IGetEmergencyResponse,
  IRoot,
  IUserRecordTable,
} from "../../../redux/interfaces";
import {
  alertMessageActions,
  doctorModalActions,
  editUserDetailActions,
  recordsModalActions,
  userDetailsActions,
} from "../../../redux/store";
import { isNotEdited, isURL } from "../../../utilities/dataHelper";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { BsVirus } from "react-icons/bs";
import {
  FaUser,
  FaEnvelope,
  FaBirthdayCake,
  FaPhone,
  FaMapMarker,
  FaVenusMars,
  FaHospitalUser,
  FaIdCard,
  FaSmoking,
  FaTint,
  FaUserClock,
  FaWeightHanging,
  FaWheelchair,
} from "react-icons/fa";
import {
  FaBabyCarriage,
  FaTemperatureHigh,
  FaUserDoctor,
  FaWeightScale,
} from "react-icons/fa6";
import {
  GiBodyHeight,
  GiHealthNormal,
  GiWeightLiftingUp,
} from "react-icons/gi";
import { IoMdAddCircle } from "react-icons/io";
import { IoSearchCircleSharp } from "react-icons/io5";
import { MdPersonalInjury } from "react-icons/md";
import { RiMentalHealthFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import TableLoader from "@/app/components/loaders/TableLoader";
import Loading from "../loading";

function UserDetails({ params }: { params: { username: string } }) {
  const { loading: isLoadingUpdateRecords, updatePatientRecords } =
    useUpdatePatientRecords();
  const { data: dataPatients } = useGetPatients();
  const { data: dataRecordTable } = useGetRecordTable();

  const editUserDetails = useSelector(
    (state: IRoot) => state.editUserDetail.editUserDetails
  );

  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );

  const { role: userRole } = userDetails;

  const showEmergencyModal = useSelector(
    (state: IRoot) => state.emergencyModal.showEmergencyModal
  );

  const showRecordsModal = useSelector(
    (state: IRoot) => state.recordsModal.showRecordsModal
  );
  const [intValue, setIntValue] = useState("");
  const [filterText, setFilterText] = useState("");

  console.log("[data]:", dataRecordTable);

  const filterRecordById = dataRecordTable?.filter((item: IUserRecordTable) => {
    return item?.user_id == editUserDetails?.id;
  });

  const filteredRecord = filterRecordById?.filter((item: IUserRecordTable) => {
    return item.date?.includes(filterText.toLowerCase());
  });
  const dispatch = useDispatch();
  axios.defaults.withCredentials = true;

  const { isLoadingVerification } = useVerification();

  const editUser = useMemo(() => {
    return dataPatients?.find((user: any) => user.username == params.username);
  }, [dataPatients]);

  useEffect(() => {
    dispatch(editUserDetailActions.setEditUserDetails(editUser));
  }, [editUser, dispatch]);

  if (isLoadingVerification) {
    return (
      <div className="bg-white">
        {/* <NavbarDashboard /> */}
        <PageLoader />
      </div>
    );
  }
  const philHealthStatusOptions = Object.entries(EnumPhilhealthStatus)
  .filter(([key, value]) => typeof value === "number")
  .map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });

  const seniorStatusOptions = Object.entries(EnumSenior)
  .filter(([key, value]) => typeof value === "number")
  .map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });

  const tobaccoUsesOptions = Object.entries(EnumTobaccoUse)
  .filter(([key, value]) => typeof value === "number")
  .map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });

  const pwdOptions = Object.entries(EnumPWD)
  .filter(([key, value]) => typeof value === "number")
  .map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });

  if (!editUser) {
    return (
      <div className="bg-white">
        {/* <NavbarDashboard /> */}
        {/* <DashboardDrawer /> */}
        <PageLoader loaderText={"Fetching User Details"} />
      </div>
    );
  }

  const bmi = editUserDetails?.bmi;

  const BMI_PREFIX = bmi
    ? bmi < 18.5
      ? "Underweight"
      : bmi >= 18.5 && bmi <= 24.9
      ? "Normal"
      : bmi >= 25 && bmi < 29.9
      ? "Overweight"
      : "Obese"
    : "N/A";

  const handleEditUserDetails = (event: any) => {
    event.preventDefault();
    if (editUser == editUserDetails) {
      alert("No Changes Detected!");
    } else {
      updatePatientRecords();
    }
  };
  const ExpandedComponent = ({ data }: any) => {
    const {
      date,
      illness_history,
      physical_exam,
      assessment,
      treatment_plan,
      notes,
    } = data;
    const { first_name, last_name } = editUserDetails;

    return (
      <div className="expanded-card justify-items-center bg-gray-100">
        <div className="border-b-primary border-b-2 bg-gray-100 text-black py-2 px-2">
          <div className="font-bold text-lg capitalize">
            {first_name} {last_name}&apos;s Record
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg shadow py-4 px-2 whitespace-normal">
          <div className="mb-4 flex-col flex gap-1">
            <span className="text-md text-start font-extrabold">Date </span>
            <span
              className="text-sm font-light max-w-[60vw]"
              style={{ overflowWrap: "break-word" }}
            >
              &bull; {date}
            </span>
          </div>
          <hr className="my-4 border-t border-gray-300" />
          <div className="mb-4 flex-col flex gap-1">
            <span className="text-md text-start font-extrabold">
              History of Illness{" "}
            </span>
            <span
              className="text-sm font-light max-w-[60vw]"
              style={{ overflowWrap: "break-word" }}
            >
              &bull; {illness_history}
            </span>
          </div>
          <hr className="my-4 border-t border-gray-300" />
          <div className="mb-4 flex-col flex gap-1">
            <span className="text-md text-start font-extrabold">
              Physical Exam{" "}
            </span>
            <span
              className="text-sm font-light max-w-[60vw]"
              style={{ overflowWrap: "break-word" }}
            >
              &bull; {physical_exam}
            </span>
          </div>
          <hr className="my-4 border-t border-gray-300" />
          <div className="mb-4 flex-col flex gap-1">
            <span className="text-md text-start font-extrabold">
              Assessment{" "}
            </span>
            <span
              className="text-sm font-light max-w-[60vw]"
              style={{ overflowWrap: "break-word" }}
            >
              &bull; {assessment}
            </span>
          </div>
          <hr className="my-4 border-t border-gray-300" />
          <div className="mb-4 flex-col flex gap-1">
            <span className="text-md text-start font-extrabold">
              Treatment Plan{" "}
            </span>
            <span
              className="text-sm font-light max-w-[60vw]"
              style={{ overflowWrap: "break-word" }}
            >
              &bull; {treatment_plan}
            </span>
          </div>
          <hr className="my-4 border-t border-gray-300" />
          <div className="mb-4 flex-col flex gap-1">
            <span className="text-md text-start font-extrabold">Notes </span>
            <span
              className="text-sm font-light max-w-[60vw]"
              style={{ overflowWrap: "break-word" }}
            >
              &bull; {notes}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const handleIntInputChange = (event: any) => {
    const { value } = event.target;
    // Use a regular expression to remove any non-integer characters
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    setIntValue(sanitizedValue);
  };

  const columns: TableColumn<IUserRecordTable>[] = [
    {
      name: "Date",
      //@ts-ignore
      selector: (row) => row.date,
      sortable: true,
      width: "160px",
      id: "date",
    },
    {
      name: "History of Illness",
      selector: (row) => row.illness_history,
      sortable: true,
      width: "250px",
    },
    {
      name: "Physical Exam",
      selector: (row) => row.physical_exam,
      sortable: true,
      width: "250px",
    },
    {
      name: "Assessment",
      selector: (row) => row.assessment,
      sortable: true,
      width: "250px",
    },
    {
      name: "Treatment Plan",
      selector: (row) => row.treatment_plan,
      sortable: true,
      width: "250px",
    },
    {
      name: "Notes",
      selector: (row) => row.notes,
      sortable: true,
      width: "250px",
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

  return (
    <div className="pb-8 pt-[102px] bg-gray-100" data-theme="lemonade">
      <Suspense fallback={<Loading />}>
        <NavbarDashboard />
        <DashboardDrawer />
        <div className=" px-4 sm:px-8 md:px-24 xl:px-28 flex flex-col gap-4">
          <form className="flex flex-col justify-start gap-4">
            <div className="grid bg-white grid-cols-2 justify-start items-center gap-4 border-2 border-gray shadow-md rounded-xl py-4 px-6">
              <div className="col-span-2 flex justify-start items-center border-b-primary border-b-2 py-2">
                <h6>Patient Details</h6>
              </div>
              <div className="col-span-2 lg:col-span-1 gap-2 flex flex-col">
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[14px] gap-2 items-center"
                    htmlFor="fullName"
                  >
                    <FaUser />
                    Name:
                  </label>
                  <input
                    disabled={true}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={`${editUserDetails?.first_name} ${editUserDetails?.last_name}`}
                  />
                </div>
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="email"
                  >
                    <FaEnvelope />
                    Email:
                  </label>
                  <input
                    disabled={true}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    type="text"
                    id="email"
                    name="email"
                    value={editUserDetails?.email}
                  />
                </div>
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="birthday"
                  >
                    <FaBirthdayCake />
                    Birthday:
                  </label>
                  <input
                    disabled={true}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    type="text"
                    id="birthday"
                    name="birthday"
                    value={editUserDetails?.birthday}
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-1 gap-2 flex flex-col">
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="contact"
                  >
                    <FaPhone /> Contact:
                  </label>
                  <input
                    disabled={true}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    type="text"
                    id="contact"
                    name="contact"
                    value={editUserDetails?.contact}
                  />
                </div>
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="address"
                  >
                    <FaMapMarker />
                    Address:
                  </label>
                  <input
                    disabled={true}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    type="text"
                    id="address"
                    name="address"
                    value={editUserDetails?.address}
                  />
                </div>
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="sex"
                  >
                    <FaVenusMars />
                    Sex:
                  </label>
                  <input
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    disabled={true}
                    type="text"
                    id="sex"
                    name="sex"
                    value={editUserDetails?.sex}
                  />
                </div>
              </div>
            </div>
            <div className="grid bg-white grid-cols-2 justify-start items-center gap-4 border-2 border-gray shadow-md rounded-xl py-4 px-6">
              <div className="col-span-2 flex justify-start items-center border-b-primary border-b-2 py-2">
                <h6>Patient Records</h6>
              </div>
              <div className="lg:col-span-1 col-span-2 gap-2 flex flex-col">
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="cesarean_section"
                  >
                    <FaBabyCarriage /> Cesarean Section:
                  </label>
                  <input
                    disabled={userRole === EnumUserRole.USER}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    type="text"
                    placeholder="Cesarean Section"
                    id="cesarean_section"
                    name="cesarean_section"
                    value={editUserDetails?.cesarean_section ?? "Unknown"}
                    onChange={(e) =>
                      dispatch(
                        editUserDetailActions.setEditUserDetails({
                          ...editUserDetails,
                          cesarean_section: e.target.value,
                        })
                      )
                    }
                  />
                </div>

                {/* Philhealth Status */}
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="philhealth_status"
                  >
                    <GiHealthNormal /> Philhealth Status:
                  </label>

                  <select
                    disabled={userRole === EnumUserRole.USER}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    id="philhealth_status"
                    name="philhealth_status"
                    value={editUserDetails?.philhealth_status}
                    onChange={(e) =>
                      dispatch(
                        editUserDetailActions.setEditUserDetails({
                          ...editUserDetails,
                          philhealth_status: e.target.value,
                        })
                      )
                    }
                  >
                    {philHealthStatusOptions}
                  </select>
                </div>

                {/* Philhealth ID Number */}
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="philhealth_id"
                  >
                    <FaIdCard /> Philhealth ID Number:
                  </label>
                  <input
                    disabled={userRole === EnumUserRole.USER}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    type="text"
                    placeholder="ID Number"
                    id="philhealth_id"
                    name="philhealth_id"
                    value={editUserDetails?.philhealth_id ?? "Unknown"}
                    onChange={(e) =>
                      dispatch(
                        editUserDetailActions.setEditUserDetails({
                          ...editUserDetails,
                          philhealth_id: e.target.value,
                        })
                      )
                    }
                  />
                </div>

                {/* Head of the Family */}
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="head_of_the_family"
                  >
                    <FaHospitalUser /> Head of the Family:
                  </label>
                  <input
                    disabled={userRole === EnumUserRole.USER}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    type="text"
                    id="head_of_the_family"
                    placeholder="Head of the Family"
                    name="head_of_the_family"
                    value={editUserDetails?.head_of_the_family ?? "Unknown"}
                    onChange={(e) =>
                      dispatch(
                        editUserDetailActions.setEditUserDetails({
                          ...editUserDetails,
                          head_of_the_family: e.target.value,
                        })
                      )
                    }
                  />
                </div>

                {/* COVID-19 Status */}
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="covid_status"
                  >
                    <BsVirus /> COVID-19 Status:
                  </label>
                  <select
                    disabled={userRole === EnumUserRole.USER}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    id="covid_status"
                    name="covid_status"
                    value={editUserDetails?.covid_status}
                    onChange={(e) =>
                      dispatch(
                        editUserDetailActions.setEditUserDetails({
                          ...editUserDetails,
                          covid_status: e.target.value,
                        })
                      )
                    }
                  >
                    {Object.values(EnumCovidVaccineStatus).map(
                      (value, index) => (
                        <option key={index} value={value}>
                          {value}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Tobacco Use */}
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="tobacco_use"
                  >
                    <FaSmoking /> Tobacco Use:
                  </label>
                  <select
                    disabled={userRole === EnumUserRole.USER}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    id="tobacco_use"
                    name="tobacco_use"
                    value={editUserDetails?.tobacco_use}
                    onChange={(e) =>
                      dispatch(
                        editUserDetailActions.setEditUserDetails({
                          ...editUserDetails,
                          tobacco_use: e.target.value,
                        })
                      )
                    }
                  >
                    {tobaccoUsesOptions}
                  </select>
                </div>

                {/* Blood Pressure */}
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="blood_pressure"
                  >
                    <FaTint /> Blood Pressure:
                  </label>
                  <input
                    disabled={userRole === EnumUserRole.USER}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    type="text"
                    id="blood_pressure"
                    placeholder="Blood Pressure"
                    name="blood_pressure"
                    value={editUserDetails?.blood_pressure ?? "Unknown"}
                    onChange={(e) =>
                      dispatch(
                        editUserDetailActions.setEditUserDetails({
                          ...editUserDetails,
                          blood_pressure: e.target.value,
                        })
                      )
                    }
                  />
                </div>

                {/* Per Rectum */}
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="per_rectum"
                  >
                    <FaWeightHanging /> Per Rectum:
                  </label>
                  <input
                    disabled={userRole === EnumUserRole.USER}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    type="text"
                    id="per_rectum"
                    placeholder="Per Rectum"
                    name="per_rectum"
                    value={editUserDetails?.per_rectum ?? "Unknown"}
                    onChange={(e) =>
                      dispatch(
                        editUserDetailActions.setEditUserDetails({
                          ...editUserDetails,
                          per_rectum: e.target.value,
                        })
                      )
                    }
                  />
                </div>
              </div>
              <div className="lg:col-span-1 col-span-2 gap-2 flex flex-col">
                {/* Weight */}
                <div className="flex relative flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="weight"
                  >
                    <FaWeightScale /> Weight:
                  </label>
                  <input
                    disabled={userRole === EnumUserRole.USER}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    type="text"
                    id="weight"
                    name="weight"
                    value={editUserDetails?.weight}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );

                      dispatch(
                        editUserDetailActions.setEditUserDetails({
                          ...editUserDetails,
                          weight: +numericValue,
                        })
                      );
                    }}
                  />
                  <span className="absolute flex items-center justify-center right-4">
                    kg
                  </span>
                </div>

                {/* Height */}
                <div className="flex flex-row relative gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="height"
                  >
                    <GiBodyHeight /> Height:
                  </label>
                  <input
                    disabled={userRole === EnumUserRole.USER}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    type="text"
                    id="height"
                    name="height"
                    value={editUserDetails?.height}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      dispatch(
                        editUserDetailActions.setEditUserDetails({
                          ...editUserDetails,
                          height: +numericValue,
                        })
                      );
                    }}
                  />
                  <span className="absolute flex items-center justify-center right-4">
                    cm
                  </span>
                </div>

                {/* Body Mass Index */}
                <div className="flex relative flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="bmi"
                  >
                    <GiWeightLiftingUp /> Body Mass Index:
                  </label>
                  <input
                    disabled={userRole === EnumUserRole.USER}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    type="text"
                    id="bmi"
                    name="bmi"
                    value={editUserDetails?.bmi}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      dispatch(
                        editUserDetailActions.setEditUserDetails({
                          ...editUserDetails,
                          bmi: +numericValue,
                        })
                      );
                    }}
                  />
                  <span className="absolute flex items-center justify-center right-4">
                    {BMI_PREFIX}
                  </span>
                </div>

                {/* Temperature */}
                <div className="flex relative flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="temperature"
                  >
                    <FaTemperatureHigh /> Temperature:
                  </label>
                  <input
                    disabled={userRole === EnumUserRole.USER}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    type="text"
                    id="temperature"
                    name="temperature"
                    value={editUserDetails?.temperature}
                    onChange={(e) => {
                      let numericValue = e.target.value.replace(/[^0-9]/g, "");

                      dispatch(
                        editUserDetailActions.setEditUserDetails({
                          ...editUserDetails,
                          temperature: numericValue,
                        })
                      );
                    }}
                  />
                  <span className="absolute flex items-center justify-center right-4">
                    &deg;C
                  </span>
                </div>

                {/* Person with Disability */}
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="pwd"
                  >
                    <FaWheelchair /> Person with Disability:
                  </label>
                  <select
                    disabled={userRole === EnumUserRole.USER}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    id="pwd"
                    name="pwd"
                    value={editUserDetails?.pwd}
                    onChange={(e) =>
                      dispatch(
                        editUserDetailActions.setEditUserDetails({
                          ...editUserDetails,
                          pwd: e.target.value,
                        })
                      )
                    }
                  >
                    {pwdOptions}
                  </select>
                </div>

                {/* Senior */}
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="senior"
                  >
                    <FaUserClock /> Senior:
                  </label>
                  <select
                    disabled={userRole === EnumUserRole.USER}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    id="senior"
                    name="senior"
                    value={editUserDetails?.senior}
                    onChange={(e) =>
                      dispatch(
                        editUserDetailActions.setEditUserDetails({
                          ...editUserDetails,
                          senior: e.target.value,
                        })
                      )
                    }
                  >
                    {seniorStatusOptions}
                  </select>
                </div>

                {/* Injury */}
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="injury"
                  >
                    <MdPersonalInjury /> Injury:
                  </label>
                  <select
                    disabled={userRole === EnumUserRole.USER}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    id="injury"
                    name="injury"
                    value={editUserDetails?.injury}
                    onChange={(e) =>
                      dispatch(
                        editUserDetailActions.setEditUserDetails({
                          ...editUserDetails,
                          injury: e.target.value,
                        })
                      )
                    }
                  >
                    {Object.values(EnumInjury).map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mental Health */}
                <div className="flex flex-row gap-2 justify-between items-center">
                  <label
                    className="flex flex-row lg:text-[18px] text-[15px] gap-2 items-center"
                    htmlFor="mental_health"
                  >
                    <RiMentalHealthFill /> Mental Health:
                  </label>
                  <select
                    disabled={userRole === EnumUserRole.USER}
                    className="input bg-gray-100 h-[2.5rem] input-xs md:input-sm  input-bordered w-full max-w-xs"
                    id="mental_health"
                    name="mental_health"
                    value={editUserDetails?.mental_health}
                    onChange={(e) =>
                      dispatch(
                        editUserDetailActions.setEditUserDetails({
                          ...editUserDetails,
                          mental_health: e.target.value,
                        })
                      )
                    }
                  >
                    {Object.values(EnumMentalHealthStatus).map(
                      (value, index) => (
                        <option key={index} value={value}>
                          {value}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
              {userRole === EnumUserRole.ADMIN && (
                <>
                  <hr className="min-w-full col-span-2" />
                  <div className="flex col-span-2 flex-row justify-end items-center text-center p">
                    <button
                      className="btn btn-primary min-w-[250px]"
                      disabled={
                        isNotEdited(editUser, editUserDetails) ||
                        isLoadingUpdateRecords
                      }
                      onClick={handleEditUserDetails}
                    >
                      {isLoadingUpdateRecords ? (
                        <>
                          <span className="loading loading-spinner loading-sm text-[#FFF]" />
                          SAVING
                        </>
                      ) : (
                        "SAVE CHANGES"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </form>
          <div className="flex flex-col min-h-[500px] bg-white gap-4 border-2 shadow-md rounded-xl py-4 px-6">
            <div className="flex flex-col md:flex-row text-start md:justify-between md:items-end justify-center items-center py-4 gap-4 border-b-primary border-b-2">
              <div className="md:ml-4">
                <h6>Record Table</h6>
              </div>
              <div className="flex items-center justify-center flex-wrap gap-3">
                {userRole === EnumUserRole.ADMIN && (
                  <>
                    <div className="flex flex-row gap-4">
                      <button
                        className="btn btn-outline btn-primary"
                        onClick={() => {
                          dispatch(recordsModalActions.toggleRecordsModal());
                        }}
                      >
                        <IoMdAddCircle size={18} />
                        Add Record
                      </button>
                    </div>

                    <div className="relative w-50">
                      <input
                        type="text"
                        placeholder="Search Date"
                        className="w-full pr-10 input input-primary input-bordered text-[14px]"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                      />
                      <button className="absolute top-1/2 transform -translate-y-1/2 right-3">
                        <IoSearchCircleSharp className="text-primary" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <DataTable
              columns={columns}
              data={filteredRecord}
              customStyles={customUserTableStyles}
              pagination
              expandableRows
              expandableRowsComponent={ExpandedComponent}
              paginationPerPage={5}
              // dense
              defaultSortAsc={false}
              defaultSortFieldId="date"
              responsive
              striped
              paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
            />
          </div>
        </div>
        {showEmergencyModal && <EmergencyModal />}
        {showRecordsModal && <RecordsModal />}
        <AlertMessage />
      </Suspense>
    </div>
  );
}

export default UserDetails;
