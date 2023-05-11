import React, {createContext, useContext, useEffect, useState} from 'react'
import { auth } from '../firebaseAuth';
import { User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import {DocumentRecord} from "../components/app/dashboard/DashboardTable";
import useLocalStorage from "../hooks/useLocalStorage";

interface LoadedDocContext {
    documents: DocumentRecord[] | null;
    setDocuments: (documents: DocumentRecord[]) => void;
}

export const LoadedDocContext = createContext<LoadedDocContext>({
    documents: null,
    setDocuments: () => {},
});

interface Props {
    children: React.ReactNode,
}

export function LoadedDocsContextProvider({children}: Props){

    const [documents, setDocuments] = useState<DocumentRecord[] | null>(null);

    return (
        <LoadedDocContext.Provider value={{documents, setDocuments}}>
            {children}
        </LoadedDocContext.Provider>
    )

}