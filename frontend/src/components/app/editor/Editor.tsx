import {ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import MeasurementToolbar from "./toolbar/MeasurementToolbar";
import Viewer from "./Viewer";
import React, {useEffect, useState} from "react";
import EditorHeader from "./header/EditorHeader";
import FabricJSCanvas from "./FabricJSCanvas";
export const ToolContext = React.createContext<any[]>([]);

export default function Editor() {

    const [pageNumber, setPageNumber] = useState(1);
    const [selectedTool, setSelectedTool] = useState("pan");

    // TODO: Remove
    useEffect(() => {
        console.log(selectedTool);
    }, [selectedTool]);

    return (
        <ToolContext.Provider value={[selectedTool, setSelectedTool]}>

            <div className="h-screen flex flex-col">

                <EditorHeader/>

                {/* Toolbar */}
                <div className="absolute translate-y-2/3 left-1/2 -translate-x-1/2 overflow-visible z-50">
                    <MeasurementToolbar/>
                </div>

                {/* Document Space */}
                <main className="grow bg-zinc-300 dark:bg-anno-space-700">

                    <Viewer url="test.pdf" pageNumber={pageNumber}/>

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