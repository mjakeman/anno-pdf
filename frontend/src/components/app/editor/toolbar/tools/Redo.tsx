import {ArrowUturnRightIcon} from "@heroicons/react/24/outline";
import {useContext} from "react";
import {ToolContext} from "../../Editor";

export default function Redo() {

    function handleRedoClick() {

    }

    return (
        <button type="button" onClick={handleRedoClick} className="bg-white hover:bg-gray-200 p-2 rounded-full transition-colors dark:hover:bg-anno-space-700 border-2">
            <ArrowUturnRightIcon className={"w-6 h-6 text-zinc-500"}/>
        </button>
    )
}