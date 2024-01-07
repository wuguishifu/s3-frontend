import { createContext, useContext, useState } from 'react';
import endpoints from './endpoints';

type ApiContext = {

};

const apiContext = createContext({} as ApiContext);

export const useApi = () => useContext(apiContext);
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);

    return (
        <apiContext.Provider value={{}}>
            {children}
        </apiContext.Provider>
    );
}