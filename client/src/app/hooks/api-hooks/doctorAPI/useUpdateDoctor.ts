import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { EnumAlerts, IRoot } from "../../../redux/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { doctorModalActions, alertMessageActions } from "../../../redux/store";
import {
  dataURItoBlob,
  isBase64JPEGDataURI,
  isBlobURL,
} from "../../../utilities/dataHelper";

function useUpdateDoctor() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const doctorDetails = useSelector(
    (state: IRoot) => state.doctorModal.doctorDetails
  );

  const updateDoctor = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/doctors";
    const doctorImage = doctorDetails.image;
    console.log('doctorDetaails:',doctorDetails)
    if (isBlobURL(doctorDetails.image)) {
      fetch(doctorImage)
        .then((response) => response.blob())
        .then((blob) => {
          const doctorName = doctorDetails.name.replaceAll(" ", "").trim();
          const imageFile = new File([blob], `${doctorName}.jpg`, {
            type: "image/jpeg",
          });
          axios
            .put(
              url,
              { ...doctorDetails, image: imageFile },
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
                dispatch(doctorModalActions.toggleDoctorModal());
                dispatch(doctorModalActions.refetchDoctorsToggler());
                dispatch(alertMessageActions.setShowAlert(true));
                setTimeout(() => {
                  dispatch(alertMessageActions.setShowAlert(false));
                }, 4000);
                dispatch(
                  alertMessageActions.setAlertDetails({
                    alertType: EnumAlerts.SUCCESS,
                    alertMessage: `Request Success, Updated Doctor ${doctorDetails.name}'s Detail`,
                  })
                );
                dispatch(doctorModalActions.clearDoctorDetails());
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
        })
        .catch((error) => {
          setLoading(false);
          setError(error);
          console.error("Error fetching the blob:", error);
        });
    } else if (isBase64JPEGDataURI(doctorImage)) {
      const imageBlob = dataURItoBlob(doctorImage);
      const doctorName = doctorDetails.name.replaceAll(" ", "").trim();
      const imageFile = new File([imageBlob], `${doctorName}.jpg`, {
        type: "image/jpeg",
      });
      axios
        .put(
          url,
          { ...doctorDetails, image: imageFile },
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
            dispatch(doctorModalActions.toggleDoctorModal());
            dispatch(doctorModalActions.refetchDoctorsToggler());
            dispatch(alertMessageActions.setShowAlert(true));
            setTimeout(() => {
              dispatch(alertMessageActions.setShowAlert(false));
            }, 4000);
            dispatch(
              alertMessageActions.setAlertDetails({
                alertType: EnumAlerts.SUCCESS,
                alertMessage: `Request Success, Updated Doctor ${doctorDetails.name}'s Detail`,
              })
            );
            dispatch(doctorModalActions.clearDoctorDetails());
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
          dispatch(doctorModalActions.clearDoctorDetails());
          console.log("Error:", err);
        });
    } else {
      axios
        .put(url, doctorDetails, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.status === "Success") {
            setLoading(false);
            setData(data);
            dispatch(doctorModalActions.toggleDoctorModal());
            dispatch(doctorModalActions.refetchDoctorsToggler());
            dispatch(alertMessageActions.setShowAlert(true));
            setTimeout(() => {
              dispatch(alertMessageActions.setShowAlert(false));
            }, 4000);
            dispatch(
              alertMessageActions.setAlertDetails({
                alertType: EnumAlerts.SUCCESS,
                alertMessage: `Request Success, Updated Doctor ${doctorDetails.name}'s Detail`,
              })
            );
            dispatch(doctorModalActions.clearDoctorDetails());
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
          dispatch(doctorModalActions.clearDoctorDetails());
          console.log("Error:", err);
        });
    }
  };
  return { data, loading, error, updateDoctor };
}

export default useUpdateDoctor;
