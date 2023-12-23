import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { EnumAlerts, IRoot } from "@/app/redux/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { doctorModalActions, alertMessageActions, newsModalActions, editUserDetailActions, registrationActions } from "@/app/redux/store";

function useDeleteUser() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const editUserDetails = useSelector(
    (state: IRoot) => state.editUserDetail.editUserDetails
  );
  const deleteUser = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/user";
    axios
      .delete(url, {
        data: { userId: editUserDetails.id },
      })
      .then((res) => {
        if (res.data.status === "Success") {
          setLoading(false);
          setData(data);
          dispatch(editUserDetailActions.toggleDeleteUserModal());
          dispatch(registrationActions.refetchPatientsToggler());
          dispatch(alertMessageActions.setShowAlert(true));
          setTimeout(() => {
            dispatch(alertMessageActions.setShowAlert(false));
          }, 4000);
          dispatch(
            alertMessageActions.setAlertDetails({
              alertType: EnumAlerts.SUCCESS,
              alertMessage: `Request Success, Deleted ${editUserDetails.email}`,
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
  return { data, loading, error, deleteUser };
}

export default useDeleteUser;
