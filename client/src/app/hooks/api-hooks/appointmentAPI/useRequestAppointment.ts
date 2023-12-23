import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import {
  EnumAlerts,
  EnumAppointmentReason,
  EnumAppointmentStatus,
  IAppointment,
} from "../../../redux/interfaces";
import { DateType } from "react-tailwindcss-datepicker";
import {
  alertMessageActions,
  appointmentModalActions,
} from "../../../redux/store";
import { useDispatch } from "react-redux";

function useRequestAppointment({ userDetails, appointmentDetails }: any) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestAppointments = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/appointment";
    axios
      .post(url, { userDetails, appointmentDetails })
      .then((res) => {
        if (res.data.status === "Success") {
          setTimeout(() => {
            setLoading(false);
            dispatch(appointmentModalActions.toggleAppointmentModal());
            dispatch(alertMessageActions.setShowAlert(true));
            setTimeout(() => {
              dispatch(alertMessageActions.setShowAlert(false));
            }, 4000);
            dispatch(
              alertMessageActions.setAlertDetails({
                alertType: EnumAlerts.SUCCESS,
                alertMessage: "Request success, Please wait for approval!",
              })
            );
            dispatch(appointmentModalActions.refetchAppointmentToggler());
          }, 1000);
        }
      })
      .catch((err) => {
        setTimeout(() => {
          setLoading(false);
          dispatch(appointmentModalActions.toggleAppointmentModal());
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
          console.log(err);
        }, 1000);
      });
  };

  return { data, loading, error, requestAppointments };
}

export default useRequestAppointment;
