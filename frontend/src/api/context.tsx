import { createContext, useContext } from 'react';
import endpoints from './endpoints';

export type RequestConfig = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
}

type ApiContextType = {
    request: (
        endpoint: string,
        config?: RequestConfig,
        body?: any
    ) => Promise<{ status: number, data: any }>

    endpoints: typeof endpoints
};

const ApiContext = createContext({} as ApiContextType);

export default ApiContext;

export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    async function request(
        endpoint: string,
        config?: RequestConfig,
        body?: any
    ): Promise<{ status: number, data: any }> {
        let response;
        try {
            response = await fetch(endpoint, {
                method: config?.method ?? 'GET',
                headers: {
                    ...(body && { 'Content-Type': 'application/json' })
                },
                body: JSON.stringify(body),
            });
        } catch (error) {
            return { status: 500, data: error };
        }
        const data = await response.json();
        return { status: response.status, data };
    }

    return (
        <ApiContext.Provider value={{ request, endpoints }}>
            {children}
        </ApiContext.Provider>
    );
};