import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { IRoot } from "../../../redux/interfaces";
import { useSelector } from "react-redux";

function useGetMedicines() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const refetchMedicine = useSelector((state:IRoot)=> state.medicineModal.refetchMedicine)
    const getMedicines = async () => {
        setLoading(true)
        const url = 'https://bhc-server.vercel.app/inventory';
        try {
            const response: AxiosResponse<{ status: string; data: any }> = await axios.get(url);
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
            getMedicines();
    }, [refetchMedicine]);

    return { data, loading, error, getMedicines };
}

export default useGetMedicines;
