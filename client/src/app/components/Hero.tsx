import React from "react";
import AuthModal from "./modals/AuthModal";
import RegistrationCard from "./RegistrationCard";
import { useDispatch } from "react-redux";
import { authModalActions } from "../redux/store";
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";

const Hero = () => {
  const dispatch = useDispatch()
  return (
    <div
      className={`grid md:px-[120px] sm:px-[60px] px-[20px] grid-cols-2  lg:grid-cols-3 min-h-screen justify-center items-center relative`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-[url('/BHCBackground.png')] origin-right  bg-cover bg-no-repeat bg-center"
        style={{ zIndex: 1 }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#000000cc] to-transparent z-[2]" />

      <div className="col-span-2 border-2 border-opacity-30 border-gray-100 rounded-md p-4 bg-black bg-opacity-30 text-start justify-center items-center mb-12 relative z-[3]">
        <h5 className="text-white ">
          <span
            className="text-shadow-black md:text-[45px] text-[30px]"
            style={{
              textShadow: "3px 3px 6px rgba(0, 0, 0, 0.975)",
            }}
          >
            Empowering Local
            <span className="text-secondary"> Healthcare</span>
          </span>
        </h5>
        <p
          className="text-white mt-1 px-0"
          style={{
            textShadow: "3px 3px 6px rgba(0, 0, 0, 0.975)",
          }}
        >
          Unlock convenient <span className="text-secondary">healthcare</span>{" "}
          access through our website, schedule appintments now.
        </p>
       
      </div>
    </div>
  );
};

export default Hero;
