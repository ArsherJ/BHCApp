import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { emergencyModalActions } from "../../redux/store";
import { FaTimes, FaInfoCircle, FaWalking } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { AiFillSound } from "react-icons/ai";
import { RiMailSendFill } from "react-icons/ri";
import { GiStonePath } from "react-icons/gi";
import { IRoot } from "../../redux/interfaces";
import axios from "axios";
import useSendEmergency from "../../hooks/api-hooks/emergencyAPI/useSendEmergency";

const EmergencyModal = () => {
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] =
    useState<boolean>(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(false);
  const {
    data,
    loading: isLoadingSendEmergency,
    error,
    sendEmergency,
  } = useSendEmergency();
  const dispatch = useDispatch();
  const emergencyDetails = useSelector(
    (state: IRoot) => state.emergencyModal.emergencyDetails
  );
  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );

  const { emergencyLocation, emergencySubject, emergencyMessage } =
    emergencyDetails;

  const handleAddressClick = (event: any) => {
    event.preventDefault();
    setIsLoadingAddress(true);
    dispatch(
      emergencyModalActions.setEmergencyDetails({
        ...emergencyDetails,
        emergencyLocation: userDetails.address,
      })
    );
    setIsLoadingAddress(false);
  };

  const handleYourLocationClick = (event: any) => {
    event.preventDefault();
    setIsLoadingCurrentLocation(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(
            emergencyModalActions.setEmergencyDetails({
              ...emergencyDetails,
              emergencyLocation: `https://www.google.com/maps?q=${latitude},${longitude}`,
            })
          );
          setIsLoadingCurrentLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingCurrentLocation(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser.");
      setIsLoadingCurrentLocation(false);
    }
  };

  const handleSubmitEmergency = (event: any) => {
    event.preventDefault();
    // SEND EMAIL
    sendEmergency();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
      <div
        className="absolute inset-0 bg-black backdrop-blur-lg opacity-40"
        onClick={() => {
          dispatch(emergencyModalActions.toggleEmergencyModal());
          dispatch(emergencyModalActions.clearEmergencyDetails());
        }}
      />
      <div
        className="card shadow-lg w-[30%]  max-h-[90vh] overflow-y-scroll flex text-black border-2 border-primary bg-[#ffffff] lg:min-w-[50vw] md:min-w-[65vw] sm:min-w-[80vw] min-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header justify-between flex flex-row items-center px-5 py-4">
          <h1 className="card-title text-center flex font-bold justify-center text-black">
            <AiFillSound className="mr-1" size={20} />
            Emergency
            <label className="label flex flex-row gap-2 justify-start">
              <div
                className="tooltip tooltip-bottom rounded-lg"
                data-tip="Sends an email to the health center for immediate action"
              >
                <FaInfoCircle />
              </div>
            </label>
          </h1>

          <button
            className="hover:text-primary duration-75 hover:scale-150"
            onClick={() => {
              dispatch(emergencyModalActions.clearEmergencyDetails());

              dispatch(emergencyModalActions.toggleEmergencyModal());
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <hr />
        <form>
          <div className="card-body flex flex-col justify-center items-stretch py-5 px-5 ">
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
              <button
                className="btn btn-primary flex-1 flex flex-row text-[15px]"
                onClick={handleYourLocationClick}
              >
                <FaLocationDot />
                Current Location
              </button>
              <button
                onClick={handleAddressClick}
                className="btn btn-secondary flex-1 text-[18px]"
              >
                <FaWalking />
                Address
              </button>
            </div>
            <div className="form-control w-full max-w-xs flex-col flex min-w-full">
              <label className="label flex flex-row gap-2 justify-start">
                <span className="label-text font-bold ">Location</span>
                <div
                  className="tooltip tooltip-right rounded-lg"
                  data-tip="Click current address or location or input manually"
                >
                  <FaInfoCircle />
                </div>
              </label>
              {/* MapView */}
              {/* <div className="flex justify-center items-center my-2">
                <iframe
                  width="300"
                  height="80"
                  src="https://www.google.com/maps?q=14.3907151,121.0032199&output=embed"
                  title="Google Map"
                />
              </div> */}

              <div className="relative">
                <input
                  type="text"
                  placeholder="Emergency Location"
                  className="input input-bordered min-w-full"
                  value={emergencyLocation}
                  onChange={(e) => {
                    dispatch(
                      emergencyModalActions.setEmergencyDetails({
                        ...emergencyDetails,
                        emergencyLocation: e.target.value,
                      })
                    );
                  }}
                />
                {isLoadingCurrentLocation && (
                  <span
                    className={`absolute right-4 top-1/4 loading loading-spinner loading-md text-primary`}
                  />
                )}
                {isLoadingAddress && (
                  <span
                    className={`absolute right-4 top-1/4 loading loading-spinner loading-md text-secondary`}
                  />
                )}
              </div>

              <label className="label flex flex-row gap-2 justify-start">
                <span className="label-text font-bold text-[16px]">
                  Subject
                </span>
              </label>
              <input
                type="text"
                placeholder="Subject of Emergency"
                className="input input-bordered min-w-full"
                value={emergencySubject}
                onChange={(e) => {
                  dispatch(
                    emergencyModalActions.setEmergencyDetails({
                      ...emergencyDetails,
                      emergencySubject: e.target.value,
                    })
                  );
                }}
              />
              <label className="label flex flex-row gap-2 justify-start">
                <span className="label-text font-bold text-[16px]">
                  Message
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered min-w-full"
                placeholder="Write brief description of the emergency"
                value={emergencyMessage}
                onChange={(e) => {
                  dispatch(
                    emergencyModalActions.setEmergencyDetails({
                      ...emergencyDetails,
                      emergencyMessage: e.target.value,
                    })
                  );
                }}
              />
            </div>
          </div>
          <hr />
          <div className="card-footer px-5 py-4">
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-3">
              <button
                className="btn bg-[#fc2929] hover:bg-[#fc2929] text-white flex-1 justify-between flex"
                onClick={handleSubmitEmergency}
                disabled={isLoadingSendEmergency}
              >
                {isLoadingSendEmergency ? (
                  <>
                    <span className="loading loading-spinner loading-sm text-[#FFF]" />
                    Sending
                    <RiMailSendFill className="mr-1" size={20} />
                  </>
                ) : (
                  <>
                    <AiFillSound className="mr-1" size={20} />
                    Send Emergency
                    <RiMailSendFill className="mr-1" size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmergencyModal;
