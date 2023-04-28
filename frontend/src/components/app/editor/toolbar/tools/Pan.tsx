import {HandRaisedIcon} from "@heroicons/react/20/solid";
import {useContext, useEffect, useState} from "react";
import {ToolContext} from "../../Editor";
interface Props {
    id: string
}
export default function Pan({id} : Props) {

    const [selectedTool, setSelectedTool] = useContext(ToolContext);
    const [isSelected, setIsSelected] = useState(false);


    function handlePanClick() {
        setSelectedTool(id);
    }

    useEffect(() => {
        setIsSelected(selectedTool === id);
    }, [selectedTool]);


    return (
        <button onClick={handlePanClick} type="button" className={`${isSelected ? 'bg-gray-200 dark:bg-anno-space-900' : 'bg-white hover:bg-gray-200 dark:bg-anno-space-800 dark:hover:bg-anno-space-700'}  p-2 rounded-full transition-colors`}>
            <HandRaisedIcon className="w-7 h-7 text-white stroke-black stroke-[0.8]"/>
        </button>
    );
}