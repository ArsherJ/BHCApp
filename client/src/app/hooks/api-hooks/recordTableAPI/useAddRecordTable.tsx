import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { EnumAlerts, IRoot } from "../../../redux/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { alertMessageActions, recordsModalActions } from "../../../redux/store";

function useAddRecordTable() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const userRecord = useSelector(
    (state: IRoot) => state.recordsModal.userRecord
  );
  const editUserDetails = useSelector(
    (state: IRoot) => state.editUserDetail.editUserDetails
  );
  const { id } = editUserDetails;

  console.log("editUserDetails:",editUserDetails)
  const updatedUserRecord = {
    ...userRecord,
    user_id: id,
  };
  console.log("UpdateUserRecord:", updatedUserRecord)
  const recordData = {
    userRecord: updatedUserRecord,
  };
  const addRecordTable = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/record-table";
    console.log("EdiTDATA:", editUserDetails);
    console.log("REQCORDDATA:", recordData);

    axios
      .post(url, recordData)
      .then((res) => {
        console.log("RESPONSEEE:", res);
        if (res.data.status === "Success") {
          setLoading(false);
          setData(data);
          dispatch(recordsModalActions.toggleRecordsModal());
          dispatch(alertMessageActions.setShowAlert(true));
          setTimeout(() => {
            dispatch(alertMessageActions.setShowAlert(false));
          }, 4000);
          dispatch(
            alertMessageActions.setAlertDetails({
              alertType: EnumAlerts.SUCCESS,
              alertMessage: "Request Success, Added Record Data!",
            })
          );
          dispatch(recordsModalActions.refetchRecordsToggler())
          dispatch(recordsModalActions.clearUserRecords());
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
        dispatch(recordsModalActions.clearUserRecords());
        console.log("Error:", err);
      });
  };

  return { data, loading, error, addRecordTable };
}

export default useAddRecordTable;
