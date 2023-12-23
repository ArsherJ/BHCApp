"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  alertMessageActions,
  appointmentModalActions,
} from "../../../redux/store";
import axios from "axios";
import { EnumAppointmentConfirmModal, IRoot } from "../../../redux/interfaces";
import { FaTimes } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import useUpdateSingleAppointment from "../../../hooks/api-hooks/appointmentAPI/useUpdateSingleAppointment";
import useUpdateBulkAppointments from "../../../hooks/api-hooks/appointmentAPI/useUpdateBulkAppointments";

const AppointmentConfirmModal = () => {
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const dispatch = useDispatch();
  const {
    data: updateSingleData,
    loading: isLoadingUpdateSingle,
    error: updateSingleError,
    updateSingleAppointment,
  } = useUpdateSingleAppointment();

  const {
    data: updateBulkData,
    loading: isLoadingUpdateBulk,
    error: updateBulkError,
    updateBulkAppointments,
  } = useUpdateBulkAppointments();

  const confirmModalType = useSelector(
    (state: IRoot) => state.appointmentModal.confirmModalType
  );
  const selectedAppointmentRows = useSelector(
    (state: IRoot) => state.appointmentModal.selectedAppointmentRows
  );
  const appointmentConfirmationDetails = useSelector(
    (state: IRoot) => state.appointmentModal.appointmentConfirmationDetails
  );
  const { id } = appointmentConfirmationDetails;
  // const {name, } = appointmentDetails

  const handleSingleAccept = (event: any) => {
    event.preventDefault();

    updateSingleAppointment({ id: id, status: 1 });
  };

  const handleSingleReject = (event: any) => {
    event.preventDefault();

    updateSingleAppointment({ id: id, status: 0 });
  };
  const handleBulkAccept = (event: any) => {
    event.preventDefault();

    updateBulkAppointments({ selectedAppointmentRows, status: 1 });
  };
  const handleBulkReject = (event: any) => {
    event.preventDefault();

    updateBulkAppointments({ selectedAppointmentRows, status: 0 });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
      <div
        className="absolute inset-0 bg-black backdrop-blur-lg opacity-40"
        onClick={() =>
          dispatch(appointmentModalActions.toggleConfirmationModal())
        }
      />
      <div
        className="card shadow-lg w-[30%]  max-h-[100vh] flex text-black border-2 border-primary bg-[#ffffff] xl:min-w-[30vw] lg:[50vw] md:min-w-[65vw] sm:min-w-[80vw] min-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header justify-between flex flex-row items-center px-5 py-3">
          <h5 className=" text-center items-center gap-2 flex font-bold justify-center text-black">
            <FaUserDoctor className="mr-1" size={20} />
            {confirmModalType === EnumAppointmentConfirmModal.ACCEPT
              ? "Accept Appointment"
              : confirmModalType === EnumAppointmentConfirmModal.REJECT
              ? "Reject Appointment"
              : confirmModalType === EnumAppointmentConfirmModal.BULK_ACCEPT
              ? "Bulk Accept"
              : confirmModalType === EnumAppointmentConfirmModal.BULK_REJECT
              ? "Bulk Reject"
              : ""}
          </h5>
          <button
            className="hover:text-primary duration-75 hover:scale-150"
            onClick={() => {
              dispatch(appointmentModalActions.toggleConfirmationModal());
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <hr />
        <div className="card-body flex flex-col overflow-y-scroll max-h-[80vh] justify-center items-stretch py-5 px-5 ">
          <div className="text-center pt-2">
            <h5>
              {confirmModalType === EnumAppointmentConfirmModal.ACCEPT
                ? "Are you sure you want to accept this appointment?"
                : confirmModalType === EnumAppointmentConfirmModal.REJECT
                ? "Are you sure you want to reject this appointment?"
                : confirmModalType === EnumAppointmentConfirmModal.BULK_ACCEPT
                ? "Are you sure you want to bulk accept these appointments?"
                : confirmModalType === EnumAppointmentConfirmModal.BULK_REJECT
                ? "Are you sure you want to bulk reject these appointments?"
                : ""}
            </h5>
          </div>
        </div>
        <hr />
        <div className="card-footer px-5 py-3">
          <div className="flex flex-col md:flex-row justify-end items-stretch gap-3">
            <button
              className="btn btn-danger btn-md justify-between flex"
              onClick={() => {
                dispatch(appointmentModalActions.toggleConfirmationModal());
                dispatch(appointmentModalActions.clearAppointmentDetails());
              }}
            >
              Cancel
            </button>
            {/* SINGLE ACCEPT */}
            {confirmModalType === EnumAppointmentConfirmModal.ACCEPT ? (
              <button
                className="btn btn-primary btn-md justify-between flex"
                onClick={handleSingleAccept}
                disabled={isLoadingUpdateSingle}
              >
                {isLoadingUpdateSingle ? (
                  <>
                    <span className="loading loading-spinner loading-sm text-[#FFF]" />
                    Accepting
                  </>
                ) : (
                  "Accept"
                )}
              </button>
            ) : // SINGLE REJECT
            confirmModalType === EnumAppointmentConfirmModal.REJECT ? (
              <button
                className="btn btn-primary btn-md justify-between flex"
                onClick={handleSingleReject}
                disabled={isLoadingUpdateSingle}
              >
                {isLoadingUpdateSingle ? (
                  <>
                    <span className="loading loading-spinner loading-sm text-[#FFF]" />
                    Rejecting
                  </>
                ) : (
                  "Reject"
                )}
              </button>
            ) : // BULK ACCEPT
            confirmModalType === EnumAppointmentConfirmModal.BULK_ACCEPT ? (
              <button
                className="btn btn-primary btn-md justify-between flex"
                onClick={handleBulkAccept}
                disabled={isLoadingUpdateBulk}
              >
                {isLoadingUpdateBulk ? (
                  <>
                    <span className="loading loading-spinner loading-sm text-[#FFF]" />
                    Accepting
                  </>
                ) : (
                  "Accept"
                )}
              </button>
            ) : // BULK REJECT
            confirmModalType === EnumAppointmentConfirmModal.BULK_REJECT ? (
              <button
                className="btn btn-primary btn-md justify-between flex"
                onClick={handleBulkReject}
                disabled={isLoadingUpdateBulk}
              >
                {isLoadingUpdateBulk ? (
                  <>
                    <span className="loading loading-spinner loading-sm text-[#FFF]" />
                    Rejecting
                  </>
                ) : (
                  "Reject"
                )}
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmModal;
