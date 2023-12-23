import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { IRoot } from "../../../redux/interfaces";
import { useSelector } from "react-redux";

function useGetDoctors() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const refetchDoctor = useSelector(
    (state: IRoot) => state.doctorModal.refetchDoctor
  );
  const getDoctors = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/doctors";
    try {
      const response: AxiosResponse<{ status: string; data: any }> =
        await axios.get(url, { withCredentials: true });
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
    getDoctors();
  }, [refetchDoctor]);

  return { data, loading, error, getDoctors };
}

export default useGetDoctors;
