import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import {
  EnumAlerts,
  EnumMedicineQuantityModalType,
  IRoot,
} from "../../../redux/interfaces";
import { useDispatch, useSelector } from "react-redux";
import {
  doctorModalActions,
  alertMessageActions,
  medicineModalActions,
  medicineQuantityModalActions,
} from "../../../redux/store";
import {
  dataURItoBlob,
  isBase64JPEGDataURI,
  isBlobURL,
} from "../../../utilities/dataHelper";

function useUpdateQuantityMedicine() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const medicineDetails = useSelector(
    (state: IRoot) => state.medicineQuantityModal.medicineDetails
  );
  const editQuantity = useSelector(
    (state: IRoot) => state.medicineQuantityModal.editQuantity
  );

  const medicineQuantityModalType = useSelector(
    (state: IRoot) => state.medicineQuantityModal.medicineQuantityModalType
  );

  const medicine = {
    quantity: medicineDetails.quantity,
    id: medicineDetails.id
  }

  const updateQuantityMedicine = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/inventory-quantity";
    var medicineData;
    if (medicineQuantityModalType === EnumMedicineQuantityModalType.DECREASE) {
      var quantityDifference;

      quantityDifference = medicine.quantity - editQuantity;
      medicineData = {
        ...medicine,
        quantity: +quantityDifference,
      };
    }
    if (medicineQuantityModalType === EnumMedicineQuantityModalType.INCREASE) {
      var quantitySum;

      quantitySum = medicine.quantity + editQuantity;
      medicineData = {
        ...medicine,
        quantity: +quantitySum,
      };
    }

    axios
      .put(url, medicineData)
      .then((res) => {
        if (res.data.status === "Success") {
          setLoading(false);
          setData(data);
          dispatch(medicineQuantityModalActions.toggleMedicineQuantityModal());
          dispatch(medicineModalActions.refetchMedicineToggler());
          dispatch(alertMessageActions.setShowAlert(true));
          setTimeout(() => {
            dispatch(alertMessageActions.setShowAlert(false));
          }, 4000);
          dispatch(
            alertMessageActions.setAlertDetails({
              alertType: EnumAlerts.SUCCESS,
              alertMessage: `Request Success, Updated ${medicineDetails.medicine}'s Quantity`,
            })
          );
          dispatch(medicineModalActions.clearMedicineDetails());
          dispatch(medicineQuantityModalActions.setEditQuantity(0));
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
  return { data, loading, error, updateQuantityMedicine };
}

export default useUpdateQuantityMedicine;
