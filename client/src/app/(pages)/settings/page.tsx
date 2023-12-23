"use client";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import NavbarDashboard from "../../components/NavbarDashboard";
import DashboardDrawer from "../../components/DashboardDrawer";
import { useDispatch, useSelector } from "react-redux";
import {
  IRoot,
  EnumUserRole,
  EnumGender,
  EnumSettingsTab,
} from "../../redux/interfaces";
import axios from "axios";
import EmergencyModal from "../../components/modals/EmergencyModal";
import NotFound from "../../not-found";
import { userSettingsActions, userDetailsActions } from "../../redux/store";
import useVerification from "../../hooks/api-hooks/useVerification";
import PageLoader from "../../components/loaders/PageLoader";
import NotAuthorized from "../../not-authorized/page";
import {
  BsFilePerson,
  BsCalendarWeekFill,
  BsFillPhoneFill,
} from "react-icons/bs";
import { FaTransgender, FaEyeSlash, FaEye } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import AlertMessage from "../../components/AlertMessage";
import useUpdateUserDetails from "../../hooks/api-hooks/useUpdateUserDetails";
import useChangePassword from "../../hooks/api-hooks/useChangePassword";
import Loading from "./loading";
import useGetUserDetails from "@/app/hooks/api-hooks/useGetUserDetails";

