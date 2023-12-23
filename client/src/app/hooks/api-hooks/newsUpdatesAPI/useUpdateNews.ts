import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { EnumAlerts, IRoot } from "../../../redux/interfaces";
import { useDispatch, useSelector } from "react-redux";
import {
  doctorModalActions,
  alertMessageActions,
  newsModalActions,
} from "../../../redux/store";
import {
  dataURItoBlob,
  isBase64JPEGDataURI,
  isBlobURL,
} from "../../../utilities/dataHelper";

function useUpdateNews
() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const newsDetails = useSelector(
    (state: IRoot) => state.newsModal.newsDetails
  );

  const updateNews = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/news-updates";
    const newsImage = newsDetails.image;
    if (isBlobURL(newsDetails.image)) {
      fetch(newsImage)
        .then((response) => response.blob())
        .then((blob) => {
          const headline = newsDetails.headline.replaceAll(" ", "").trim();
          const imageFile = new File([blob], `${headline}.jpg`, {
            type: "image/jpeg",
          });
          axios
            .put(
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
                    alertMessage: `Request Success, Updated News`,
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
              }, 6000);
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
    } else if (isBase64JPEGDataURI(newsImage)) {
      const imageBlob = dataURItoBlob(newsImage);
      const headline = newsDetails.headline.replaceAll(" ", "").trim();
      const imageFile = new File([imageBlob], `${headline}.jpg`, {
        type: "image/jpeg",
      });
      axios
        .put(
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
                alertMessage: `Request Success, Updated News`,
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
    } else {
      axios
        .put(url, newsDetails, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
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
                alertMessage: `Request Success, Updated News`,
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
    }
  };
  return { data, loading, error, updateNews };
}

export default useUpdateNews
;
