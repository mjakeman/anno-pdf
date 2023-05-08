import DashboardTable, {DocumentRecord} from "./DashboardTable";
import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthContext} from "../../../contexts/AuthContextProvider";


export default function Dashboard() {

    const [documents, setDocuments] = useState<DocumentRecord[] | null>(null);
    const {currentUser, firebaseUserRef} = useContext(AuthContext);


    useEffect(() => {
        if (!firebaseUserRef) return;
            firebaseUserRef!.getIdToken().then((token) => {
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/documents`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    let docs = response.data;
                    let savedDocs : DocumentRecord[]    = [];
                    docs.map((doc: any) => {
                        const savedDoc : DocumentRecord = {
                            lastupdated: doc.updatedAt,
                            name: doc.title,
                            owner: doc.owner.uid === currentUser!.uid ? "Me" : doc.owner.name,
                            uuid: doc.uuid,
                        }
                        savedDocs.push(savedDoc);
                    })
                    setDocuments(savedDocs);
                }).catch(error => {
                    console.log(error);
                })
            });
    }, [firebaseUserRef]);

    return (
        <div className="mx-12 flex flex-col gap-4" id="portal-destination">
            <h1 className="text-anno-red-primary text-4xl font-bold dark:text-anno-pink-500">Documents</h1>
            {documents
                ?
                    <DashboardTable documentData={documents}/>
                :
                <div className="grow grid place-items-center h-full w-full">
                    <svg className="animate-spin h-16 w-16 text-blue-500" xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                </div>
            }
        </div>

    );
}

function uploadPDF() {
    console.log("Upload PDF")
}