import { GoogleAuthProvider, User, UserCredential, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from 'sonner';
import { auth } from './';

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

    const timeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (hasCheckedAuth && timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = null;
        }
    }, [hasCheckedAuth]);

    useEffect(() => {
        timeout.current = setTimeout(() => toast.error('Failed to reach server. Please refresh the page.'), 1500);

        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
                timeout.current = null;
            }
        }
    }, []);

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