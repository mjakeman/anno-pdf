import {HandRaisedIcon} from "@heroicons/react/20/solid";
import {useContext, useEffect, useState} from "react";
import {ToolContext} from "../../Editor";
import Pan from "../model/tools/Pan";
interface Props {
    id: string
}
export default function PanTool({id} : Props) {

    const [panTool, setPanTool] = useState<Pan>(new Pan(id));

    const [activeToolData, setActiveToolData] = useContext(ToolContext);
    const [isActiveTool, setIsActiveTool] = useState(false);


    function handleClick() {
        setActiveToolData(panTool);
    }

    useEffect(() => {
        setIsActiveTool(activeToolData.id === id);
    }, [activeToolData]);

    return (
        <button onClick={handleClick} type="button" className={`${isActiveTool ? 'bg-gray-200 dark:bg-anno-space-900' : 'bg-white hover:bg-gray-200 dark:bg-anno-space-800 dark:hover:bg-anno-space-700'}  p-2 rounded-full transition-colors`}>
            <HandRaisedIcon className="w-7 h-7 text-white stroke-black stroke-[0.8]"/>
        </button>
    );
}