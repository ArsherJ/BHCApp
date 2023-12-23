import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { logoutActions, userDetailsActions } from "../../redux/store";
import { IRoot } from "../../redux/interfaces";

function useLogout() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const isLoadingLogout = useSelector(
    (state: IRoot) => state.logout.isLoadingLogout
  );
  const router = useRouter();

  const doLogout = async () => {
    axios.defaults.withCredentials = true;
    dispatch(logoutActions.setIsLoadingLogout(true));
    const url = "https://bhc-server.vercel.app/logout";
    try {
      const res = await axios.get(url);
      if (res.data.status === "Success") {
        console.log("logoutresposnse:",res)
        dispatch(userDetailsActions.clearUserDetails());
        deleteAllCookies();
; // replace 'yourCookieName' with the actual cookie name
        router.replace("/");
        dispatch(logoutActions.setIsLoadingLogout(false));
      } else {
        dispatch(logoutActions.setIsLoadingLogout(false));
        console.log(`verification error1: ${res.data.error}`);
      }
    } catch (err: any) {
      dispatch(logoutActions.setIsLoadingLogout(false));
      setError(err);
    }
  };

  return { data, isLoadingLogout, error, doLogout };
}

export function deleteCookie(cookieName: string) {
  document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
export function deleteAllCookies() {
  var cookies = document.cookie.split(";");
  console.log('Deleting cookies:', cookies);  // Check if cookies are fetched correctly
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log('Deleted cookie:', name);
  }
}

export default useLogout;
