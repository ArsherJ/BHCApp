import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  alertMessageActions,
  logoutActions,
  registrationActions,
  userDetailsActions,
} from "../../redux/store";
import { EnumAlerts, IRoot } from "../../redux/interfaces";

function useRegister() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const registrationDetails = useSelector(
    (state: IRoot) => state.registration.registrationDetails
  );

  const registerUser = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/register";
    try {
      const res = await axios.post(url, registrationDetails);
      console.log('RESPONSEEE REGISTRATION:',res.data)
      if (res.data.code === 200) {
        setLoading(false);
        setData(data);
        dispatch(alertMessageActions.setShowAlert(true));
        setTimeout(() => {
          dispatch(alertMessageActions.setShowAlert(false));
        }, 4000);
        dispatch(
          alertMessageActions.setAlertDetails({
            alertType: EnumAlerts.SUCCESS,
            alertMessage: `Request success, Registered Patient ${registrationDetails.username}!`,
          })
        );
        dispatch(registrationActions.refetchPatientsToggler());
        dispatch(registrationActions.clearRegistrationDetails());
        setLoading(false);
      } else {
        setLoading(false);
        console.log(`verification error1: ${res.data.error}`);
      }
    } catch (err: any) {
      setLoading(false);
      setError(err);
    }
  };

  return { data, loading, error, registerUser };
}

export default useRegister;
