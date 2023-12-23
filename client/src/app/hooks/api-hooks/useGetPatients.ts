import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { IRoot } from "../../redux/interfaces";
import { useSelector } from "react-redux";

function useGetPatients() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const refetchPatients = useSelector(
    (state: IRoot) => state.registration.refetchPatients
  );
  const getPatients: any = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/patients";
    try {
      const response: AxiosResponse<{ status: string; data: any }> =
        await axios.get(url);
        console.log('responseL:',response)
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
    getPatients();
  }, [refetchPatients]);

  return { data, loading, error, getPatients };
}

export default useGetPatients;
