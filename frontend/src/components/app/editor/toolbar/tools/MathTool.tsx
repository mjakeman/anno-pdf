import {useContext, useEffect, useState} from "react";
import {ToolContext} from "../../Editor";
import Maths from "../model/tools/Maths";
import {useIsMount} from "../../../../../hooks/useIsMount";

interface Props {
    id: string
}
export default function MathTool({id} : Props) {
    const isMount = useIsMount();
    const [mathTool, setMathTool] = useState<Maths>(new Maths(id));

    const [activeToolData, setActiveToolData] = useContext(ToolContext);
    const [isActiveTool, setIsActiveTool] = useState(false);

    function handleClick() {
        setActiveToolData(mathTool);
    }

    // Keep track of when the active tool is this tool
    useEffect(() => {
        setIsActiveTool(activeToolData.id === id);
    }, [activeToolData.id]);


    useEffect(() => {
        // Only set the active tool if this useEffect was NOT triggered by initial render
        if (!isMount) setActiveToolData(mathTool);
    }, [mathTool]);


    return (
        <button onClick={handleClick} type="button" className={`${isActiveTool ? 'bg-gray-200' : 'bg-white'} hover:bg-gray-200 dark:bg-anno-space-100 rounded-full transition-colors dark:hover:bg-anno-space-700 flex justify-center items-center overflow-hidden p-1.5`}>
            <svg className={"w-7 h-7"} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="22" height="22" fill="#E4DEFF"/>
                <path d="M13.7734 8.35938C13.9505 8.35938 14.0755 8.40104 14.1484 8.48438C14.2266 8.5625 14.2656 8.69792 14.2656 8.89062C14.2656 9.08333 14.2266 9.22135 14.1484 9.30469C14.0755 9.38281 13.9505 9.42188 13.7734 9.42188H7.82031C7.64323 9.42188 7.51562 9.38281 7.4375 9.30469C7.36458 9.22135 7.32812 9.08333 7.32812 8.89062C7.32812 8.69792 7.36458 8.5625 7.4375 8.48438C7.51562 8.40104 7.64323 8.35938 7.82031 8.35938H13.7734ZM13.7734 11.4844C13.9505 11.4844 14.0755 11.526 14.1484 11.6094C14.2266 11.6875 14.2656 11.8229 14.2656 12.0156C14.2656 12.2083 14.2266 12.3464 14.1484 12.4297C14.0755 12.5078 13.9505 12.5469 13.7734 12.5469H7.82031C7.64323 12.5469 7.51562 12.5078 7.4375 12.4297C7.36458 12.3464 7.32812 12.2083 7.32812 12.0156C7.32812 11.8229 7.36458 11.6875 7.4375 11.6094C7.51562 11.526 7.64323 11.4844 7.82031 11.4844H13.7734Z" fill="#312D45"/>
            </svg>
        </button>
    )
}