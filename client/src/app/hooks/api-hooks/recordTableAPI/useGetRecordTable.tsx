import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { IRoot } from "../../../redux/interfaces";
import { useSelector } from "react-redux";

function useGetRecordTable() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const refetchRecords = useSelector(
    (state: IRoot) => state.recordsModal.refetchRecords
  );
  const getRecordTable = async () => {
    setLoading(true);
    const url = 'https://bhc-server.vercel.app/record-table'
    try {
      const response: AxiosResponse<{ status: string; data: any }> =
        await axios.get(url);
        console.log('response:',response)
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
    getRecordTable();
  },[refetchRecords])

  return { data, loading, error, getRecordTable };
}

export default useGetRecordTable;
