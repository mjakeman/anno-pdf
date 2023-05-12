import Toolbar from "./toolbar/Toolbar";
import React, {useContext, useEffect, useState} from "react";
import EditorHeader from "./header/EditorHeader";
import Tool from "./toolbar/model/tools/Tool";
import DocumentViewer from "./DocumentViewer";
import {useNavigate, useParams} from "react-router-dom";
import EditorSkeleton from "./EditorSkeleton";
import {AuthContext} from "../../../contexts/AuthContextProvider";
import {AnnoDocument, AnnoUser} from "./Models";
import axios from "axios";
import AnimatedSpinner from "../AnimatedSpinner";
import Select from "./toolbar/model/tools/Select";
import {useToast} from "../../../hooks/useToast";

export const ToolContext = React.createContext<any[]>([]);
export const ZoomContext = React.createContext<any[]>([]);
export const DocumentContext = React.createContext<any[]>([]);

export default function Editor() {

    const [activeToolData, setActiveToolData] = useState<Tool>(new Select("select"));
    const [zoom, setZoom] = useState(100); // Initial Zoom
    let  { documentUuid } = useParams();
    const {currentUser, firebaseUserRef} = useContext(AuthContext);
    const [document, setDocument] = useState<AnnoDocument | null>(null);
    const {addToast} = useToast();

    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!firebaseUserRef) return;
        firebaseUserRef!.getIdToken()
            .then((token) => {
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/documents/${documentUuid}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(function (response) {
                    setDocument({
                        uuid: response.data.uuid,
                        title: response.data.title,
                        createdAt: response.data.createdAt,
                        updatedAt: response.data.updatedAt,
                        base64File: response.data.base64file,
                        sharedWith: response.data.sharedWith, // Array of Users
                        owner: response.data.owner,
                        pages: []
                    });
                }).catch(function (error) {
                    navigate('/');
                    addToast({
                        message: 'Failed to fetch document',
                        type: 'error',
                    })
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentUser]);

    const [activeUsers, setActiveUsers] = useState<AnnoUser[]>([]);

    useEffect(() => {
        setActiveToolData(new Select("select"));
    }, []);

    const addActiveUser = (user: AnnoUser) => {
        setActiveUsers(users => {
            console.log(`pushed user, now: ${JSON.stringify([...users, user])}`);
            return [...users, user];
        });
    };

    const removeActiveUser = (userId: string) => {
        setActiveUsers(users => {
            const new_users = users.filter(obj => obj.uid !== userId);
            console.log(`removed user, now: ${JSON.stringify(new_users)}`);
            return new_users;
        });
    };

    const resetActiveUsers = () => {
        setActiveUsers([]);
    }

    return (
        <DocumentContext.Provider value={[activeUsers, addActiveUser, removeActiveUser, null, resetActiveUsers, document]}>
            <ToolContext.Provider value={[activeToolData, setActiveToolData]}>
                <ZoomContext.Provider value={[zoom, setZoom]}>
                    {document ?
                        <div className="h-screen flex flex-col">

                            <EditorHeader annoDocument={document}/>

                            {/* Toolbar */}
                            <div className="fixed translate-y-2/3 left-1/2 -translate-x-1/2 overflow-visible z-50">
                                <Toolbar/>
                            </div>

                            {/* Document Space */}
                            <main className="grow bg-zinc-300 dark:bg-anno-space-700 overflow-y-auto">

                                {!isLoaded &&
                                    <div className="grid place-items-center h-full ">
                                        <AnimatedSpinner className={"h-36 w-36 text-white"}/>
                                    </div>
                                }
                                <span className={`${isLoaded ? "block" : "hidden"} `}>
                                    <DocumentViewer onDocumentLoaded={() => setIsLoaded(true)} document={document} />
                            </span>
                            </main>
                        </div>
                        :
                        <EditorSkeleton/>
                    }
                </ZoomContext.Provider>
            </ToolContext.Provider>
        </DocumentContext.Provider>
    );

}