import React, {useEffect, useState} from 'react'
import { auth } from '../firebaseAuth';
import { User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export interface CurrentUser {
    name: string,
    email: string,
    uid: string,
    firebaseUserRef: User
}

interface AuthContext {
    currentUser: CurrentUser | null;
    setCurrentUser: (user: CurrentUser | null) => void;
    firebaseUserRef: User | null,
}

export const AuthContext = React.createContext<AuthContext>({
    currentUser: null,
    setCurrentUser: () => {},
    firebaseUserRef: null,
});

interface ContainerProps {
    children: React.ReactNode,
}


/*export function AuthContextProvider({children}:ContainerProps){

    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    return (
        <AuthContext.Provider value={[currentUser, setCurrentUser]}>
            {children}
        </AuthContext.Provider>
    )

}*/