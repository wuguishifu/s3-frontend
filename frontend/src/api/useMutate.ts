import { useState } from "react";
import { RequestConfig, useApi } from "./context";

export default function useMutate(endpoint: string) {
    const { request } = useApi();

    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const mutate = (body?: any, config?: RequestConfig) => {
        setLoading(true);
        request(endpoint, config, body)
            .then(({ data, status }) => {
                if (status > 299) {
                    console.error(data);
                    setError(data);
                } else {
                    setData(data);
                }
            })
    };

    return { data, error, loading, mutate };
}