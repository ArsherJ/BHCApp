"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  alertMessageActions,
  doctorModalActions,
  medicineModalActions,
  medicineQuantityModalActions,
} from "../../../redux/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  EnumAlerts,
  EnumDoctorStatus,
  EnumMedicineQuantityModalType,
  IRoot,
} from "../../../redux/interfaces";
import { FaTimes } from "react-icons/fa";
import dayjs from "dayjs";
import AlertMessage from "../../AlertMessage";
import { FaUserDoctor } from "react-icons/fa6";
import Image from "next/image";
import { GiMedicinePills } from "react-icons/gi";
import useUpdateQuantityMedicine from "@/app/hooks/api-hooks/medicineAPI/useUpdateQuantityMedicine";

const MedicineQuantitynModal = () => {
  const { loading: isLoadingUpdateMedicine, updateQuantityMedicine } =
    useUpdateQuantityMedicine();
  const dispatch = useDispatch();

  const medicineQuantityDetails = useSelector(
    (state: IRoot) => state.medicineQuantityModal.medicineDetails
  );

  const medicineDetails = useSelector(
    (state: IRoot) => state.medicineModal.medicineDetails
  );

  const medicineQuantityModalType = useSelector(
    (state: IRoot) => state.medicineQuantityModal.medicineQuantityModalType
  );

  const editQuantity = useSelector(
    (state: IRoot) => state.medicineQuantityModal.editQuantity
  );

  const { id, image, medicine, dosage, type, quantity } =
    medicineQuantityDetails;
  const [fieldsError, setFieldsError] = useState("");

  const handleConfirm = (event: any) => {
    event.preventDefault();

    if (editQuantity === 0) {
      setFieldsError("Please Input Quantity");
      return;
    }

    if (
      medicineQuantityModalType === EnumMedicineQuantityModalType.DECREASE &&
      editQuantity > quantity
    ) {
      setFieldsError("Error: Decrease value cant be higher than the current value");
      return;
    }

    updateQuantityMedicine();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
      <div
        className="absolute inset-0 bg-black backdrop-blur-lg opacity-40"
        onClick={() => {
          dispatch(medicineQuantityModalActions.toggleMedicineQuantityModal());
          dispatch(medicineQuantityModalActions.clearMedicineDetails());
          dispatch(medicineQuantityModalActions.setEditQuantity(0));
        }}
      />
      <div
        className="card shadow-lg w-[30%]  max-h-[100vh] flex text-black border-2 border-primary bg-[#ffffff] xl:min-w-[30vw] lg:[50vw] md:min-w-[65vw] sm:min-w-[80vw] min-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header justify-between flex flex-row items-center px-5 py-3">
          <span className="card-title text-[16px] text-center flex font-bold justify-center text-black">
            <GiMedicinePills className="mr-1" size={20} />
            {medicineQuantityModalType ===
              EnumMedicineQuantityModalType.INCREASE && "Increase "}
            {medicineQuantityModalType ===
              EnumMedicineQuantityModalType.DECREASE && "Decrease "}
            {medicine}&apos;s Quantity
          </span>
          <button
            className="hover:text-primary duration-75 hover:scale-150"
            onClick={() => {
              dispatch(
                medicineQuantityModalActions.toggleMedicineQuantityModal()
              );
              dispatch(medicineQuantityModalActions.setEditQuantity(0));
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <hr />
        <div className="card-body flex flex-col overflow-y-scroll max-h-[80vh] justify-center items-stretch py-5 px-5 ">
          <div className="text-start bg-gray-100 capitalize flex flex-col justify-center items-center px-[20%] border-x-[10px] border-primary">
            <div className="w-full flex flex-col justify-center p-1 items-center">
              <Image
                src={medicineQuantityDetails.image || "/medicine.jpeg"}
                alt="Selected Image"
                width={150}
                height={150}
              />
            </div>
            <span className=" font-extrabold text-[22px] justify-center items-center">
              {medicine}
            </span>
            <h6>Current Quantity: {quantity}</h6>
          </div>
          {fieldsError && (
            <span className="text-[12px] mt-4 text-center text-red-500">
              <span className="bg-red-100 rounded-md py-1 px-2">
                {fieldsError}
              </span>
            </span>
          )}
          <div>
            <label
              htmlFor="quantityInput"
              className="label flex flex-row gap-2 justify-center"
            >
              <span className="label-text text-center font-bold text-[14px]">
                {medicineQuantityModalType ===
                  EnumMedicineQuantityModalType.INCREASE && "Increase "}
                {medicineQuantityModalType ===
                  EnumMedicineQuantityModalType.DECREASE && "Decrease "}{" "}
                Quantity By
              </span>
            </label>
            <input
              type="text"
              id="quantityInput"
              value={editQuantity}
              className="input input-bordered input-sm w-full max-w-full"
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9]/g, "");
                dispatch(
                  medicineQuantityModalActions.setEditQuantity(+numericValue)
                );
              }}
            />
          </div>
        </div>
        <hr />
        <div className="card-footer px-5 py-3">
          <div className="flex flex-col md:flex-row justify-end items-stretch gap-3">
            <button
              className="btn btn-danger btn-md justify-between flex"
              onClick={() => {
                dispatch(
                  medicineQuantityModalActions.toggleMedicineQuantityModal()
                );
                dispatch(medicineQuantityModalActions.clearMedicineDetails());
                dispatch(medicineQuantityModalActions.setEditQuantity(0));
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary btn-md justify-between flex"
              onClick={handleConfirm}
              disabled={isLoadingUpdateMedicine}
            >
              {isLoadingUpdateMedicine ? (
                <>
                  <span className="loading loading-spinner loading-sm text-[#FFF]" />
                  {medicineQuantityModalType ===
                    EnumMedicineQuantityModalType.INCREASE && "Increasing "}
                  {medicineQuantityModalType ===
                    EnumMedicineQuantityModalType.DECREASE && "Decreasing "}
                </>
              ) : (
                <>
                  {medicineQuantityModalType ===
                    EnumMedicineQuantityModalType.INCREASE && "Increase "}
                  {medicineQuantityModalType ===
                    EnumMedicineQuantityModalType.DECREASE && "Decrease "}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineQuantitynModal;
