"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  alertMessageActions,
  appointmentModalActions,
} from "../../../redux/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  EnumAlerts,
  EnumAppointmentReason,
  EnumAppointmentTime,
  IRoot,
} from "../../../redux/interfaces";
import { BsFillCalendarPlusFill } from "react-icons/bs";
import { FaInfoCircle, FaTimes } from "react-icons/fa";
import dayjs from "dayjs";
import Datepicker, {
  DateType,
  DateValueType,
} from "react-tailwindcss-datepicker";
import useRequestAppointment from "../../../hooks/api-hooks/appointmentAPI/useRequestAppointment";
import AlertMessage from "../../AlertMessage";

const AppointmentModal = () => {
  var dateNow = dayjs();
  const router = useRouter();
  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );
  const appointmentDetails = useSelector(
    (state: IRoot) => state.appointmentModal.appointmentDetails
  );
  const { appointmentTime, appointmentDateValue, appointmentReason } =
    appointmentDetails;
  const dispatch = useDispatch();

  // const combinedData = { userDetails, appointmentDetails };
  const {
    data,
    loading: isLoadingRequest,
    error,
    requestAppointments,
  } = useRequestAppointment({ userDetails, appointmentDetails });

  const [fieldsError, setFieldsError] = useState("");

  const handleSubmitAppointment = (event: any) => {
    event.preventDefault();
    if (!appointmentDateValue.startDate) {
      setFieldsError("Please input date");
      return;
    }
    setFieldsError("");
    requestAppointments();
  };

  const handleDateChange = (date: DateValueType) => {
    dispatch(
      appointmentModalActions.setAppointmentDetails({
        ...appointmentDetails,
        appointmentDateValue: date,
      })
    );
  };
  const endDate = dayjs().add(7, "day").format("YYYY-MM-DD");

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
      <div
        className="absolute inset-0 bg-black backdrop-blur-lg opacity-40"
        onClick={() =>
          dispatch(appointmentModalActions.toggleAppointmentModal())
        }
      />
      <div
        className="card shadow-lg w-[30%]  max-h-[90vh] flex text-black border-2 border-primary bg-[#ffffff] lg:min-w-[50vw] md:min-w-[65vw] sm:min-w-[80vw] min-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header justify-between flex flex-row items-center px-5 py-4">
          <h1 className="card-title text-center flex font-bold justify-center text-black">
            <BsFillCalendarPlusFill className="mr-1" size={20} />
            Schedule Appointment
            <label className="label flex flex-row gap-2 justify-start">
              <div
                className="tooltip tooltip-bottom rounded-lg"
                data-tip="Send a request appointment for approval"
              >
                <FaInfoCircle />
              </div>
            </label>
          </h1>
          <button
            className="hover:text-primary duration-75 hover:scale-150"
            onClick={() => {
              dispatch(appointmentModalActions.toggleAppointmentModal());
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <hr />
        <form>
          <div className="card-body flex flex-col justify-center items-stretch py-5 px-5 ">
            <div className="form-control w-full max-w-xs flex-col flex min-w-full">
              <div className="relative">
                <div className="flex justify-between">
                  <label className="label font-bold ">Date</label>
                  {fieldsError && (
                    <span className="text-[12px] text-center mt-3 text-red-500">
                      <span className="bg-red-100 rounded-md py-1 px-2">
                        {fieldsError}
                      </span>
                    </span>
                  )}
                </div>
                <Datepicker
                  displayFormat={"YYYY/MM/DD"}
                  startFrom={new Date()}
                  minDate={new Date()}
                  primaryColor={"lime"}
                  asSingle={true}
                  value={appointmentDateValue}
                  onChange={handleDateChange}
                  showShortcuts={true}
                  configs={{
                    shortcuts: {
                      today: {
                        text: "Today",
                        period: {
                          start: dayjs().format("YYYY-MM-DD"),
                          end: dayjs().format("YYYY-MM-DD"),
                        },
                      },
                      next7Days: {
                        text: "Next 7 days",
                        period: {
                          start: endDate,
                          end: endDate,
                        },
                      },
                    },
                  }}
                />
              </div>
              <label className="label flex flex-row gap-2 justify-start">
                <span className="label-text font-bold text-[16px]">Time</span>
              </label>
              <select
                placeholder="Set Appointment Time"
                required
                className="input input-bordered min-w-full"
                value={appointmentTime}
                onChange={(e) => {
                  dispatch(
                    appointmentModalActions.setAppointmentDetails({
                      ...appointmentDetails,
                      appointmentTime: e.target.value,
                    })
                  );
                }}
                style={{ paddingRight: "30px" }} // Add padding to the right
              >
                {Object.values(EnumAppointmentTime).map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </select>

              <label className="label font-bold ">Reason</label>
              <select
                value={appointmentReason}
                required
                className="input input-bordered input-black w-full mr-4"
                onChange={(e) => {
                  dispatch(
                    appointmentModalActions.setAppointmentDetails({
                      ...appointmentDetails,
                      appointmentReason: e.target.value,
                    })
                  );
                }}
              >
                {Object.values(EnumAppointmentReason).map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr />
          <div className="card-footer px-5 py-4">
            <div className="flex flex-col md:flex-row justify-end items-stretch gap-3">
              <button
                className="btn btn-danger justify-between flex"
                onClick={() => {
                  dispatch(appointmentModalActions.clearAppointmentDetails());
                  dispatch(appointmentModalActions.toggleAppointmentModal());
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary justify-between flex"
                onClick={handleSubmitAppointment}
                disabled={isLoadingRequest}
              >
                {isLoadingRequest ? (
                  <>
                    <span className="loading loading-spinner loading-sm text-[#FFF]" />
                    Sending
                  </>
                ) : (
                  "Send Request"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
