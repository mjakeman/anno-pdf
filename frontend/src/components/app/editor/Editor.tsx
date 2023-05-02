import Toolbar from "./toolbar/Toolbar";
import React, {useEffect, useState} from "react";
import EditorHeader from "./header/EditorHeader";
import FabricJSCanvas from "./FabricJSCanvas";
import Pan from "./toolbar/model/tools/Pan";
import Eraser from "./toolbar/model/tools/Eraser";
import Tool from "./toolbar/model/tools/Tool";
import DocumentViewer from "./DocumentViewer";
export const ToolContext = React.createContext<any[]>([]);

export default function Editor() {

    const [pageNumber, setPageNumber] = useState(1);
    const [activeToolData, setActiveToolData] = useState<Tool>(new Pan("pan"));

    useEffect(() => {
        setActiveToolData(new Pan("pan"));
    }, []);

    return (
        <ToolContext.Provider value={[activeToolData, setActiveToolData]}>

            <div className="h-screen flex flex-col">

                <EditorHeader/>

                {/* Toolbar */}
                <div className="fixed translate-y-2/3 left-1/2 -translate-x-1/2 overflow-visible z-50">
                    <Toolbar/>
                </div>

                {/* Document Space */}
                <main className="grow bg-zinc-300 dark:bg-anno-space-700">

                    <DocumentViewer documentUuid={"test"}/>

                </main>
            </div>
        </ToolContext.Provider>
    );

}