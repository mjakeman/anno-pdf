import {ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Toolbar from "./toolbar/Toolbar";
import Viewer from "./Viewer";
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
                    {/* TODO: Make react component */}
                    <div className="absolute top-[50%] left-0 ml-4">
                        <button className="transition-all bg-black opacity-50 hover:opacity-70 rounded-full p-2" onClick={e => setPageNumber(pageNumber - 1)}>
                            <ArrowLeftIcon className="text-white h-6 w-6"/>
                        </button>
                    </div>

                    <div className="absolute top-[50%] right-0 mr-4">
                        <button className="transition-all bg-black opacity-50 hover:opacity-70 rounded-full p-2" onClick={e => setPageNumber(pageNumber + 1)}>
                            <ArrowRightIcon className="text-white h-6 w-6"/>
                        </button>
                    </div>

                </main>

                {/*<div className="justify-self-end">*/}
                {/*    <EditorFooter />*/}
                {/*</div>*/}
            </div>
        </ToolContext.Provider>
    );

}