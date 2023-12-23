import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { EnumAlerts, IRoot } from "../../../redux/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { newsModalActions, alertMessageActions } from "../../../redux/store";

function useAddNews
() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const newsDetails = useSelector(
    (state: IRoot) => state.newsModal.newsDetails
  );
  const addNews = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/news-updates";
    const blobURL = newsDetails.image;
    if (blobURL) {
      fetch(blobURL)
        .then((response) => response.blob())
        .then((blob) => {
          const news = newsDetails.headline
            .replaceAll(" ", "")
            .trim();
          const imageFile = new File([blob], `${news}.jpg`, {
            type: "image/jpeg",
          });
          axios
            .post(
              url,
              { ...newsDetails, image: imageFile },
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
                dispatch(newsModalActions.toggleNewsModal());
                dispatch(newsModalActions.refetchNewsToggler());
                dispatch(alertMessageActions.setShowAlert(true));
                setTimeout(() => {
                  dispatch(alertMessageActions.setShowAlert(false));
                }, 4000);
                dispatch(
                  alertMessageActions.setAlertDetails({
                    alertType: EnumAlerts.SUCCESS,
                    alertMessage: "Request success, added news!",
                  })
                );
                dispatch(newsModalActions.clearNewsDetails());
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
              dispatch(newsModalActions.clearNewsDetails());
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
        .post(url, newsDetails)
        .then((res) => {
          if (res.data.status === "Success") {
            setLoading(false);
            setData(data);
            dispatch(newsModalActions.toggleNewsModal());
            dispatch(newsModalActions.refetchNewsToggler());
            dispatch(alertMessageActions.setShowAlert(true));
            setTimeout(() => {
              dispatch(alertMessageActions.setShowAlert(false));
            }, 4000);
            dispatch(
              alertMessageActions.setAlertDetails({
                alertType: EnumAlerts.SUCCESS,
                alertMessage: "Request success, added news!",
              })
            );
            dispatch(newsModalActions.clearNewsDetails());
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
          dispatch(newsModalActions.clearNewsDetails());
          console.log("Error:", err);
        });
    }
  };
  return { data, loading, error, addNews };
}

export default useAddNews
;
