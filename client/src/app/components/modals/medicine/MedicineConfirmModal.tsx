"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  alertMessageActions,
  doctorModalActions,
  medicineModalActions,
} from "../../../redux/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { EnumAlerts, EnumDoctorStatus, IRoot } from "../../../redux/interfaces";
import { FaTimes } from "react-icons/fa";
import dayjs from "dayjs";
import AlertMessage from "../../AlertMessage";
import { FaUserDoctor } from "react-icons/fa6";
import Image from "next/image";
import { GiMedicinePills } from "react-icons/gi";
import useDeleteMedicine from "../../../hooks/api-hooks/medicineAPI/useDeleteMedicine";

const MedicineConfirmationModal = () => {
  const {
    loading: isLoadingDeleteMedicine,
    deleteMedicine,
  } = useDeleteMedicine();
  const dispatch = useDispatch();
  const medicineDetails = useSelector(
    (state: IRoot) => state.medicineModal.medicineDetails
  );

  const { id, image, medicine, dosage, type, quantity } =
    medicineDetails;

  const handleConfirm = (event: any) => {
    event.preventDefault();
    deleteMedicine()
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
      <div
        className="absolute inset-0 bg-black backdrop-blur-lg opacity-40"
        onClick={() => {
          dispatch(medicineModalActions.toggleMedicineConfirmationModal());
          dispatch(medicineModalActions.clearMedicineDetails());
        }}
      />
      <div
        className="card shadow-lg w-[30%]  max-h-[100vh] flex text-black border-2 border-primary bg-[#ffffff] xl:min-w-[30vw] lg:[50vw] md:min-w-[65vw] sm:min-w-[80vw] min-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header justify-between flex flex-row items-center px-5 py-3">
          <h3 className="card-title text-center flex font-bold justify-center text-black">
            <GiMedicinePills className="mr-1" size={20} />
            Delete Medicine
          </h3>
          <button
            className="hover:text-primary duration-75 hover:scale-150"
            onClick={() => {
              dispatch(medicineModalActions.toggleMedicineConfirmationModal());
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <hr />
        <div className="card-body flex flex-col overflow-y-scroll max-h-[80vh] justify-center items-stretch py-5 px-5 ">
          <div className="w-full flex flex-col justify-center mask mask-circle py-4 items-center">
            <Image
              src={image || "/medicine.jpeg"}
              alt="Selected Profile"
              width={300}
              height={300}
            />
          </div>
          <div className="text-start bg-gray-100 capitalize flex flex-col justify-center items-start px-[20%] border-x-[10px] border-primary">
            <h6>medicine:{medicine}</h6>
            <h6>dosage: {dosage}</h6>
            <h6>medicine type: {type}</h6>
            <h6>quantity: {quantity}</h6>
          </div>
          <div className="text-center pt-2">
            <h6>Are you sure you want to delete this Medicine?</h6>
          </div>
        </div>
        <hr />
        <div className="card-footer px-5 py-3">
          <div className="flex flex-col md:flex-row justify-end items-stretch gap-3">
            <button
              className="btn btn-danger btn-md justify-between flex"
              onClick={() => {
                dispatch(
                  medicineModalActions.toggleMedicineConfirmationModal()
                );
                dispatch(medicineModalActions.clearMedicineDetails());
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary btn-md justify-between flex"
              onClick={handleConfirm}
              disabled={isLoadingDeleteMedicine}
            >
              {isLoadingDeleteMedicine ? (
                <>
                  <span className="loading loading-spinner loading-sm text-[#FFF]" />
                  Deleting
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineConfirmationModal;
