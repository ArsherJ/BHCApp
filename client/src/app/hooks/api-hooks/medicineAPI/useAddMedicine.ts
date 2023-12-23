import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { EnumAlerts, IRoot } from "../../../redux/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { medicineModalActions, alertMessageActions } from "../../../redux/store";

function useAddMedicine() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const medicineDetails = useSelector(
    (state: IRoot) => state.medicineModal.medicineDetails
  );
  const addMedicine = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/inventory";
    const blobURL = medicineDetails.image;
    if (blobURL) {
      fetch(blobURL)
        .then((response) => response.blob())
        .then((blob) => {
          const medicine = medicineDetails.medicine
            .replaceAll(" ", "")
            .trim();
          const imageFile = new File([blob], `${medicine}.jpg`, {
            type: "image/jpeg",
          });
          axios
            .post(
              url,
              { ...medicineDetails, image: imageFile },
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((res) => {
              if (res.data.status === "Success") {
                setLoading(false);
                setData(data);
                dispatch(medicineModalActions.toggleMedicineModal());
                dispatch(medicineModalActions.refetchMedicineToggler());
                dispatch(alertMessageActions.setShowAlert(true));
                setTimeout(() => {
                  dispatch(alertMessageActions.setShowAlert(false));
                }, 4000);
                dispatch(
                  alertMessageActions.setAlertDetails({
                    alertType: EnumAlerts.SUCCESS,
                    alertMessage: "Request success, added medicine!",
                  })
                );
                dispatch(medicineModalActions.clearMedicineDetails());
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
              dispatch(medicineModalActions.clearMedicineDetails());
              console.log("Error:", err);
            });
        })
        .catch((error) => {
          setLoading(false);
          setError(error);
          console.error("Error fetching the blob:", error);
        });
    } else {
      axios
        .post(url, medicineDetails)
        .then((res) => {
          if (res.data.status === "Success") {
            setLoading(false);
            setData(data);
            dispatch(medicineModalActions.toggleMedicineModal());
            dispatch(medicineModalActions.refetchMedicineToggler());
            dispatch(alertMessageActions.setShowAlert(true));
            setTimeout(() => {
              dispatch(alertMessageActions.setShowAlert(false));
            }, 4000);
            dispatch(
              alertMessageActions.setAlertDetails({
                alertType: EnumAlerts.SUCCESS,
                alertMessage: "Request success, added medicine!",
              })
            );
            dispatch(medicineModalActions.clearMedicineDetails());
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
          dispatch(medicineModalActions.clearMedicineDetails());
          console.log("Error:", err);
        });
    }
  };
  return { data, loading, error, addMedicine };
}

export default useAddMedicine;
