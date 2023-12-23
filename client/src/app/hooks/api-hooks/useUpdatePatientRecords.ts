import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import {
  EnumAlerts,
  EnumAppointmentConfirmModal,
  IRoot,
} from "../../redux/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { alertMessageActions, registrationActions } from "../../redux/store";

function useUpdatePatientRecords() {
  const dispatch = useDispatch();
  const editUserDetails = useSelector(
    (state: IRoot) => state.editUserDetail.editUserDetails
  );
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updatePatientRecords = async () => {
    setLoading(true);

    const url = "https://bhc-server.vercel.app/patients";
    axios
      .put(url, editUserDetails)
      .then((res) => {
        if (res.data.status === "Success") {
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
                alertMessage: "Request success, Updated Patient Records",
              })
            );
            dispatch(registrationActions.refetchPatientsToggler());
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

  return { data, loading, error, updatePatientRecords };
}

export default useUpdatePatientRecords;
