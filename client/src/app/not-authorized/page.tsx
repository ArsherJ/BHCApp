"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { IRoot } from "../redux/interfaces";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userDetailsActions } from "../redux/store";
import axios from "axios";
import useVerification from "../hooks/api-hooks/useVerification";

const NotAuthorized = () => {
  axios.defaults.withCredentials = true;
  const { isLoadingVerification } = useVerification();

  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );
  const { isAuth } = userDetails;

  return (
    <div className="flex justify-start pt-32 items-center flex-col bg-primary text-white min-h-screen ">
      <div className="card bg-white">
        <div className="relative bg-primary w-[700px] sm:w-[350px] group transition-all duration-700 aspect-video flex items-center justify-center">
          <div className="transition-all flex flex-col items-center py-5 justify-start duration-300 group-hover:duration-1000 bg-white w-full h-full absolute group-hover:-translate-y-16">
            <p className="text-xl sm:text-2xl font-semibold text-gray-500 font-serif">
              ERROR 401
            </p>
            <p className="px-10 py-2 text-[16px] sm:text-[12px] text-gray-700">
              UNAUTHORIZED
            </p>
            <p className="font-sans text-[20px] text-gray-700 pt-3">BHC</p>
          </div>
          <button className="seal bg-white text-primary w-10 aspect-square rounded-full z-40 text-[10px] flex items-center justify-center font-semibold [clip-path:polygon(50%_0%,_80%_10%,_100%_35%,_100%_70%,_80%_90%,_50%_100%,_20%_90%,_0%_70%,_0%_35%,_20%_10%)] group-hover:opacity-0 transition-all duration-1000 group-hover:scale-0 group-hover:rotate-180 border-4 border-primary">
            401
          </button>
          <div className="tp transition-all duration-1000 group-hover:duration-100 bg-neutral-800 absolute group-hover:[clip-path:polygon(50%_0%,_100%_0,_0_0)] w-full h-full [clip-path:polygon(50%_50%,_100%_0,_0_0)]"></div>
          <div className="lft transition-all duration-700 absolute w-full h-full bg-neutral-900 [clip-path:polygon(50%_50%,_0_0,_0_100%)]"></div>
          <div className="rgt transition-all duration-700 absolute w-full h-full bg-neutral-800 [clip-path:polygon(50%_50%,_100%_0,_100%_100%)]"></div>
          <div className="btm transition-all duration-700 absolute w-full h-full bg-neutral-900 [clip-path:polygon(50%_50%,_100%_100%,_0_100%)]"></div>
        </div>
      </div>
      <div className="text-center capitalize mt-8 gap-2 flex flex-col">
        <h3> You are not Authorized to access this page!</h3>
        {!isAuth && <h5> Please Log In First!</h5>}
      </div>
      {isAuth ? (
        <Link prefetch 
          href="/dashboard"
          className="btn btn-outline btn-lg text-white mt-8"
        >
          Return to Dashboard
        </Link>
      ) : (
        <Link prefetch  href="/" className="btn btn-outline btn-lg text-white mt-8">
          Return to Home Page
        </Link>
      )}
    </div>
  );
};

export default NotAuthorized;