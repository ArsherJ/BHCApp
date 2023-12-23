"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editUserDetailActions, newsModalActions } from "@/app/redux/store";
import { EnumAlerts, EnumDoctorStatus, IRoot } from "@/app/redux/interfaces";
import { FaTimes, FaUser } from "react-icons/fa";
import Image from "next/image";
import { IoNewspaperSharp } from "react-icons/io5";
import useDeleteUser from "@/app/hooks/api-hooks/useDeleteUser";

const DeleteUserModal = () => {
  const { loading: isLoadingDeleteUser, deleteUser } = useDeleteUser();
  const dispatch = useDispatch();
  const editUserDetails = useSelector(
    (state: IRoot) => state.editUserDetail.editUserDetails
  );

  const handleConfirm = (event: any) => {
    event.preventDefault();
    deleteUser()
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
      <div
        className="absolute inset-0 bg-black backdrop-blur-lg opacity-40"
        onClick={() => {
          dispatch(editUserDetailActions.toggleDeleteUserModal());
        }}
      />
      <div
        className="card shadow-lg w-[30%]  max-h-[100vh] flex text-black border-2 border-primary bg-[#ffffff] xl:min-w-[30vw] lg:[50vw] md:min-w-[65vw] sm:min-w-[80vw] min-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header justify-between flex flex-row items-center px-5 py-3">
          <h3 className="card-title text-center flex font-bold justify-center text-black">
            <FaUser className="mr-1" size={20} />
            Delete User
          </h3>
          <button
            className="hover:text-primary duration-75 hover:scale-150"
            onClick={() => {
                dispatch(editUserDetailActions.toggleDeleteUserModal());
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <hr />
        <div className="card-body flex flex-col overflow-y-scroll max-h-[80vh] justify-center items-stretch py-5 px-5 ">
          <div className="text-start bg-gray-100 py-2 capitalize flex flex-col justify-center items-center px-[20%] border-x-[10px] border-primary">
            <h5>User Details</h5>
            <h6>Name: {editUserDetails.first_name} {editUserDetails.last_name}</h6>
            <h6>{editUserDetails.email}</h6>
          </div>
          <div className="text-center pt-2">
            <h6>Are you sure you want to delete this User?</h6>
          </div>
        </div>
        <hr />
        <div className="card-footer px-5 py-3">
          <div className="flex flex-col md:flex-row justify-end items-stretch gap-3">
            <button
              className="btn btn-danger btn-md justify-between flex"
              onClick={() => {
                dispatch(editUserDetailActions.toggleDeleteUserModal());
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary btn-md justify-between flex"
              onClick={handleConfirm}
              disabled={isLoadingDeleteUser}
            >
              {isLoadingDeleteUser ? (
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

export default DeleteUserModal;
