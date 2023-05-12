import React, {createContext, useState} from 'react'
import {DocumentRecord} from "../components/app/dashboard/DashboardTable";

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