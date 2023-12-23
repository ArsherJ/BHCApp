import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { IAppointment, IRoot } from "../../../redux/interfaces";
import { useSelector } from "react-redux";

function useGetAppointment() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const refetchAppointment  = useSelector(
        (state: IRoot) => state.appointmentModal.refetchAppointment
      );
      
    const getAppointments = async () => {
        setLoading(true)
        const url = 'https://bhc-server.vercel.app/appointment';
        try {
            const response: AxiosResponse<{ status: string; data: any }> = await axios.get(url);
            console.log('RESPONSEEE:',response)
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
            getAppointments();
    }, [refetchAppointment]);

    return { data, loading, error, getAppointments };
}

export default useGetAppointment;
