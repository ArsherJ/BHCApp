import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import {
  EnumAlerts,
  EnumAppointmentConfirmModal,
  EnumAppointmentReason,
  EnumAppointmentStatus,
  IAppointment,
  IRoot,
} from "../../../redux/interfaces";
import { DateType } from "react-tailwindcss-datepicker";
import {
  alertMessageActions,
  appointmentModalActions,
} from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import useGetAppointment from "./useGetAppointment";

interface Props {
  id: any;
  status: number;
}

function useUpdateSingleAppointment() {
  const { getAppointments } = useGetAppointment();
  const dispatch = useDispatch();
  const confirmModalType = useSelector(
    (state: IRoot) => state.appointmentModal.confirmModalType
  );
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateSingleAppointment = async ({ id, status }: Props) => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/appointment";
    axios
      .put(url, { id: id, status: status })
      .then((res) => {
        if (res.data.status === "Success") {
          setTimeout(() => {
            setLoading(false);
            setData(res.data);
            dispatch(appointmentModalActions.toggleConfirmationModal());
            dispatch(alertMessageActions.setShowAlert(true));
            setTimeout(() => {
              dispatch(alertMessageActions.setShowAlert(false));
            }, 4000);
            dispatch(
              alertMessageActions.setAlertDetails({
                alertType: EnumAlerts.SUCCESS,
                alertMessage:
                  confirmModalType === EnumAppointmentConfirmModal.ACCEPT
                    ? "Request success, appointment schedule accepted!"
                    : "Request success, appointment schedule rejected!",
              })
            );
            dispatch(appointmentModalActions.refetchAppointmentToggler());
          }, 1000);
        }
      })
      .catch((err) => {
        setTimeout(() => {
          setLoading(false);
          setError(err);
          dispatch(appointmentModalActions.toggleConfirmationModal());
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

  return { data, loading, error, updateSingleAppointment };
}

export default useUpdateSingleAppointment;
