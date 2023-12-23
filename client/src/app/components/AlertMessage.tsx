import React from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineClose,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { EnumAlerts, IRoot } from "../redux/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { alertMessageActions } from "../redux/store";

const AlertMessage = () => {
  const dispatch = useDispatch();
  const showAlert = useSelector((state: IRoot) => state.alertMessage.showAlert);
  const alertDetails = useSelector(
    (state: IRoot) => state.alertMessage.alertDetails
  );
  const { alertType, alertMessage } = alertDetails;
  return (
    <div
      className={`fixed duration-500 ease-in-out shadow-2xl ${
        showAlert
          ? `bottom-[6vh] z-40 left-[2vw] scale-[1]`
          : `bottom-[6vh] z-40 left-[2vw] scale-[0]`
      } max-w-fit alert ${
        alertType === EnumAlerts.SUCCESS
          ? `alert-success`
          : alertType === EnumAlerts.ERROR
          ? `alert-error `
          : "bg-black"
      } `}
    >
      {alertType === EnumAlerts.SUCCESS ? (
        <AiOutlineCheckCircle size={20} />
      ) : (
        <AiOutlineCloseCircle size={20} />
      )}
      <span>{alertMessage}</span>
      <button
        className="hover:text-red duration-75 hover:scale-110"
        onClick={() => dispatch(alertMessageActions.setShowAlert(false))}
      >
        <AiOutlineClose size={20} />
      </button>
    </div>
  );
};

export default AlertMessage;
