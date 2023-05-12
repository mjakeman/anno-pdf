import React from 'react'
import {User} from 'firebase/auth';
import {AnnoUser} from "../components/app/editor/Models";

interface AuthContext {
    currentUser: AnnoUser | null;
    setCurrentUser: (user: AnnoUser|null, firebase: User|null) => void;
    firebaseUserRef: User | null,
}

export const AuthContext = React.createContext<AuthContext>({
    currentUser: null,
    setCurrentUser: (_user) => {},
    firebaseUserRef: null,
});