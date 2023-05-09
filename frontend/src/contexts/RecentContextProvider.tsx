import React, {useEffect, useState} from 'react'
import { auth } from '../firebaseAuth';
import { User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import {DocumentRecord} from "../components/app/dashboard/DashboardTable";
import useLocalStorage from "../hooks/useLocalStorage";

const CIRCULAR_BUFFER_SIZE = 5;

interface RecentContext {
    recentDocBuffer: DocumentRecord[];
    clearDocBuffer: () => void;
    addToBuffer: (document: DocumentRecord) => void;
}

export const RecentContext  = React.createContext<RecentContext>({
    recentDocBuffer: [],
    clearDocBuffer: () => {},
    addToBuffer: () => {},
});

interface Props {
    children: React.ReactNode,
}


export function RecentContextProvider({children}: Props){

    const [recentDocBuffer, setRecentDocBuffer] = useLocalStorage('recent_documents', []);

    function addToBuffer(document: DocumentRecord) {
        const index = recentDocBuffer.findIndex((doc: DocumentRecord) => doc === document);
        const isAlreadyInBuffer = (index !== -1);
        if (isAlreadyInBuffer) {
            // Shift to front if its already in the buffer
            setRecentDocBuffer((prevBuffer: DocumentRecord[]) => {
                return [document, ...prevBuffer.slice(0, index), ...prevBuffer.slice(index + 1)].slice(0, CIRCULAR_BUFFER_SIZE);
            });
        } else {
            // Otherwise, add it as normal
            setRecentDocBuffer((prevBuffer: DocumentRecord[]) => {
                return [document, ...prevBuffer].slice(0, CIRCULAR_BUFFER_SIZE);
            });
        }
    }

    function clearDocBuffer() {
        setRecentDocBuffer([]);
    }


    return (
        <RecentContext.Provider value={{recentDocBuffer, clearDocBuffer, addToBuffer}}>
            {children}
        </RecentContext.Provider>
    )

}