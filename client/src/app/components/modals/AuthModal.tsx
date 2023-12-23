"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import the eye and eye-slash icons from react-icons
import { useDispatch, useSelector } from "react-redux";
import {
  authModalActions,
  globalLoadingActions,
  userAuthActions,
  userDetailsActions,
} from "../../redux/store";
import axios from "axios";
import { IRoot } from "../../redux/interfaces";

const AuthModal = () => {
  const authValues = useSelector((state: IRoot) => state.userAuth.authValues);
  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const globalLoading = useSelector(
    (state: IRoot) => state.globalLoading.globalLoading
  );

  axios.defaults.withCredentials = true;
  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!authValues.username.length) {
      setLoginError("Username is Required");
      return;
    }
    if (!authValues.password.length) {
      setLoginError("Password is Required");
      return;
    }
    dispatch(globalLoadingActions.setGlobalLoading(true));

    try {
      axios
        .post("https://bhc-server.vercel.app/login", authValues)
        .then((res) => {
          console.log("login response: ", res.data.status);
          if (res.data.status === "Success") {
            axios
              .get("https://bhc-server.vercel.app/verify")
              .then((res) => {
                console.log("VERIFICATION LOGIN:", res);
                if (res.data.status === "Success") {
                  const {
                    user_id,
                    first_name,
                    last_name,
                    birthday,
                    contact,
                    address,
                    sex,
                    email,
                    username,
                    role,
                  } = res.data;
                  dispatch(
                    userDetailsActions.setUserDetails({
                      isAuth: true,
                      user_id: user_id,
                      firstName: first_name,
                      lastName: last_name,
                      birthday: birthday,
                      contact: contact,
                      address: address,
                      sex: sex,
                      email: email,
                      username: username,
                      role: role,
                    })
                  );
                  dispatch(globalLoadingActions.setGlobalLoading(false));
                  dispatch(authModalActions.toggleAuthModal());
                  router.replace("/dashboard");
                } else {
                  console.log(`verification error1:  ${res.data.error}`);
                }
              })
              .catch((err) => {
                dispatch(globalLoadingActions.setGlobalLoading(false));
                // setLoginError(err);
                console.log("verification error2: ", err);
              });
          } else {
            dispatch(globalLoadingActions.setGlobalLoading(false));
            setLoginError(res.data.error);
            console.log(`login error:  ${res.data.error}`);
          }
        })
        .catch((err) => {
          dispatch(globalLoadingActions.setGlobalLoading(false));
          setLoginError("Database connection error");
          console.log(err);
        });
    } catch (err: any) {
      dispatch(globalLoadingActions.setGlobalLoading(false));
      const error = err.toString();
      console.log(`ERROR: ${error}`);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div
        className="absolute inset-0 bg-black backdrop-blur-lg opacity-40"
        onClick={() => dispatch(authModalActions.toggleAuthModal())}
      />
      <div
        className="card shadow-lg md:w-[50%] sm:w-[70%] w-[85%] xl:w-[30%] flex text-black border-2 border-primary bg-[#ffffff]"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="card-body ">
            <h1 className="card-title text-center flex flex-col font-bold justify-center text-black">
              Authentication
            </h1>
            {loginError && (
              <span className="text-[13px] text-center text-red-500">
                <span className="bg-red-100 rounded-md py-1 px-2">
                  {loginError}
                </span>
              </span>
            )}
            <div className="mb-4">
              <label className="label font-bold text-black">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="input input-bordered input-black w-full"
                value={authValues.username}
                onChange={(e) =>
                  dispatch(
                    userAuthActions.setAuthValues({
                      ...authValues,
                      username: e.target.value,
                    })
                  )
                }
              />
            </div>

            <div className="mb-4">
              <label className="label font-bold text-black">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input input-bordered input-black w-full"
                  value={authValues.password}
                  onChange={(e) =>
                    dispatch(
                      userAuthActions.setAuthValues({
                        ...authValues,
                        password: e.target.value,
                      })
                    )
                  }
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full border-opacity-50">
              <button
                className="btn btn-primary btn-active:bg-accent w-full mb-2"
                onClick={handleSubmit}
              >
                Login
              </button>
              <div className="flex flex-col sm:flex-row justify-center items-center text-center gap-3 mt-3">
                No Account yet?{" "}
                <Link
                  prefetch
                  href="#About"
                  className="text-primary hover:border-b-2 duration-150 border-primary font-extrabold"
                  onClick={() => dispatch(authModalActions.toggleAuthModal())}
                >
                  Contact Admin
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
