import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import {
  EnumAlerts,
  EnumAppointmentConfirmModal,
  IRoot,
} from "../../redux/interfaces";
import { useDispatch, useSelector } from "react-redux";
import {
  alertMessageActions,
  registrationActions,
  userSettingsActions,
} from "../../redux/store";
import { useRouter } from "next/navigation";

function useUpdateUserDetails() {
  const dispatch = useDispatch();
  const userSettingsDetails = useSelector(
    (state: IRoot) => state.userSettings.userSettingsDetails
  );
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const updateUserDetails = async () => {
    setLoading(true);

    const url = "https://bhc-server.vercel.app/user";
    axios
      .put(url, userSettingsDetails)
      .then((res) => {
        if (res.data.status === "Success") {
          const newToken = res.data.newToken;
          setTimeout(() => {
            setLoading(false);
            setData(res.data);
            dispatch(alertMessageActions.setShowAlert(true));
            setTimeout(() => {
              dispatch(alertMessageActions.setShowAlert(false));
            }, 4000);
            dispatch(
              alertMessageActions.setAlertDetails({
                alertType: EnumAlerts.SUCCESS,
                alertMessage: "Request Success, Updated User Details",
              })
            );
            dispatch(userSettingsActions.refetchUserToggler());
          }, 1000);
        }
      })
      .catch((err) => {
        setTimeout(() => {
          setLoading(false);
          setError(err);
          dispatch(alertMessageActions.setShowAlert(true));
          setTimeout(() => {
            dispatch(alertMessageActions.setShowAlert(false));
          }, 4000);
          dispatch(
            alertMessageActions.setAlertDetails({
              alertType: EnumAlerts.ERROR,
              alertMessage: `Request error, ${err.message}`,
            })
          );
          console.log(err);
        }, 1000);
      });
  };

  return { data, loading, error, updateUserDetails };
}

export default useUpdateUserDetails;
