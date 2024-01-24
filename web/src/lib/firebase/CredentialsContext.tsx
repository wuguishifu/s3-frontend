import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const AWSContext = createContext({} as AWSContext);

type AWSContext = {
    hasCheckedCredentials: boolean;
    refresh: () => Promise<void>;

    accessKeyId: string | null;
    secretAccessKey: string | null;
    setKeys: (keys: { accessKeyId: string, secretAccessKey: string }) => Promise<Error | null>;
    deleteKeys: () => Promise<Error | null>;

    defaultRegion: string | 'use-east-1';
    setDefaultRegion: (region: string) => Promise<Error | null>;
    resetDefaultRegion: () => Promise<Error | null>;
};

export function useAws() {
    return useContext(AWSContext);
};

export function AWSProvider({ children }: { children: ReactNode }): JSX.Element {
    const { currentUser } = useAuth();

    const [hasCheckedCredentials, setHasCheckedCredentials] = useState(false);

    const [accessKeyId, setAccessKeyId] = useState<string | null>(null);
    const [secretAccessKey, setSecretAccessKey] = useState<string | null>(null);

    const [region, setRegion] = useState<string | 'us-east-1'>('us-east-1');

    useEffect(() => {
        refresh();
    }, [currentUser]);

    const refresh = useCallback(async () => {
        if (!currentUser?.uid) return;
        setHasCheckedCredentials(false);

        try {
            await Promise.all([
                fetch(`/api/aws/credentials/${currentUser.uid}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) return console.error(data.error);
                        setAccessKeyId(data.accessKeyId ?? null);
                        setSecretAccessKey(data.secretAccessKey ?? null);
                    })
                    .catch(console.error),
                fetch(`/api/aws/default-region/${currentUser.uid}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) return console.error(data.error);
                        setRegion(data.defaultRegion ?? 'us-east-1');
                    })
                    .catch(console.error)
            ]);
        } finally {
            setHasCheckedCredentials(true);
        }
    }, [currentUser]);

    const setKeys = useCallback(async (keys: { accessKeyId: string, secretAccessKey: string }) => {
        if (!currentUser?.uid) return new Error('You must be signed in to set your AWS credentials');

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
    }, [currentUser]);

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
    }, [currentUser]);

    const setDefaultRegion = useCallback(async (region: string) => {
        if (!currentUser?.uid) return new Error('You must be signed in to set your default region');

        let data;
        try {
            const response = await fetch(`/api/aws/default-region/${currentUser.uid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ defaultRegion: region })
            });
            data = await response.json();
            if (data.error) throw new Error(data.error);
        } catch (error) {
            return error instanceof Error ? error : new Error('An unknown error has occurred.');
        }

        setRegion(data.defaultRegion ?? 'us-east-1');
        return null;
    }, [currentUser]);

    const resetDefaultRegion = useCallback(async () => {
        if (!currentUser?.uid) return new Error('You must be signed in to reset your default region');
        let data;
        try {
            const response = await fetch(`/api/aws/default-region/${currentUser.uid}`, { method: 'DELETE' });
            data = await response.json();
            if (data.error) throw new Error(data.error);
        } catch (error) {
            return error instanceof Error ? error : new Error('An unknown error has occurred.');
        }

        setRegion('us-east-1');
        return null;
    }, [currentUser]);

    return (
        <AWSContext.Provider value={{
            hasCheckedCredentials,
            refresh,

            accessKeyId,
            secretAccessKey,
            setKeys,
            deleteKeys,

            defaultRegion: region,
            setDefaultRegion,
            resetDefaultRegion
        }}>
            {children}
        </AWSContext.Provider>
    );
};