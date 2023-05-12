import DashboardTable, {DocumentRecord} from "./DashboardTable";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthContext} from "../../../contexts/AuthContextProvider";
import { LoadedDocContext} from "../../../contexts/LoadedDocsContextProvider";
import AnimatedSpinner from "../AnimatedSpinner";


export default function Dashboard() {

    const {documents, setDocuments} = useContext(LoadedDocContext);
    const {currentUser, firebaseUserRef} = useContext(AuthContext);
    const [loading, setLoading] = useState(true); 

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
                            lastUpdated: doc.updatedAt,
                            name: doc.title,
                            owner: doc.owner.uid === currentUser!.uid ? "Me" : doc.owner.name,
                            uuid: doc.uuid,
                        }
                        savedDocs.push(savedDoc);
                    })
                    setDocuments(savedDocs);
                    setLoading(false); 
                }).catch(error => {
                    console.log(error);
                    setLoading(false);
                })
            });
    }, [firebaseUserRef, currentUser]);

    return (
        <div className="mx-12 flex flex-col gap-4" id="portal-destination">
            <h1 className="text-anno-red-primary text-4xl font-bold dark:text-anno-pink-500">Documents</h1>
            {documents && !loading
                ?
                    <DashboardTable documentData={documents}/>
                :
                <div className="grow grid place-items-center h-full w-full">
                    <AnimatedSpinner className="h-16 w-16 text-blue-500"/>
                </div>
            }
        </div>

    );
}

function uploadPDF() {
    console.log("Upload PDF")
}