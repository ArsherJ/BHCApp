import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { EnumAlerts, IRoot } from "../../../redux/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { doctorModalActions, alertMessageActions } from "../../../redux/store";

function useDeleteDoctor() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const doctorDetails = useSelector(
    (state: IRoot) => state.doctorModal.doctorDetails
  );
  const deleteDoctor = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/doctors";
    axios
      .delete(url, {
        data: { id: doctorDetails.id },
      })
      .then((res) => {
        if (res.data.status === "Success") {
          setLoading(false);
          setData(data);
          dispatch(doctorModalActions.toggleConfirmationModal());
          dispatch(doctorModalActions.refetchDoctorsToggler());
          dispatch(alertMessageActions.setShowAlert(true));
          dispatch(doctorModalActions.clearDoctorDetails());
          setTimeout(() => {
            dispatch(alertMessageActions.setShowAlert(false));
          }, 4000);
          dispatch(
            alertMessageActions.setAlertDetails({
              alertType: EnumAlerts.SUCCESS,
              alertMessage: `Request Success, Deleted Doctor ${doctorDetails.name}!`,
            })
          );
        }
      })
      .catch((err) => {
        setTimeout(() => {
          setLoading(false);
          setError(err);
          dispatch(alertMessageActions.setShowAlert(true));
          setTimeout(() => {
            dispatch(alertMessageActions.setShowAlert(false));
          }, 6000);
          dispatch(
            alertMessageActions.setAlertDetails({
              alertType: EnumAlerts.ERROR,
              alertMessage: `Request error, ${err.message}`,
            })
          );
        }, 1000);
        console.log("Error:", err);
      });
  };
  return { data, loading, error, deleteDoctor };
}

export default useDeleteDoctor;
