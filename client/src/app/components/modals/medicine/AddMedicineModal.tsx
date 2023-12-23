"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { medicineModalActions } from "../../../redux/store";
import { EnumMedicineModalType, IRoot } from "../../../redux/interfaces";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import { AiFillMedicineBox } from "react-icons/ai";
import useAddMedicine from "../../../hooks/api-hooks/medicineAPI/useAddMedicine";
import useUpdateMedicine from "../../../hooks/api-hooks/medicineAPI/useUpdateMedicine";

const AddMedicineModal = () => {
  const dispatch = useDispatch();
  const { loading: isLoadingAddMedicine, addMedicine } = useAddMedicine();
  const { loading: isLoadingUpdateMedicine, updateMedicine } =
    useUpdateMedicine();
  const medicineDetails = useSelector(
    (state: IRoot) => state.medicineModal.medicineDetails
  );
  const modalType = useSelector(
    (state: IRoot) => state.medicineModal.medicineModalType
  );
  const [fieldsError, setFieldsError] = useState("");

  const handleSubmitInventory = (e: any) => {
    e.preventDefault();

    // Check for required fields
    if (
      !medicineDetails.medicine ||
      !medicineDetails.dosage ||
      !medicineDetails.type 
    ) {
      setFieldsError("All fields are required");
      return;
    }

    setFieldsError("");

    if (modalType === EnumMedicineModalType.ADD) {
      addMedicine();
    }
    if (modalType === EnumMedicineModalType.UPDATE) {
      updateMedicine();
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
      <div
        className="absolute inset-0 bg-black backdrop-blur-lg opacity-40"
        onClick={() => dispatch(medicineModalActions.toggleMedicineModal())}
      />
      <div
        className="card shadow-lg w-[30%]  max-h-[100vh] flex text-black border-2 border-primary bg-[#ffffff] xl:min-w-[30vw] lg:[50vw] md:min-w-[65vw] sm:min-w-[80vw] min-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header justify-between flex flex-row items-center px-5 py-3">
          <h3 className="card-title text-center flex font-bold justify-center text-black">
            <AiFillMedicineBox className="mr-1" size={20} />
            {modalType === EnumMedicineModalType.ADD
              ? "Add New Medicine"
              : modalType === EnumMedicineModalType.UPDATE
              ? "Update Medicine Details"
              : ""}
          </h3>
          <button
            className="hover:text-primary duration-75 hover:scale-150"
            onClick={() => {
              dispatch(medicineModalActions.toggleMedicineModal());
              dispatch(medicineModalActions.clearMedicineDetails());
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <hr />
        <form>
          <div className="card-body flex flex-col overflow-y-scroll max-h-[80vh] justify-center items-stretch py-5 px-5 ">
            <div className="form-control w-full max-w-xs flex-col flex min-w-full">
              <div className="w-full flex flex-col justify-center p-1 items-center">
                <Image
                  src={medicineDetails.image || "/medicine.jpeg"}
                  alt="Selected Image"
                  width={150}
                  height={150}
                />
              </div>
              <div>
                <label
                  htmlFor="imageInput"
                  className="label flex flex-row gap-2 justify-start"
                >
                  <span className="label-text font-bold text-[14px]">
                    Choose Medicine Image <span className="text-[12px] text-primary"> - jpg, jpeg, png file</span>
                  </span>
                </label>
                <input
                  type="file"
                  id="imageInput"
                  className="file-input file-input-sm file-input-bordered file-input-primary w-full max-w-full"
                  onChange={(e) => {
                    const selectedFile = e.target.files![0];
                    if (selectedFile) {
                      const displayImage = URL.createObjectURL(selectedFile);
                      dispatch(
                        medicineModalActions.setMedicineDetails({
                          ...medicineDetails,
                          image: displayImage,
                        })
                      );
                    }
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="nameInput"
                  className="label flex flex-row gap-2 justify-start"
                >
                  <span className="label-text font-bold text-[14px] ">
                    Medicine Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Medicine Name"
                  id="nameInput"
                  value={medicineDetails.medicine}
                  className="input input-bordered input-sm w-full max-w-full"
                  onChange={(e) => {
                    dispatch(
                      medicineModalActions.setMedicineDetails({
                        ...medicineDetails,
                        medicine: e.target.value,
                      })
                    );
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="dosageInput"
                  className="label flex flex-row gap-2 justify-start"
                >
                  <span className="label-text font-bold text-[14px]">
                    Dosage
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter medicine dosage"
                  id="dosageInput"
                  value={medicineDetails.dosage}
                  className="input input-bordered input-sm w-full max-w-full"
                  onChange={(e) => {
                    dispatch(
                      medicineModalActions.setMedicineDetails({
                        ...medicineDetails,
                        dosage: e.target.value,
                      })
                    );
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="typeInput"
                  className="label flex flex-row gap-2 justify-start"
                >
                  <span className="label-text font-bold text-[14px]">
                    Medicine Type
                  </span>
                </label>
                <input
                  type="text"
                  id="typeInput"
                  placeholder="Enter medicine type"
                  value={medicineDetails.type}
                  className="input input-bordered input-sm w-full max-w-full"
                  onChange={(e) => {
                    dispatch(
                      medicineModalActions.setMedicineDetails({
                        ...medicineDetails,
                        type: e.target.value,
                      })
                    );
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="quantityInput"
                  className="label flex flex-row gap-2 justify-start"
                >
                  <span className="label-text font-bold text-[14px]">
                    Quantity
                  </span>
                </label>
                <input
                  type="text"
                  id="quantityInput"
                  value={medicineDetails.quantity}
                  className="input input-bordered input-sm w-full max-w-full"
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");

                    dispatch(
                      medicineModalActions.setMedicineDetails({
                        ...medicineDetails,
                        quantity: +numericValue,
                      })
                    );
                  }}
                />
              </div>
              {fieldsError && (
                <span className="text-[12px] mt-4 text-center text-red-500">
                  <span className="bg-red-100 rounded-md py-1 px-2">
                    {fieldsError}
                  </span>
                </span>
              )}
            </div>
          </div>
          <hr />
          <div className="card-footer px-5 py-3">
            <div className="flex flex-col md:flex-row justify-end items-stretch gap-3">
              <button
                className="btn btn-danger btn-md justify-between flex"
                onClick={() => {
                  dispatch(medicineModalActions.toggleMedicineModal());
                  dispatch(medicineModalActions.clearMedicineDetails());
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-md justify-between flex"
                onClick={handleSubmitInventory}
                disabled={isLoadingAddMedicine || isLoadingUpdateMedicine}
              >
                {isLoadingAddMedicine || isLoadingUpdateMedicine ? (
                  <>
                    <span className="loading loading-spinner loading-sm text-[#FFF]" />

                    {modalType === EnumMedicineModalType.ADD
                      ? "Saving"
                      : modalType === EnumMedicineModalType.UPDATE
                      ? "Updating"
                      : ""}
                  </>
                ) : modalType === EnumMedicineModalType.ADD ? (
                  "Save"
                ) : modalType === EnumMedicineModalType.UPDATE ? (
                  "Update"
                ) : (
                  ""
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineModal;
