import { useState, useEffect } from "react";
import { useApi } from "./context";

export default function useFetch<T>(endpoint: string) {
    const { request } = useApi();

    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        request(endpoint)
            .then(({ data, status }) => {
                if (status > 299) {
                    console.error(data);
                    setError(data);
                } else {
                    setData(data);
                }
            })
    }, [endpoint]);

    return { data, error, loading };
};