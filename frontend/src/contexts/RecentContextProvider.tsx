import React, {useContext, useEffect} from 'react'
import {DocumentRecord} from "../components/app/dashboard/DashboardTable";
import useLocalStorage from "../hooks/useLocalStorage";
import {LoadedDocContext} from "./LoadedDocsContextProvider";

const CIRCULAR_BUFFER_SIZE = 5;

interface RecentContext {
    recentDocBuffer: DocumentRecord[];
    clearDocBuffer: () => void;
    addToBuffer: (document: DocumentRecord) => void;
    removeFromBuffer: (document: DocumentRecord) => void;

    filterNotAllowedDocuments: () => void;
}

export const RecentContext  = React.createContext<RecentContext>({
    recentDocBuffer: [],
    clearDocBuffer: () => {},
    addToBuffer: () => {},
    removeFromBuffer: () => {},
    filterNotAllowedDocuments: () => {},
});

interface Props {
    children: React.ReactNode,
}


export function RecentContextProvider({children}: Props){

    const [recentDocBuffer, setRecentDocBuffer] = useLocalStorage('recent_documents', []);
    const {documents} = useContext(LoadedDocContext);

    function addToBuffer(document: DocumentRecord) {
        const index = recentDocBuffer.findIndex((doc: DocumentRecord) => doc.uuid === document.uuid);
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

    function removeFromBuffer(document: DocumentRecord) {
        const index = recentDocBuffer.findIndex((doc: DocumentRecord) => doc === document);
        if (index !== -1) {
            setRecentDocBuffer([...recentDocBuffer.splice(index, 1)]);
        }
    }

    function filterNotAllowedDocuments() {
        if (!documents) return false;
        recentDocBuffer.map((document: DocumentRecord) => {

            const isInDocumentList = (documents.findIndex((doc: DocumentRecord) => doc.uuid === document.uuid)) !== -1;
            if (!isInDocumentList) {
                console.log(document);
                removeFromBuffer(document);
            }
        })
    }

    useEffect(() => {
        filterNotAllowedDocuments();
    }, [documents]);

    useEffect(() => {
        console.log(recentDocBuffer);
    }, [recentDocBuffer]);



    return (
        <RecentContext.Provider value={{recentDocBuffer, clearDocBuffer, addToBuffer, removeFromBuffer, filterNotAllowedDocuments}}>
            {children}
        </RecentContext.Provider>
    )

}