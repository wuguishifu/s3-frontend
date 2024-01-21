import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { auth } from './';
import { User, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, onAuthStateChanged, UserCredential, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const AuthContext = createContext({} as AuthContext);

type AuthContext = {
    hasCheckedAuth: boolean;
    currentUser: User | null;
    signup: (email: string, password: string) => Promise<UserCredential>;
    login: (email: string, password: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    signInWithGoogle: () => Promise<UserCredential>;
};

export function useAuth() {
    return useContext(AuthContext);
};

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setHasCheckedAuth(true);
        });

        return unsubscribe;
    }, []);

    async function signup(email: string, password: string) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    async function login(email: string, password: string) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    async function logout() {
        return signOut(auth);
    }

    async function resetPassword(email: string) {
        return sendPasswordResetEmail(auth, email);
    }

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    const value = {
        hasCheckedAuth,
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        signInWithGoogle
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};