const Settings = () => {
  axios.defaults.withCredentials = true;
  const {
    data,
    loading: isLoadingUpdateUser,
    updateUserDetails,
  } = useUpdateUserDetails();

  const {
    data: dataUserDetails,
    error: errorUserDetails,
    loading: isLoadingUserDetails,
    getUserDetails,
  } = useGetUserDetails();

  const {
    loading: isLoadingChangePassword,
    error: errorChangePassword,
    changePassword,
  } = useChangePassword();
  const showEmergencyModal = useSelector(
    (state: IRoot) => state.emergencyModal.showEmergencyModal
  );
  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );
  const [settingsTab, setSettingsTab] = useState<EnumSettingsTab>(
    EnumSettingsTab.USER_DETAILS
  );
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [fieldsError, setFieldsError] = useState("");
  // if (settingsTab === EnumSettingsTab.CHANGE_PASSWORD && errorChangePassword) {
  //   setFieldsError(errorChangePassword);
  // }

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  const toggleCPasswordVisibility = () => {
    setShowCPassword(!showCPassword);
  };

  const userSettingsDetails = useSelector(
    (state: IRoot) => state.userSettings.userSettingsDetails
  );
  const dispatch = useDispatch();

  const { role: userRole, isAuth } = userDetails;

  const { isLoadingVerification } = useVerification();

  if (isLoadingVerification) {
    return (
      <div className="bg-white">
        <NavbarDashboard />
        <PageLoader />
      </div>
    );
  }

  const handleChangePassword = (event: any) => {
    event.preventDefault();
    if (
      !userSettingsDetails.oldPassword ||
      !userSettingsDetails.newPassword ||
      !userSettingsDetails.confirmNewPassword
    ) {
      setFieldsError("All fields are required");
      return;
    }

    if (userSettingsDetails.newPassword.length < 6) {
      setFieldsError("Password must be more than 5 characters");
      return;
    }

    if (
      userSettingsDetails.newPassword !== userSettingsDetails.confirmNewPassword
    ) {
      setFieldsError("New password must be equal to Confirm password");
      return;
    }
    // Reset fields error
    setFieldsError("");

    // Proceed with the password change
    changePassword();
  };

  const handleChangeUserDetails = (event: any) => {
    event.preventDefault();
    if (
      !userSettingsDetails.first_name ||
      !userSettingsDetails.last_name ||
      !userSettingsDetails.birthday ||
      !userSettingsDetails.contact ||
      !userSettingsDetails.address ||
      !userSettingsDetails.sex ||
      !userSettingsDetails.username
    ) {
      setFieldsError("All fields must not be empty");
      return;
    }
    if (userSettingsDetails.contact.length != 11) {
      setFieldsError("Input a valid contact number, must be 11 digits");
      return;
    }

    if (!userSettingsDetails.contact.startsWith("09")) {
      setFieldsError("Contact number must start with '09'");
      return;
    }

    setFieldsError("");
    updateUserDetails();
  };

  if (isAuth) {
    return (
      <div data-theme="lemonade" className="">
        <NavbarDashboard />
        <Suspense fallback={<Loading />}>
          <DashboardDrawer />
          <div className="flex flex-col p-8 pb-8 pt-[102px] min-h-screen bg-gray-100">
            <div className="w-[100%] flex justify-center items-center flex-col gap-12">
              <form className="w-full max-w-[600px] bg-white pt-6 px-6 rounded-xl shadow-md ">
                <div className="grid-cols-2 grid w-full gap-2 items-center cursor-pointer duration-150">
                  <span
                    onClick={() => {
                      setFieldsError("");
                      setSettingsTab(EnumSettingsTab.USER_DETAILS);
                    }}
                    className={`hover:text-primary text-[1.1rem] font-extrabold duration-150 text-center pb-2 col-span-1 ${
                      settingsTab === EnumSettingsTab.USER_DETAILS &&
                      `border-b-primary border-b-2 text-primary`
                    }`}
                  >
                    User Details
                  </span>
                  <span
                    onClick={() => {
                      setFieldsError("");
                      setSettingsTab(EnumSettingsTab.CHANGE_PASSWORD);
                    }}
                    className={`hover:text-primary text-[1.1rem] font-extrabold duration-150 text-center pb-2 col-span-1 ${
                      settingsTab === EnumSettingsTab.CHANGE_PASSWORD &&
                      `border-b-primary border-b-2 text-primary`
                    } `}
                  >
                    Change Password
                  </span>
                </div>
                <hr />
                {settingsTab === EnumSettingsTab.USER_DETAILS && (
                  <>
                    <div className="my-3">
                      <label className="label text-[14px] font-bold justify-between items-center flex gap-1">
                        Email
                        <MdEmail />
                      </label>
                      <input
                        name="email"
                        type="text"
                        disabled={true}
                        className="input h-[2.5rem] input-sm bg-gray-100 input-bordered input-black w-full"
                        value={userSettingsDetails.email}
                      />
                    </div>
                    <div className="my-3">
                      <label className="label text-[14px] font-bold justify-between items-center flex gap-1">
                        First Name
                        <BsFilePerson />
                      </label>
                      <input
                        name="first_name"
                        type="text"
                        placeholder="Enter your first name"
                        className="input h-[2.5rem] input-sm bg-gray-100 input-bordered input-black w-full"
                        value={userSettingsDetails.first_name}
                        onChange={(e) => {
                          dispatch(
                            userSettingsActions.setUserSettingsDetails({
                              ...userSettingsDetails,
                              first_name: e.target.value,
                            })
                          );
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="label text-[14px] font-bold justify-between items-center flex gap-1">
                        Last Name
                        <BsFilePerson />
                      </label>
                      <input
                        name="last_name"
                        type="text"
                        placeholder="Enter your last name"
                        className="input h-[2.5rem] input-sm  bg-gray-100 input-bordered input-black w-full"
                        value={userSettingsDetails.last_name}
                        onChange={(e) => {
                          dispatch(
                            userSettingsActions.setUserSettingsDetails({
                              ...userSettingsDetails,
                              last_name: e.target.value,
                            })
                          );
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="label text-[14px] font-bold justify-between items-center flex gap-1">
                        Birthday
                        <BsCalendarWeekFill />
                      </label>
                      <input
                        name="birthday"
                        type="date"
                        placeholder="Select your birthday"
                        className="input h-[2.5rem] input-sm  bg-gray-100 input-bordered input-black w-full"
                        value={userSettingsDetails.birthday}
                        onChange={(e) => {
                          dispatch(
                            userSettingsActions.setUserSettingsDetails({
                              ...userSettingsDetails,
                              birthday: e.target.value,
                            })
                          );
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="label text-[14px] font-bold justify-between items-center flex gap-1">
                        Contact Number
                        <BsFillPhoneFill />
                      </label>
                      <input
                        name="contact_num"
                        type="tel"
                        placeholder="09xxxxxxxxx"
                        className="input h-[2.5rem] input-sm  bg-gray-100 input-bordered input-black w-full"
                        value={userSettingsDetails.contact}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );

                          dispatch(
                            userSettingsActions.setUserSettingsDetails({
                              ...userSettingsDetails,
                              contact: numericValue,
                            })
                          );
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="label text-[14px] font-bold justify-between items-center flex gap-1">
                        Address
                        <FaMapLocationDot />
                      </label>
                      <input
                        name="address"
                        type="text"
                        placeholder="Enter your address"
                        className="input h-[2.5rem] input-sm  bg-gray-100 input-bordered input-black w-full"
                        value={userSettingsDetails.address}
                        onChange={(e) => {
                          dispatch(
                            userSettingsActions.setUserSettingsDetails({
                              ...userSettingsDetails,
                              address: e.target.value,
                            })
                          );
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="label text-[14px] font-bold justify-between items-center flex gap-1">
                        Sex
                        <FaTransgender />
                      </label>
                      <select
                        className="input h-[2.5rem] input-sm  bg-gray-100 input-bordered w-full "
                        id="covid_status"
                        name="sex"
                        value={userSettingsDetails.sex}
                        onChange={(e) =>
                          dispatch(
                            userSettingsActions.setUserSettingsDetails({
                              ...userSettingsDetails,
                              sex: e.target.value,
                            })
                          )
                        }
                      >
                        {Object.values(EnumGender).map((value, index) => (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="label text-[14px] font-bold justify-between items-center flex gap-1">
                        Username
                        <BsFilePerson />
                      </label>
                      <input
                        name="username"
                        type="text"
                        placeholder="Choose a username"
                        className="input h-[2.5rem] input-sm  bg-gray-100 input-bordered input-black w-full"
                        value={userSettingsDetails.username}
                        onChange={(e) =>
                          dispatch(
                            userSettingsActions.setUserSettingsDetails({
                              ...userSettingsDetails,
                              username: e.target.value,
                            })
                          )
                        }
                      />
                    </div>
                    {fieldsError && (
                      <span className="text-[12px] text-center mt-4 text-red-500">
                        <span className="bg-red-100 rounded-md py-1 px-2">
                          {fieldsError}
                        </span>
                      </span>
                    )}
                    <div className="flex flex-col w-full border-opacity-50 pb-6">
                      <button
                        type="submit"
                        onClick={handleChangeUserDetails}
                        className="btn btn-primary btn-active:bg-accent w-full mt-6 mb-2"
                        disabled={isLoadingUpdateUser}
                      >
                        {isLoadingUpdateUser ? (
                          <>
                            <span className="loading loading-spinner loading-sm text-[#FFF]" />
                            Saving
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </>
                )}
                {settingsTab === EnumSettingsTab.CHANGE_PASSWORD && (
                  <>
                    <div className="my-4">
                      <label className="label text-[14px] font-bold justify-between items-center flex gap-1">
                        Old Password
                        <RiLockPasswordFill />
                      </label>
                      <div className="relative">
                        <input
                          required
                          name="oldPassword"
                          type={showOldPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="input h-[2.5rem] input-sm  bg-gray-100 input-bordered input-black w-full"
                          value={userSettingsDetails.oldPassword}
                          onChange={(e) =>
                            dispatch(
                              userSettingsActions.setUserSettingsDetails({
                                ...userSettingsDetails,
                                oldPassword: e.target.value,
                              })
                            )
                          }
                        />
                        <span
                          onClick={toggleOldPasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        >
                          {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="label text-[14px] font-bold justify-between items-center flex gap-1">
                        New Password
                        <RiLockPasswordFill />
                      </label>
                      <div className="relative">
                        <input
                          required
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="input h-[2.5rem] input-sm  bg-gray-100 input-bordered input-black w-full"
                          value={userSettingsDetails.newPassword}
                          onChange={(e) =>
                            dispatch(
                              userSettingsActions.setUserSettingsDetails({
                                ...userSettingsDetails,
                                newPassword: e.target.value,
                              })
                            )
                          }
                        />
                        <span
                          onClick={toggleNewPasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="label text-[14px] font-bold justify-between items-center flex gap-1">
                        Confirm New Password
                        <RiLockPasswordFill />
                      </label>
                      <div className="relative">
                        <input
                          required
                          name="confirmPassword"
                          type={showCPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="input h-[2.5rem] input-sm  bg-gray-100 input-bordered input-black w-full"
                          value={userSettingsDetails.confirmNewPassword}
                          onChange={(e) =>
                            dispatch(
                              userSettingsActions.setUserSettingsDetails({
                                ...userSettingsDetails,
                                confirmNewPassword: e.target.value,
                              })
                            )
                          }
                        />
                        <span
                          onClick={toggleCPasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        >
                          {showCPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>
                    {fieldsError && (
                      <span className="text-[12px] text-center mt-4 text-red-500">
                        <span className="bg-red-100 rounded-md py-1 px-2">
                          {fieldsError}
                        </span>
                      </span>
                    )}
                    <div className="flex flex-col w-full border-opacity-50">
                      <button
                        type="submit"
                        onClick={handleChangePassword}
                        className="btn btn-primary btn-active:bg-accent w-full my-6"
                        disabled={isLoadingChangePassword}
                      >
                        {isLoadingChangePassword ? (
                          <>
                            <span className="loading loading-spinner loading-sm text-[#FFF]" />
                            Saving
                          </>
                        ) : (
                          "Save "
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </Suspense>
        {showEmergencyModal && <EmergencyModal />}
        <AlertMessage />
      </div>
    );
  }
};

export default Settings;
