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

/**
 * Main contexts we want available to all elements in the editor
 *  - ToolContext: Stores currently active tool(s)
 *  - ZoomContext: Stores pan and zoom data (currently unused)
 *  - DocumentContext: Stores a reference to document session data (e.g. active users)
 */
export const ToolContext = React.createContext<any[]>([]);
export const ZoomContext = React.createContext<any[]>([]);
export const DocumentContext = React.createContext<any[]>([]);

/**
 * The core editor component. Think of it as a 'bucket' for editor
 * related functionality.
 *
 * Look at #EditorHeader and #DocumentViewer
 */
export default function Editor() {

    /**
     * ToolContext
     */
    const [activeToolData, setActiveToolData] = useState<Tool>(new Select("select"));

    /**
     * Zoom Context
     */
    const [zoom, setZoom] = useState(100); // Initial Zoom

    /**
     * Document Context
     */
    const [activeUsers, setActiveUsers] = useState<AnnoUser[]>([]);

    /**
     * Misc
     */
    let  { documentUuid } = useParams();
    const {currentUser, firebaseUserRef} = useContext(AuthContext);
    const [document, setDocument] = useState<AnnoDocument | null>(null);
    const {addToast} = useToast();
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    /**
     * Handle authorised document retrieval
     */
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

    useEffect(() => {
        setActiveToolData(new Select("select"));
    }, []);

    /**
     * A peer has joined the session
     * @param user Joining user
     */
    const addActiveUser = (user: AnnoUser) => {
        setActiveUsers(users => {
            console.log(`pushed user, now: ${JSON.stringify([...users, user])}`);
            return [...users, user];
        });
    };

    /**
     * A peer has left the session
     * @param userId UserId of leaving user
     */
    const removeActiveUser = (userId: string) => {
        setActiveUsers(users => {
            const new_users = users.filter(obj => obj.uid !== userId);
            console.log(`removed user, now: ${JSON.stringify(new_users)}`);
            return new_users;
        });
    };

    /**
     * Clear all users in the session. Run this
     * when reconnecting/resetting the session.
     */
    const resetActiveUsers = () => {
        setActiveUsers([]);
    }

    return (
        <DocumentContext.Provider value={[activeUsers, addActiveUser, removeActiveUser, null, resetActiveUsers, document]}>
            <ToolContext.Provider value={[activeToolData, setActiveToolData]}>
                <ZoomContext.Provider value={[zoom, setZoom]}>
                    {document ?
                        <div className="h-screen flex flex-col">

                            {/* The top bar with title, document options, active users, and sharing controls */}
                            <EditorHeader annoDocument={document}/>

                            {/* Floating Toolbar */}
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

                                {/* Collaborative Whiteboard */}
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