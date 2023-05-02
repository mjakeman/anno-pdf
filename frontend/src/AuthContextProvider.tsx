import { list } from 'postcss';
import React, { useState } from 'react'
import { useEffect } from 'react'
import { auth } from './firebaseAuth'
import { User } from 'firebase/auth';

export const AuthContext = React.createContext<User | null>(null);;

interface ContainerProps {
    children: React.ReactNode,
}


export function AuthContextProvider({children}:ContainerProps){
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(()=>{
        const listen = auth.onAuthStateChanged((user)=>{
            if(user){
                setCurrentUser(user);
                console.log(user)
            }
            else{
                setCurrentUser(null);
            }
        });
        return (()=>{
        listen();
        }
        )
    },[])

    return (
        <AuthContext.Provider value={currentUser}>
            {children}
        </AuthContext.Provider>
    )

}