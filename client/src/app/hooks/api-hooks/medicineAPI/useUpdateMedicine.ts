import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { EnumAlerts, IRoot } from "../../../redux/interfaces";
import { useDispatch, useSelector } from "react-redux";
import {
  doctorModalActions,
  alertMessageActions,
  medicineModalActions,
} from "../../../redux/store";
import {
  dataURItoBlob,
  isBase64JPEGDataURI,
  isBlobURL,
} from "../../../utilities/dataHelper";

function useUpdateMedicine() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const medicineDetails = useSelector(
    (state: IRoot) => state.medicineModal.medicineDetails
  );

  const updateMedicine = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/inventory";
    const medicineImage = medicineDetails.image;
    if (isBlobURL(medicineDetails.image)) {
      fetch(medicineImage)
        .then((response) => response.blob())
        .then((blob) => {
          const medicine = medicineDetails.medicine.replaceAll(" ", "").trim();
          const imageFile = new File([blob], `${medicine}.jpg`, {
            type: "image/jpeg",
          });
          axios
            .put(
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
                    alertMessage: `Request Success, Updated ${medicineDetails.medicine}'s Detail`,
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
              }, 6000);
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
    } else if (isBase64JPEGDataURI(medicineImage)) {
      const imageBlob = dataURItoBlob(medicineImage);
      const medicine = medicineDetails.medicine.replaceAll(" ", "").trim();
      const imageFile = new File([imageBlob], `${medicine}.jpg`, {
        type: "image/jpeg",
      });
      axios
        .put(
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
                alertMessage: `Request Success, Updated ${medicineDetails.medicine}'s Detail`,
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
    } else {
      axios
        .put(url, medicineDetails, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
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
                alertMessage: `Request Success, Updated ${medicineDetails.medicine}'s Detail`,
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
    }
  };
  return { data, loading, error, updateMedicine };
}

export default useUpdateMedicine;
