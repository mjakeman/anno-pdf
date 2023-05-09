import Toolbar from "./toolbar/Toolbar";
import React, {useEffect, useState} from "react";
import EditorHeader from "./header/EditorHeader";
import Pan from "./toolbar/model/tools/Pan";
import Tool from "./toolbar/model/tools/Tool";
import DocumentViewer from "./DocumentViewer";
import {useParams} from "react-router-dom";

import {ac} from "vitest/dist/types-0373403c";
export const ToolContext = React.createContext<any[]>([]);
export const ZoomContext = React.createContext<any[]>([]);
export const DocumentContext = React.createContext<any[]>([]);

// Match controller.ts in backend
export interface UserData {
    id: string,
    name: string,
    email: string,
}

export default function Editor() {

    const [activeToolData, setActiveToolData] = useState<Tool>(new Pan("pan"));
    const [zoom, setZoom] = useState(100); // Initial Zoom
    let  { documentUuid } = useParams();

    // TODO: replace with API call in (the parent component maybe, once the bigger 'Share' in top right of screen is clicked?)
    const testUsers = [
        {id: '0', name: 'John Doe', email: 'johndoe@gmail.com',},
        {id: '1', name: 'Alice Smith', email: 'alice@hotmail.com',},
        {id: '2', name: 'Charlie Hopkins', email: 'charlie@yahoo.com',},
        {id: '3', name: 'Bob Brown', email: 'bob@gmail.com',},
        {id: '4', name: 'David Mannings', email: 'david@yahoo.com',},
        {id: '5', name: 'Eve Post', email: 'eve@hotmail.com',},
    ];

    const [activeUsers, setActiveUsers] = useState<UserData[]>([]);
    const [sharedUsers, setSharedUsers] = useState<UserData[]>(testUsers);

    useEffect(() => {
        setActiveToolData(new Pan("pan"));
    }, []);

    const addActiveUser = (user: UserData) => {
        setActiveUsers(users => {
            users.push(user);
            return users;
        });
    };

    const removeActiveUser = (userId: string) => {
        setActiveUsers(users => {
            const obj = users.find(obj => obj.id == userId)!;
            const index = users.indexOf(obj);
            delete users[index];
            return users;
        });
    };

    return (
        <DocumentContext.Provider value={[activeUsers, addActiveUser, removeActiveUser, sharedUsers]}>
            <ToolContext.Provider value={[activeToolData, setActiveToolData]}>
                <ZoomContext.Provider value={[zoom, setZoom]}>
                    <div className="h-screen flex flex-col">

                        <EditorHeader/>

                        {/* Toolbar */}
                        <div className="fixed translate-y-2/3 left-1/2 -translate-x-1/2 overflow-visible z-50">
                            <Toolbar/>
                        </div>

                        {/* Document Space */}
                        <main className="grow bg-zinc-300 dark:bg-anno-space-700 overflow-y-hidden">

                            <DocumentViewer documentUuid={documentUuid}/>

                        </main>
                    </div>
                </ZoomContext.Provider>
            </ToolContext.Provider>
        </DocumentContext.Provider>
    );

}