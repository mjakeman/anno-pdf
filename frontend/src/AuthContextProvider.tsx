import React from 'react'
import { auth } from './firebaseAuth'
import { User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';


export const AuthContext = React.createContext<User | null | undefined>(null);;

interface ContainerProps {
    children: React.ReactNode,
}


export function AuthContextProvider({children}:ContainerProps){
    const [user, loading] = useAuthState(auth);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    )

}