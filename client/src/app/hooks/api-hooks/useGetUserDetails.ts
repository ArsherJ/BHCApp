import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { IRoot } from "../../redux/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { userDetailsActions, userSettingsActions } from "@/app/redux/store";

function useGetUserDetails() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const refetchUserDetails = useSelector(
    (state: IRoot) => state.userSettings.refetchUser
  );
  const userDetails = useSelector(
    (state: IRoot) => state.userDetails.userDetails
  );
  const userSettingDetails = useSelector(
    (state: IRoot) => state.userSettings.userSettingsDetails
  );
  const userId = {
    user_id: userDetails.user_id,
    // other properties...
  };
  const getUserDetails = async () => {
    setLoading(true);
    const url = `https://bhc-server.vercel.app/user`;
    try {
      const response = await axios.get(url, {
        params: {
          user_id: userId,
        },
      });
      if (response.status === 200) {
        setData(response.data);
        console.log("RESPONSEEEUSERDEEETS:", response.data[0]);
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
        } = response.data[0];
        dispatch(
          userSettingsActions.setUserSettingsDetails({
            ...userSettingDetails,
            user_id: user_id,
            first_name: first_name,
            last_name: last_name,
            birthday: birthday,
            contact: contact,
            address: address,
            sex: sex,
            email: email,
            username: username,
          })
        );
        dispatch(
          userDetailsActions.setUserDetails({
            ...userDetails,
            isAuth: true,
            user_id: user_id,
            first_name: first_name,
            last_name: last_name,
            birthday: birthday,
            contact: contact,
            address: address,
            sex: sex,
            email: email,
            username: username,
            role: role,
          })
        );
      } else {
        setError(response.data.status);
      }
    } catch (err: any) {
      setError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUserDetails();
  }, [refetchUserDetails]);

  return { data, loading, error, getUserDetails };
}

export default useGetUserDetails;
