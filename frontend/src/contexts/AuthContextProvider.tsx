import React, {useEffect, useState} from 'react'
import { auth } from '../firebaseAuth';
import { User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

interface CurrentUser {
    name: string,
    email: string,
    uid: string,
    firebaseUserRef: User
}


export const AuthContext = React.createContext<any[]>([]);;

interface ContainerProps {
    children: React.ReactNode,
}


export function AuthContextProvider({children}:ContainerProps){

    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    return (
        <AuthContext.Provider value={[currentUser, setCurrentUser]}>
            {children}
        </AuthContext.Provider>
    )

}