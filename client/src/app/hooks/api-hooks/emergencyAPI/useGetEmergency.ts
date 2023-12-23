import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { IRoot } from "../../../redux/interfaces";
import { useSelector } from "react-redux";

function useGetEmergency() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const refetchEmergency = useSelector(
    (state: IRoot) => state.emergencyModal.refetchEmergency
  );
  const getEmergency = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/emergency";
    try {
      const response: any = await axios.get(url);
      console.log('responseemergency api:',response)
      if (response.status === 200) {
        setData(response.data);
      } else {
        setError(response.data.status);
      }
    } catch (err: any) {
      setError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getEmergency();
  }, [refetchEmergency]);

  return { data, loading, error, getEmergency };
}

export default useGetEmergency;
