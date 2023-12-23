import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { EnumAlerts, IRoot } from "../../../redux/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { medicineModalActions, alertMessageActions, emergencyModalActions } from "../../../redux/store";

function useSendEmergency() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const emergencyDetails = useSelector(
    (state: IRoot) => state.emergencyModal.emergencyDetails
  );
  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );
  const emergencyData = {
    emergencyDetails,
    userDetails,
  };
  const sendEmergency = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/email-emergency";
    axios
      .post(url, emergencyData)
      .then((res) => {
        console.log('RESPONSEEE:',res)
        if (res.data.status === "Success") {
          setLoading(false);
          setData(data);
          dispatch(emergencyModalActions.toggleEmergencyModal());
        //   dispatch(emergencyModalActions.refetchMedicineToggler());
          dispatch(alertMessageActions.setShowAlert(true));
          setTimeout(() => {
            dispatch(alertMessageActions.setShowAlert(false));
          }, 4000);
          dispatch(
            alertMessageActions.setAlertDetails({
              alertType: EnumAlerts.SUCCESS,
              alertMessage: "Request Success, Emergency Sent!",
            })
          );
          dispatch(emergencyModalActions.clearEmergencyDetails());
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
        dispatch(emergencyModalActions.clearEmergencyDetails());
        console.log("Error:", err);
      });
  };
  return { data, loading, error, sendEmergency };
}

export default useSendEmergency;
