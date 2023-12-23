"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newsModalActions } from "../../../redux/store";
import {
  EnumMedicineModalType,
  EnumNewsModalType,
  IRoot,
} from "../../../redux/interfaces";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import { AiFillMedicineBox } from "react-icons/ai";
import useAddMedicine from "../../../hooks/api-hooks/medicineAPI/useAddMedicine";
import useUpdateMedicine from "../../../hooks/api-hooks/medicineAPI/useUpdateMedicine";
import { IoNewspaperSharp } from "react-icons/io5";
import useAddNews from "../../../hooks/api-hooks/newsUpdatesAPI/useAddNews";
import useUpdateNews from "../../../hooks/api-hooks/newsUpdatesAPI/useUpdateNews";
import Link from "next/link";

const NewsModal = () => {
  const dispatch = useDispatch();
  const { loading: isLoadingAddNews, addNews } = useAddNews();
  const { loading: isLoadingUpdateNews, updateNews } = useUpdateNews();
  const [fieldsError, setFieldsError] = useState({
    headline: "",
    facebookLink: "",
  });
  const newsDetails = useSelector(
    (state: IRoot) => state.newsModal.newsDetails
  );
  const modalType = useSelector(
    (state: IRoot) => state.newsModal.newsModalType
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!newsDetails.headline.length) {
      setFieldsError({ ...fieldsError, headline: "Headline is Required" });
      return;
    }
    e.preventDefault();
    if (modalType === EnumNewsModalType.ADD) {
      addNews();
    }
    if (modalType === EnumNewsModalType.UPDATE) {
      updateNews();
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
      <div
        className="absolute inset-0 bg-black backdrop-blur-lg opacity-40"
        onClick={() => dispatch(newsModalActions.toggleNewsModal())}
      />
      <div
        className="card shadow-lg w-[30%]  max-h-[100vh] flex text-black border-2 border-primary bg-[#ffffff] xl:min-w-[30vw] lg:[50vw] md:min-w-[65vw] sm:min-w-[80vw] min-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header justify-between flex flex-row items-center px-5 py-3">
          <h3 className="card-title text-center flex font-bold justify-center text-black">
            <IoNewspaperSharp className="mr-1" size={20} />
            {modalType === EnumNewsModalType.ADD
              ? "Add News/Event"
              : modalType === EnumNewsModalType.UPDATE
              ? "Update News/Event"
              : "News/Event Details"}
          </h3>
          <button
            className="hover:text-primary duration-75 hover:scale-150"
            onClick={() => {
              dispatch(newsModalActions.toggleNewsModal());
              dispatch(newsModalActions.clearNewsDetails());
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
                  src={newsDetails.image || "/image1.jpg"}
                  alt="Selected Image"
                  width={150}
                  height={150}
                />
              </div>
              {modalType !== EnumNewsModalType.VIEW && (
                <div>
                  <label
                    htmlFor="imageInput"
                    className="label flex flex-row gap-2 justify-start"
                  >
                    <span className="label-text font-bold text-[14px]">
                      Choose News/Event Image <span className="text-[12px] text-primary"> - jpg, jpeg, png file</span>
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
                          newsModalActions.setNewsDetails({
                            ...newsDetails,
                            image: displayImage,
                          })
                        );
                      }
                    }}
                  />
                </div>
              )}
              <div>
                <label
                  htmlFor="headlineInput"
                  className={`label flex ${
                    fieldsError.headline ? `justify-between` : `justify-start`
                  } flex-row gap-2 `}
                >
                  <span className="label-text font-bold text-[14px] ">
                    Headline
                  </span>
                  <span className="text-[12px] text-center text-red-500">
                    {fieldsError.headline && (
                      <span className="bg-red-100 rounded-md py-1 px-2">
                        {fieldsError.headline}
                      </span>
                    )}
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Headline"
                  id="headlineInput"
                  disabled={modalType === EnumNewsModalType.VIEW}
                  value={newsDetails.headline}
                  className="input input-bordered input-sm w-full max-w-full"
                  onChange={(e) => {
                    dispatch(
                      newsModalActions.setNewsDetails({
                        ...newsDetails,
                        headline: e.target.value,
                      })
                    );
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="fbLinkInput"
                  className="label flex flex-row gap-2 justify-start"
                >
                  <span className="label-text font-bold text-[14px]">
                    Facebook Link
                  </span>
                </label>
                {/* {modalType !== EnumNewsModalType.VIEW && ( */}
                <input
                  type="text"
                  placeholder="Enter Facebook Link"
                  id="fbLinkInput"
                  disabled={modalType === EnumNewsModalType.VIEW}
                  value={newsDetails.fb_link}
                  className="input input-bordered input-sm w-full max-w-full"
                  onChange={(e) => {
                    dispatch(
                      newsModalActions.setNewsDetails({
                        ...newsDetails,
                        fb_link: e.target.value,
                      })
                    );
                  }}
                />
                {/* )} */}
              </div>
            </div>
          </div>
          {modalType !== EnumNewsModalType.VIEW && (
            <>
              <hr />

              <div className="card-footer px-5 py-3">
                <div className="flex flex-col md:flex-row justify-end items-stretch gap-3">
                  <button
                    className="btn btn-danger btn-md justify-between flex"
                    onClick={() => {
                      dispatch(newsModalActions.toggleNewsModal());
                      dispatch(newsModalActions.clearNewsDetails());
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary btn-md justify-between flex"
                    onClick={handleSubmit}
                    disabled={isLoadingAddNews || isLoadingUpdateNews}
                  >
                    {isLoadingAddNews || isLoadingUpdateNews ? (
                      <>
                        <span className="loading loading-spinner loading-sm text-[#FFF]" />

                        {modalType === EnumNewsModalType.ADD
                          ? "Saving"
                          : modalType === EnumNewsModalType.UPDATE
                          ? "Updating"
                          : ""}
                      </>
                    ) : modalType === EnumNewsModalType.ADD ? (
                      "Save"
                    ) : modalType === EnumNewsModalType.UPDATE ? (
                      "Update"
                    ) : (
                      ""
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewsModal;
