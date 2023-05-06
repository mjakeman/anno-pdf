import Toolbar from "./toolbar/Toolbar";
import React, {useEffect, useState} from "react";
import EditorHeader from "./header/EditorHeader";
import Pan from "./toolbar/model/tools/Pan";
import Tool from "./toolbar/model/tools/Tool";
import DocumentViewer from "./DocumentViewer";
import {useParams} from "react-router-dom";
export const ToolContext = React.createContext<any[]>([]);
export const ZoomContext = React.createContext<any[]>([]);

export default function Editor() {

    const [activeToolData, setActiveToolData] = useState<Tool>(new Pan("pan"));
    const [zoom, setZoom] = useState(100); // Initial Zoom
    let  { documentUuid } = useParams();


    useEffect(() => {
        setActiveToolData(new Pan("pan"));
        console.log(documentUuid);
    }, []);

    return (
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
    );

}