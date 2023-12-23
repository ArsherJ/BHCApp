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

function useChangePassword() {
  const dispatch = useDispatch();
  const userSettingsDetails = useSelector(
    (state: IRoot) => state.userSettings.userSettingsDetails
  );
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = async () => {
    setLoading(true);

    const url = "https://bhc-server.vercel.app/change-password";
    axios
      .post(url, userSettingsDetails)
      .then((res) => {
        if (res.data.status === "Success") {
          setLoading(false);
          setData(res.data);
          dispatch(alertMessageActions.setShowAlert(true));
          setTimeout(() => {
            dispatch(alertMessageActions.setShowAlert(false));
          }, 4000);
          dispatch(
            alertMessageActions.setAlertDetails({
              alertType: EnumAlerts.SUCCESS,
              alertMessage: "Request Success, Updated User Password",
            })
          );
          dispatch(userSettingsActions.refetchUserToggler());
          dispatch(userSettingsActions.clearUserChangePasswordInputs());
        } else {
          setLoading(false);
          setError(res.data);
          dispatch(alertMessageActions.setShowAlert(true));
          setTimeout(() => {
            dispatch(alertMessageActions.setShowAlert(false));
          }, 4000);
          dispatch(
            alertMessageActions.setAlertDetails({
              alertType: EnumAlerts.ERROR,
              alertMessage: `Request error, invalid old password`,
            })
          );
          console.log(error);
        }
      })
      .catch((err) => {
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
      });
  };

  return { data, loading, error, changePassword };
}

export default useChangePassword;
