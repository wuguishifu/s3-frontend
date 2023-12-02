import { createContext, useContext } from 'react';

type KeystoreContextType = {

};

const KeystoreContext = createContext({} as KeystoreContextType);

export default KeystoreContext;

export const useKeystore = () => useContext(KeystoreContext);

export const KeystoreProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <KeystoreContext.Provider value={{}}>
            {children}
        </KeystoreContext.Provider>
    );
};