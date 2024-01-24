import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const CredentialsContext = createContext({} as CredentialsContext);

type CredentialsContext = {
    hasCheckedCredentials: boolean;
    accessKeyId: string | null;
    secretAccessKey: string | null;
    refresh: () => Promise<void>;
    loading: boolean;
    error: Error | null;
    setKeys: (keys: { accessKeyId: string, secretAccessKey: string }) => Promise<Error | null>;
    deleteKeys: () => Promise<Error | null>;
};

export function useCredentials() {
    return useContext(CredentialsContext);
};

export function CredentialsProvider({ children }: { children: ReactNode }): JSX.Element {
    const { currentUser } = useAuth();
    const [hasCheckedCredentials, setHasCheckedCredentials] = useState(false);
    const [accessKeyId, setAccessKeyId] = useState<string | null>(null);
    const [secretAccessKey, setSecretAccessKey] = useState<string | null>(null);
    const [error, setError] = useState<null | Error>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        refresh();
    }, [currentUser]);

    const refresh = useCallback(async () => {
        if (loading || !currentUser?.uid) return;
        setLoading(true);
        setHasCheckedCredentials(false);

        let data;
        try {
            const response = await fetch(`/api/aws/credentials/${currentUser.uid}`);
            data = await response.json();
            if (data.error) throw new Error(data.error);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) setError(error);
            else setError(new Error('An unknown error has occurred.'));
        } finally {
            setLoading(false);
            setHasCheckedCredentials(true);
        }

        setAccessKeyId(data.accessKeyId ?? null);
        setSecretAccessKey(data.secretAccessKey ?? null);
    }, [currentUser, loading]);

    const setKeys = useCallback(async (keys: { accessKeyId: string, secretAccessKey: string }) => {
        if (!currentUser?.uid) return null;

        let data;
        try {
            const response = await fetch(`/api/aws/credentials/${currentUser.uid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(keys)
            });
            data = await response.json();
            if (data.error) throw new Error(data.error);
        } catch (error) {
            return error instanceof Error ? error : new Error('An unknown error has occurred.');
        }

        setAccessKeyId(data.accessKeyId ?? null);
        setSecretAccessKey(data.secretAccessKey ?? null);
        return null;
    }, [currentUser, loading]);

    const deleteKeys = useCallback(async () => {
        if (!currentUser?.uid) return null;
        let data;
        try {
            const response = await fetch(`/api/aws/credentials/${currentUser.uid}`, { method: 'DELETE' });
            data = await response.json();
            if (data.error) throw new Error(data.error);
        } catch (error) {
            return error instanceof Error ? error : new Error('An unknown error has occurred.');
        }

        setAccessKeyId(null);
        setSecretAccessKey(null);
        return null;
    }, [currentUser, loading]);

    return (
        <CredentialsContext.Provider value={{
            hasCheckedCredentials,
            accessKeyId,
            secretAccessKey,
            refresh,
            loading,
            error,
            setKeys,
            deleteKeys
        }}>
            {children}
        </CredentialsContext.Provider>
    );
};