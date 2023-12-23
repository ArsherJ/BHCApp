"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recordsModalActions } from "../../redux/store";
import {
  EnumDoctorModalType,
  EnumDoctorStatus,
  IRoot,
} from "../../redux/interfaces";
import { FaAddressBook, FaTimes } from "react-icons/fa";
import axios, { AxiosResponse } from "axios";
import { FaUserDoctor } from "react-icons/fa6";
import Image from "next/image";
import useAddDoctor from "../../hooks/api-hooks/doctorAPI/useAddDoctor";
import useUpdateDoctor from "../../hooks/api-hooks/doctorAPI/useUpdateDoctor";
import useAddRecordTable from "../../hooks/api-hooks/recordTableAPI/useAddRecordTable";

const RecordsModal = () => {
  const dispatch = useDispatch();
  const {
    data: dataAddRecord,
    error: errorAddRecord,
    loading: isLoadingAddRecord,
    addRecordTable,
  } = useAddRecordTable();

  const userRecord = useSelector(
    (state: IRoot) => state.recordsModal.userRecord
  );

  const [fieldsError, setFieldsError] = useState("");

  const handleSubmitRecord = (e: any) => {
    e.preventDefault();

    // Check for required fields
    if (
      !userRecord?.date ||
      !userRecord?.illness_history ||
      !userRecord?.physical_exam ||
      !userRecord?.assessment ||
      !userRecord?.treatment_plan ||
      !userRecord?.notes
    ) {
      setFieldsError("All fields are required");
      return;
    }

    setFieldsError("");

    addRecordTable();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
      <div
        className="absolute inset-0 bg-black backdrop-blur-lg opacity-40"
        onClick={() => dispatch(recordsModalActions.toggleRecordsModal())}
      />
      <div
        className="card shadow-lg w-[30%]  max-h-[100vh] flex text-black border-2 border-primary bg-[#ffffff] xl:min-w-[30vw] lg:[50vw] md:min-w-[65vw] sm:min-w-[80vw] min-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header justify-between flex flex-row items-center px-5 py-3">
          <h3 className="card-title text-center flex font-bold justify-center text-black">
            <FaAddressBook className="mr-1" size={20} />
            Add Record
          </h3>
          <button
            className="hover:text-primary duration-75 hover:scale-150"
            onClick={() => {
              dispatch(recordsModalActions.toggleRecordsModal());
              dispatch(recordsModalActions.clearUserRecords());
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <hr />
        <form>
          <div className="card-body flex flex-col overflow-y-scroll max-h-[80vh] justify-center items-stretch py-5 px-5 ">
            <div className="form-control w-full max-w-xs flex-col flex min-w-full">
              {fieldsError && (
                <span className="text-[12px] text-center text-red-500">
                  <span className="bg-red-100 rounded-md py-1 px-2">
                    {fieldsError}
                  </span>
                </span>
              )}
              <div>
                <label
                  htmlFor="dateInput"
                  className="label flex flex-row gap-2 justify-start"
                >
                  <span className="label-text font-bold text-[14px] ">
                    Date
                  </span>
                </label>
                <input
                  required
                  placeholder="Enter Date"
                  type="date"
                  id="dateInput"
                  value={userRecord?.date}
                  className="input input-bordered input-sm w-full max-w-full"
                  onChange={(e) => {
                    dispatch(
                      recordsModalActions.setUserRecord({
                        ...userRecord,
                        date: e.target.value,
                      })
                    );
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="historyInput"
                  className="label flex flex-row gap-2 justify-start"
                >
                  <span className="label-text font-bold text-[14px]">
                    History of illness
                  </span>
                </label>
                <textarea
                  placeholder="Enter Illness History"
                  id="historyInput"
                  value={userRecord?.illness_history}
                  className="input input-bordered input-sm w-full max-w-full"
                  onChange={(e) => {
                    dispatch(
                      recordsModalActions.setUserRecord({
                        ...userRecord,
                        illness_history: e.target.value,
                      })
                    );
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="physical_examInput"
                  className="label flex flex-row gap-2 justify-start"
                >
                  <span className="label-text font-bold text-[14px]">
                    Physical Exam
                  </span>
                </label>
                <textarea
                  placeholder="Enter Physical Exam Details"
                  id="physical_examInput"
                  value={userRecord?.physical_exam}
                  className="input input-bordered input-sm w-full max-w-full"
                  onChange={(e) => {
                    dispatch(
                      recordsModalActions.setUserRecord({
                        ...userRecord,
                        physical_exam: e.target.value,
                      })
                    );
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="assessmentInput"
                  className="label flex flex-row gap-2 justify-start"
                >
                  <span className="label-text font-bold text-[14px]">
                    Assessment
                  </span>
                </label>
                <textarea
                  placeholder="Enter Assessment"
                  id="assessmentInput"
                  value={userRecord?.assessment}
                  className="input input-bordered input-sm w-full max-w-full"
                  onChange={(e) => {
                    dispatch(
                      recordsModalActions.setUserRecord({
                        ...userRecord,
                        assessment: e.target.value,
                      })
                    );
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="treatmentInput"
                  className="label flex flex-row gap-2 justify-start"
                >
                  <span className="label-text font-bold text-[14px]">
                    Treatment Plan
                  </span>
                </label>
                <textarea
                  placeholder="Enter Doctor's Specialty"
                  id="treatmentInput"
                  value={userRecord?.treatment_plan}
                  className="input input-bordered input-sm w-full max-w-full"
                  onChange={(e) => {
                    dispatch(
                      recordsModalActions.setUserRecord({
                        ...userRecord,
                        treatment_plan: e.target.value,
                      })
                    );
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="notes"
                  className="label flex flex-row gap-2 justify-start"
                >
                  <span className="label-text font-bold text-[14px]">
                    Note / Remarks
                  </span>
                </label>
                <textarea
                  placeholder="Notes / Remarks"
                  id="notes"
                  value={userRecord?.notes}
                  className="input input-bordered input-sm w-full max-w-full"
                  onChange={(e) => {
                    dispatch(
                      recordsModalActions.setUserRecord({
                        ...userRecord,
                        notes: e.target.value,
                      })
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <hr />
          <div className="card-footer px-5 py-3">
            <div className="flex flex-col md:flex-row justify-end items-stretch gap-3">
              <button
                className="btn btn-danger btn-md justify-between flex"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(recordsModalActions.clearUserRecords());
                  dispatch(recordsModalActions.toggleRecordsModal());
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-md justify-between flex"
                onClick={handleSubmitRecord}
                disabled={isLoadingAddRecord}
              >
                {isLoadingAddRecord ? (
                  <>
                    <span className="loading loading-spinner loading-sm text-[#FFF]" />
                    Saving
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordsModal;
