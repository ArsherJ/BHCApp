"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doctorModalActions } from "../../../redux/store";
import {
  EnumDoctorModalType,
  EnumDoctorStatus,
  IRoot,
} from "../../../redux/interfaces";
import { FaTimes } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import Image from "next/image";
import useAddDoctor from "../../../hooks/api-hooks/doctorAPI/useAddDoctor";
import useUpdateDoctor from "../../../hooks/api-hooks/doctorAPI/useUpdateDoctor";

const AddDoctorModal = () => {
  const dispatch = useDispatch();
  const { loading: isLoadingAddDoctor, addDoctor } = useAddDoctor();
  const { loading: isLoadingUpdateDoctor, updateDoctor } = useUpdateDoctor();
  const doctorDetails = useSelector(
    (state: IRoot) => state.doctorModal.doctorDetails
  );
  const modalType = useSelector(
    (state: IRoot) => state.doctorModal.doctorModalType
  );

  const [fieldsError, setFieldsError] = useState("");

  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );

  const { role: userRole } = userDetails;

  const handleSubmitDoctor = (e: any) => {
    e.preventDefault();

    // Check for required fields
    if (
      !doctorDetails.name ||
      !doctorDetails.position ||
      !doctorDetails.specialty ||
      doctorDetails.status === undefined
    ) {
      setFieldsError("All fields are required");
      return;
    }

    setFieldsError("");

    if (modalType === EnumDoctorModalType.ADD) {
      addDoctor();
    }
    if (modalType === EnumDoctorModalType.UPDATE) {
      updateDoctor();
    }
  };

  const statusOptions = Object.entries(EnumDoctorStatus)
    .filter(([key, value]) => typeof value === "number")
    .map(([key, value]) => {
      console.log("key:", key);
      return (
        <option key={key} value={value}>
          {key}
        </option>
      );
    });

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
      <div
        className="absolute inset-0 bg-black backdrop-blur-lg opacity-40"
        onClick={() => dispatch(doctorModalActions.toggleDoctorModal())}
      />
      <div
        className="card shadow-lg w-[30%]  max-h-[100vh] flex text-black border-2 border-primary bg-[#ffffff] xl:min-w-[30vw] lg:[50vw] md:min-w-[65vw] sm:min-w-[80vw] min-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header justify-between flex flex-row items-center px-5 py-3">
          <h3 className="card-title text-center flex font-bold justify-center text-black">
            <FaUserDoctor className="mr-1" size={20} />
            {modalType === EnumDoctorModalType.ADD
              ? "Add New Medic"
              : modalType === EnumDoctorModalType.UPDATE
              ? "Update Doctor Details"
              : modalType === EnumDoctorModalType.VIEW
              ? "Doctor Details"
              : ""}
          </h3>
          <button
            className="hover:text-primary duration-75 hover:scale-150"
            onClick={() => {
              dispatch(doctorModalActions.toggleDoctorModal());
              dispatch(doctorModalActions.clearDoctorDetails());
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <hr />
        <form>
          <div className="card-body flex flex-col overflow-y-scroll max-h-[80vh] justify-center items-stretch py-5 px-5 ">
            <div className="form-control w-full max-w-xs flex-col flex min-w-full">
              <div className="w-full bg-gray-100 rounded-md flex flex-col justify-center py-4 items-center">
                <Image
                  src={doctorDetails.image || "/doctorImage.jpg"}
                  alt="Selected Profile"
                  width={250}
                  height={250}
                />
              </div>
              {modalType !== EnumDoctorModalType.VIEW && (
                <div>
                  <label
                    htmlFor="imageInput"
                    className="label flex flex-row gap-2 justify-start"
                  >
                    <span className="label-text font-bold text-[14px]">
                      Choose Profile Image{" "}
                      <span className="text-[12px] text-primary">
                        {" "}
                        - jpg, jpeg, png file
                      </span>
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
                          doctorModalActions.setDoctorDetails({
                            ...doctorDetails,
                            image: displayImage,
                          })
                        );
                      }
                    }}
                  />
                </div>
              )}

              {fieldsError && (
                <span className="text-[12px] text-center mt-4 text-red-500">
                  <span className="bg-red-100 rounded-md py-1 px-2">
                    {fieldsError}
                  </span>
                </span>
              )}
              <div>
                <label
                  htmlFor="nameInput"
                  className="label flex flex-row gap-2 justify-start"
                >
                  <span className="label-text font-bold text-[14px] ">
                    Name
                  </span>
                </label>
                <input
                  placeholder="Enter Medic's Name"
                  type="text"
                  id="nameInput"
                  disabled={modalType === EnumDoctorModalType.VIEW}
                  value={doctorDetails.name}
                  className="input input-bordered input-sm w-full max-w-full"
                  onChange={(e) => {
                    dispatch(
                      doctorModalActions.setDoctorDetails({
                        ...doctorDetails,
                        name: e.target.value,
                      })
                    );
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="positionInput"
                  className="label flex flex-row gap-2 justify-start"
                >
                  <span className="label-text font-bold text-[14px]">
                    Position
                  </span>
                </label>
                <input
                  placeholder="Enter Medic's Position"
                  type="text"
                  id="positionInput"
                  disabled={modalType === EnumDoctorModalType.VIEW}
                  value={doctorDetails.position}
                  className="input input-bordered input-sm w-full max-w-full"
                  onChange={(e) => {
                    dispatch(
                      doctorModalActions.setDoctorDetails({
                        ...doctorDetails,
                        position: e.target.value,
                      })
                    );
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="specialtyInput"
                  className="label flex flex-row gap-2 justify-start"
                >
                  <span className="label-text font-bold text-[14px]">
                    Specialty
                  </span>
                </label>
                <input
                  placeholder="Enter Medic's Specialty"
                  type="text"
                  id="specialtyInput"
                  disabled={modalType === EnumDoctorModalType.VIEW}
                  value={doctorDetails.specialty}
                  className="input input-bordered input-sm w-full max-w-full"
                  onChange={(e) => {
                    dispatch(
                      doctorModalActions.setDoctorDetails({
                        ...doctorDetails,
                        specialty: e.target.value,
                      })
                    );
                  }}
                />
              </div>
              <label
                htmlFor="statusInput"
                className="label flex flex-row gap-2 justify-start"
              >
                <span className="label-text font-bold text-[14px]">Status</span>
              </label>
              <select
                placeholder="Set Appointment Time"
                required
                disabled={modalType === EnumDoctorModalType.VIEW}
                id="statusInput"
                className="input input-bordered input-sm min-w-full"
                value={doctorDetails.status}
                onChange={(e) => {
                  dispatch(
                    doctorModalActions.setDoctorDetails({
                      ...doctorDetails,
                      status: +e.target.value,
                    })
                  );
                }}
                style={{ paddingRight: "30px" }}
              >
                {statusOptions}
              </select>
            </div>
          </div>
          <hr />
          {modalType !== EnumDoctorModalType.VIEW && (
            <div className="card-footer px-5 py-3">
              <div className="flex flex-col md:flex-row justify-end items-stretch gap-3">
                <button
                  className="btn btn-danger btn-md justify-between flex"
                  onClick={() => {
                    dispatch(doctorModalActions.clearDoctorDetails());
                    dispatch(doctorModalActions.toggleDoctorModal());
                    dispatch(doctorModalActions.clearDoctorDetails());
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-md justify-between flex"
                  onClick={handleSubmitDoctor}
                  disabled={isLoadingAddDoctor}
                >
                  {isLoadingAddDoctor || isLoadingUpdateDoctor ? (
                    <>
                      <span className="loading loading-spinner loading-sm text-[#FFF]" />

                      {modalType === EnumDoctorModalType.ADD
                        ? "Saving"
                        : modalType === EnumDoctorModalType.UPDATE
                        ? "Updating"
                        : ""}
                    </>
                  ) : modalType === EnumDoctorModalType.ADD ? (
                    "Save"
                  ) : modalType === EnumDoctorModalType.UPDATE ? (
                    "Update"
                  ) : (
                    ""
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddDoctorModal;
