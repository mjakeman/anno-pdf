import React from 'react'
import { User } from 'firebase/auth';
import {UserData} from "../components/app/editor/Editor";

interface AuthContext {
    currentUser: UserData | null;
    setCurrentUser: (user: UserData|null, firebase: User|null) => void;
    firebaseUserRef: User | null,
}

export const AuthContext = React.createContext<AuthContext>({
    currentUser: null,
    setCurrentUser: (_user) => {},
    firebaseUserRef: null,
});