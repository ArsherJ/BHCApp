import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  emergencyModalActions,
  viewEmergencyModalActions,
} from "../../redux/store";
import { FaTimes, FaInfoCircle, FaWalking } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { AiFillSound } from "react-icons/ai";
import { RiAlarmWarningFill, RiMailSendFill } from "react-icons/ri";
import { GiStonePath } from "react-icons/gi";
import { IRoot } from "../../redux/interfaces";
import axios from "axios";
import useSendEmergency from "../../hooks/api-hooks/emergencyAPI/useSendEmergency";
import { isURL } from "../../utilities/dataHelper";

const ViewEmergencyModal = () => {
  const dispatch = useDispatch();
  const viewEmergencyDetails = useSelector(
    (state: IRoot) => state.viewEmergencyModal.viewEmergencyDetails
  );
  const { location, created_date, message, sender_email, subject } =
    viewEmergencyDetails;
  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
      <div
        className="absolute inset-0 bg-black backdrop-blur-lg opacity-40"
        onClick={() => {
          dispatch(viewEmergencyModalActions.toggleViewEmergencyModal());
        }}
      />
      <div
        className="card shadow-lg w-[30%]  max-h-[90vh] overflow-y-scroll flex text-black border-2 border-primary bg-[#ffffff] lg:min-w-[50vw] md:min-w-[65vw] sm:min-w-[80vw] min-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header justify-between flex flex-row items-center px-5 py-4">
          <h1 className="card-title text-center flex font-bold justify-center text-black">
            <RiAlarmWarningFill className="mr-1" size={20} />
            Emergency Report
          </h1>

          <button
            className="hover:text-primary duration-75 hover:scale-150"
            onClick={() => {
              dispatch(viewEmergencyModalActions.toggleViewEmergencyModal());
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <hr />
        <form>
          <div className="card-body flex flex-col justify-center items-stretch py-5 px-5 ">
            <div className="form-control w-full max-w-xs flex-col flex min-w-full">
              <span className="label-text font-bold text-[16px]">Location</span>
              <iframe
                      width="300"
                      height="80"
                      src={"https://www.google.com/maps?q=14.3905818,121.0031281"}
                      title="Google Map"
                    />
              {
                /* MapView */
                isURL(location) ? (
                  <div className="flex justify-center items-center my-2">
                    <iframe
                      width="300"
                      height="80"
                      src={location}
                      title="Google Map"
                    />
                  </div>
                ) : (
                  <p>{location}</p>
                )
              }
              <label className="label flex flex-row gap-2 justify-start">
                <span className="label-text font-bold text-[16px]">
                  Sender
                </span>
                <span className="label-text text-[16px]">{sender_email}</span>
              </label>
              <label className="label flex flex-row gap-2 justify-start">
                <span className="label-text font-bold text-[16px]">
                  Subject
                </span>
                <span className="label-text text-[16px]">{subject}</span>
              </label>
              <label className="label flex flex-row gap-2 justify-start">
                <span className="label-text font-bold text-[16px]">
                  Message
                </span>
                <span className="label-text text-[16px]">{message}</span>
              </label>
            </div>
            <hr/>

          </div>
          <hr />
          <div>
          <label className="label flex flex-row gap-2 items-center justify-end px-4 text-gray-200 opacity-70">
                <span className="label-text font-bold text-[12px]">
                  Date: 
                </span>
                <span className="label-text text-[12px]">{created_date}</span>
              </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewEmergencyModal;
