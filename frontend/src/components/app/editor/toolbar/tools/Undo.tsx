import {ArrowUturnLeftIcon} from "@heroicons/react/24/outline";
import {useContext} from "react";
import {ToolContext} from "../../Editor";

export default function Undo() {

    function handleUndoClick() {

    }

    return (
        <button onClick={handleUndoClick} type="button" className="bg-white hover:bg-gray-200 p-2 rounded-full transition-colors dark:hover:bg-anno-space-700 border-2">
            <ArrowUturnLeftIcon className={"w-6 h-6 text-zinc-500"}/>
        </button>
    )
}