import { useState } from "react";
import axios from "axios";
import {
  EnumAlerts,
  EnumAppointmentConfirmModal,
  IAppointment,
  IRoot,
} from "../../../redux/interfaces";
import {
  alertMessageActions,
  appointmentModalActions,
} from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  selectedAppointmentRows?: IAppointment[];
  status: number;
}

function useUpdateBulkAppointments() {
  const dispatch = useDispatch();
  const confirmModalType = useSelector(
    (state: IRoot) => state.appointmentModal.confirmModalType
  );
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateBulkAppointments = async ({ selectedAppointmentRows, status }: Props) => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/appointment-bulk";
    axios
      .put(url, { selectedAppointmentRows: selectedAppointmentRows, status: status })
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
                    ? "Request success, schedules accepted in bulk!"
                    : "Request success, schedules rejected in bulk!",
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

  return { data, loading, error, updateBulkAppointments };
}

export default useUpdateBulkAppointments;
