import React, {createContext, useContext, useEffect, useState} from 'react'
import { auth } from '../firebaseAuth';
import { User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import {DocumentRecord} from "../components/app/dashboard/DashboardTable";
import useLocalStorage from "../hooks/useLocalStorage";
const CIRCULAR_BUFFER_SIZE = 5;

interface DocContext {
    documents: DocumentRecord[] | null;
    setDocuments: (documents: DocumentRecord[]) => void;
}

export const DocContext = createContext<DocContext>({
    documents: null,
    setDocuments: () => {},
});

interface Props {
    children: React.ReactNode,
}

export function DocContextProvider({children}: Props){

    const [documents, setDocuments] = useState<DocumentRecord[] | null>(null);

    return (
        <DocContext.Provider value={{documents, setDocuments}}>
            {children}
        </DocContext.Provider>
    )

}