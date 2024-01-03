import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';

type KeyContext = {
    secretKey: string | null;
    setSecretKey: Dispatch<SetStateAction<string | null>>;
    accessKey: string | null;
    setAccessKey: Dispatch<SetStateAction<string | null>>;
};

export const keyContext = createContext({} as KeyContext);

export function useKeys() {
    return useContext(keyContext);
};

export function KeyProvider({ children }: { children: ReactNode }) {
    const [accessKey, setAccessKey] = useState<string | null>(null);
    const [secretKey, setSecretKey] = useState<string | null>(null);

    const value = {
        secretKey,
        setSecretKey,
        accessKey,
        setAccessKey
    };

    return (
        <keyContext.Provider value={value}>
            {children}
        </keyContext.Provider>
    );
};