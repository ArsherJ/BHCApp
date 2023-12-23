"use client";
import { EnumUserRole, IRoot } from "../../redux/interfaces";
import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import path from "path";
import { useDispatch, useSelector } from "react-redux";
import { userDetailsActions, userSettingsActions } from "../../redux/store";

function useVerification() {
  const [isLoadingVerification, setIsLoadingVerification] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const refetchUser = useSelector(
    (state: IRoot) => state.userSettings.refetchUser
  );
  const verifyUser = async () => {
    setIsLoadingVerification(true);
    try {
      const res = await axios.get("https://bhc-server.vercel.app/verify");
      // console.log("[[[[[resDataHOME]]]]]:", res.data);
      if (res.data.status === "Success") {
        setIsLoadingVerification(false);


        if (
          res.data.role !== EnumUserRole.ADMIN &&
          (pathname === "/inventory" ||
            pathname === "/emergency" ||
            pathname === "/registration" ||
            pathname === "patient-records" ||
            pathname === "/appointment/requests")
        ) {
          router.replace("/not-authorized");
        }
        if (pathname === "/") {
          router.replace("/dashboard");
        }
        const {
          user_id,
          first_name,
          last_name,
          birthday,
          contact,
          address,
          sex,
          email,
          username,
          role,
        } = res.data;
        dispatch(
          userDetailsActions.setUserDetails({
            isAuth: true,
            user_id: user_id,
            first_name: first_name,
            last_name: last_name,
            birthday: birthday,
            contact: contact,
            address: address,
            sex: sex,
            email: email,
            username: username,
            role: role,
          })
        );
        dispatch(
          userSettingsActions.setUserSettingsDetails({
            user_id: user_id,
            first_name: first_name,
            last_name: last_name,
            birthday: birthday,
            contact: contact,
            address: address,
            sex: sex,
            email: email,
            username: username,
            role: role,
          })
        );
      } else {
        setIsLoadingVerification(false);
        console.log(`verification error1: ${res.data.error}`);
        router.replace("/");
      }
    } catch (err) {
      setIsLoadingVerification(false);
      console.log("verification error2: ", err);
      router.replace("/");
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  return { isLoadingVerification };
}

export default useVerification;
