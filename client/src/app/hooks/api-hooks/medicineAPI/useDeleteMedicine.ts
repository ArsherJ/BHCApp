import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { EnumAlerts, IRoot } from "../../../redux/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { doctorModalActions, alertMessageActions, medicineModalActions } from "../../../redux/store";

function useDeleteMedicine() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const medicineDetails = useSelector(
    (state: IRoot) => state.medicineModal.medicineDetails
  );
  const deleteMedicine = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/inventory";
    axios
      .delete(url, {
        data: { id: medicineDetails.id },
      })
      .then((res) => {
        if (res.data.status === "Success") {
          setLoading(false);
          setData(data);
          dispatch(medicineModalActions.toggleMedicineConfirmationModal());
          dispatch(medicineModalActions.refetchMedicineToggler());
          dispatch(alertMessageActions.setShowAlert(true));
          setTimeout(() => {
            dispatch(alertMessageActions.setShowAlert(false));
          }, 4000);
          dispatch(
            alertMessageActions.setAlertDetails({
              alertType: EnumAlerts.SUCCESS,
              alertMessage: `Request Success, Deleted ${medicineDetails.medicine}!`,
            })
          );
          dispatch(medicineModalActions.clearMedicineDetails());

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
  return { data, loading, error, deleteMedicine };
}

export default useDeleteMedicine;
