"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { EnumGender, IRoot } from "../redux/interfaces";
import { registrationActions } from "../redux/store";
import useRegister from "../hooks/api-hooks/useRegister";
import {
  BsCalendarWeekFill,
  BsFilePerson,
  BsFillPhoneFill,
} from "react-icons/bs";
import { FaMapLocationDot, FaTransgender } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

const RegistrationCard = () => {
  const { data, loading, error, registerUser } = useRegister();
  const [fieldsError, setFieldsError] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const registrationDetails = useSelector(
    (state: IRoot) => state.registration.registrationDetails
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleCPasswordVisibility = () => {
    setShowCPassword(!showCPassword);
  };

  const handleRegister = (e: any) => {
    e.preventDefault();
    if (
      !registrationDetails.first_name.length ||
      !registrationDetails.last_name.length ||
      !registrationDetails.birthday.length ||
      !registrationDetails.contact.length ||
      !registrationDetails.address.length ||
      !registrationDetails.sex.length ||
      !registrationDetails.email.length ||
      !registrationDetails.username.length ||
      !registrationDetails.password.length ||
      !registrationDetails.confirmPassword.length
    ) {
      setFieldsError("All fields are required");
      return;
    }
    if (registrationDetails.contact.length != 11) {
      setFieldsError("Input a valid contact number");
      return;
    }

    if (!registrationDetails.email.includes('@')) {
      setFieldsError("Input a valid email address");
      return;
    }

    if (registrationDetails.password.length < 6) {
      setFieldsError("Password must be more than 5 characters");
      return;
    }

    if (registrationDetails.password !== registrationDetails.confirmPassword) {
      setFieldsError("Password and Confirm must be equal");
      return;
    }
    setFieldsError("");
    registerUser();
  };

  return (
    <div className="card max-w-[90vw] w-96 bg-#fafafa text-black border-2 border-gray-100 shadow-md bg-white">
      <div className="card-body flex flex-col">
        <h5 className="text-center flex font-bold justify-center items-center text-primary">
          Registration
        </h5>
        {fieldsError && (
          <span className="text-[12px] text-center text-red-500">
            <span className="bg-red-100 rounded-md py-1 px-2">
              {fieldsError}
            </span>
          </span>
        )}
        <hr />
        <form>
          <div className="mb-4">
            <label className="label font-bold justify-between items-center flex gap-1">
              First Name
              <BsFilePerson />
            </label>
            <input
              name="first_name"
              type="text"
              placeholder="Enter your first name"
              className="input bg-gray-100 input-bordered input-black w-full"
              value={registrationDetails.first_name}
              onChange={(e) => {
                dispatch(
                  registrationActions.setRegistrationDetails({
                    ...registrationDetails,
                    first_name: e.target.value,
                  })
                );
              }}
            />
          </div>

          <div className="mb-4">
            <label className="label font-bold justify-between items-center flex gap-1">
              Last Name
              <BsFilePerson />
            </label>
            <input
              name="last_name"
              type="text"
              placeholder="Enter your last name"
              className="input bg-gray-100 input-bordered input-black w-full"
              value={registrationDetails.last_name}
              onChange={(e) => {
                dispatch(
                  registrationActions.setRegistrationDetails({
                    ...registrationDetails,
                    last_name: e.target.value,
                  })
                );
              }}
            />
          </div>

          <div className="mb-4">
            <label className="label font-bold justify-between items-center flex gap-1">
              Birthday
              <BsCalendarWeekFill />
            </label>
            <input
              name="birthday"
              type="date"
              placeholder="Select your birthday"
              className="input bg-gray-100 input-bordered input-black w-full"
              value={registrationDetails.birthday}
              onChange={(e) => {
                dispatch(
                  registrationActions.setRegistrationDetails({
                    ...registrationDetails,
                    birthday: e.target.value,
                  })
                );
              }}
            />
          </div>

          <div className="mb-4">
            <label className="label font-bold justify-between items-center flex gap-1">
              Contact Number
              <BsFillPhoneFill />
            </label>
            <input
              name="contact_num"
              type="tel"
              placeholder="09xxxxxxxxx"
              className="input bg-gray-100 input-bordered input-black w-full"
              value={registrationDetails.contact}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9]/g, "");

                dispatch(
                  registrationActions.setRegistrationDetails({
                    ...registrationDetails,
                    contact: numericValue,
                  })
                );
              }}
            />
          </div>

          <div className="mb-4">
            <label className="label font-bold justify-between items-center flex gap-1">
              Address
              <FaMapLocationDot />
            </label>
            <input
              name="address"
              type="text"
              placeholder="Enter your address"
              className="input bg-gray-100 input-bordered input-black w-full"
              value={registrationDetails.address}
              onChange={(e) => {
                dispatch(
                  registrationActions.setRegistrationDetails({
                    ...registrationDetails,
                    address: e.target.value,
                  })
                );
              }}
            />
          </div>

          <div className="mb-4">
            <label className="label font-bold justify-between items-center flex gap-1">
              Sex
              <FaTransgender />
            </label>
            <select
              className="input bg-gray-100 input-bordered w-full max-w-xs"
              id="covid_status"
              name="sex"
              value={registrationDetails.sex}
              onChange={(e) =>
                dispatch(
                  registrationActions.setRegistrationDetails({
                    ...registrationDetails,
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
          <div className="mb-4">
            <label className="label font-bold justify-between items-center flex gap-1">
              Email
              <MdEmail />
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="input bg-gray-100 input-bordered input-black w-full"
              value={registrationDetails.email}
              onChange={(e) =>
                dispatch(
                  registrationActions.setRegistrationDetails({
                    ...registrationDetails,
                    email: e.target.value,
                  })
                )
              }
            />
          </div>
          <div className="mb-4">
            <label className="label font-bold justify-between items-center flex gap-1">
              Username
              <BsFilePerson />
            </label>
            <input
              name="username"
              type="text"
              placeholder="Choose a username"
              className="input bg-gray-100 input-bordered input-black w-full"
              value={registrationDetails.username}
              onChange={(e) =>
                dispatch(
                  registrationActions.setRegistrationDetails({
                    ...registrationDetails,
                    username: e.target.value,
                  })
                )
              }
            />
          </div>

          <div className="mb-4">
            <label className="label font-bold justify-between items-center flex gap-1">
              Password
              <RiLockPasswordFill />
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="input bg-gray-100 input-bordered input-black w-full"
                value={registrationDetails.password}
                onChange={(e) =>
                  dispatch(
                    registrationActions.setRegistrationDetails({
                      ...registrationDetails,
                      password: e.target.value,
                    })
                  )
                }
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="label font-bold justify-between items-center flex gap-1">
              Confirm Password
              <RiLockPasswordFill />
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showCPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="input bg-gray-100 input-bordered input-black w-full"
                value={registrationDetails.confirmPassword}
                onChange={(e) =>
                  dispatch(
                    registrationActions.setRegistrationDetails({
                      ...registrationDetails,
                      confirmPassword: e.target.value,
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
            <span className="text-[12px] text-center text-red-500">
              <span className="bg-red-100 rounded-md py-1 px-2">
                {fieldsError}
              </span>
            </span>
          )}
          <div className="flex flex-col w-full border-opacity-50 pt-4">
            <button
              type="submit"
              onClick={handleRegister}
              className="btn btn-primary btn-active:bg-accent w-full mb-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm text-[#FFF]" />
                  Registering
                </>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationCard;
