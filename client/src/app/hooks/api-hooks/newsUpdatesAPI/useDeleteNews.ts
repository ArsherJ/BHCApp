import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { EnumAlerts, IRoot } from "../../../redux/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { doctorModalActions, alertMessageActions, newsModalActions } from "../../../redux/store";

function useDeleteNews() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const newsDetails = useSelector(
    (state: IRoot) => state.newsModal.newsDetails
  );
  const deleteNews = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/news-updates";
    axios
      .delete(url, {
        data: { id: newsDetails.id },
      })
      .then((res) => {
        if (res.data.status === "Success") {
          setLoading(false);
          setData(data);
          dispatch(newsModalActions.toggleNewsConfirmationModal());
          dispatch(newsModalActions.refetchNewsToggler());
          dispatch(alertMessageActions.setShowAlert(true));
          setTimeout(() => {
            dispatch(alertMessageActions.setShowAlert(false));
          }, 4000);
          dispatch(
            alertMessageActions.setAlertDetails({
              alertType: EnumAlerts.SUCCESS,
              alertMessage: `Request Success, Deleted News!`,
            })
          );
          dispatch(newsModalActions.clearNewsDetails());

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
  return { data, loading, error, deleteNews };
}

export default useDeleteNews;
