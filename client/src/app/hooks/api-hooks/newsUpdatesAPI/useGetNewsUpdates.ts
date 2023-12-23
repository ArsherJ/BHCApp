import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { IAppointment, IRoot } from "../../../redux/interfaces";
import { useSelector } from "react-redux";

function useGetNewsUpdates() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const refetchNews = useSelector(
    (state: IRoot) => state.newsModal.refetchNews
  );

  const getNewsUpdates = async () => {
    setLoading(true);
    const url = "https://bhc-server.vercel.app/news-updates";
    try {
      const response: AxiosResponse<{ status: string; data: any }> =
        await axios.get(url);
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
    getNewsUpdates();
  }, [refetchNews]);

  return { data, loading, error, getNewsUpdates };
}

export default useGetNewsUpdates;
