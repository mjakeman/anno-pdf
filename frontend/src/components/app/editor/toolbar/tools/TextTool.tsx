import React, {useContext, useEffect, useRef, useState} from "react";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/24/solid";
import useDetectOutsideClick from "../../../../../hooks/useDetectOutsideClick";
import {ToolContext} from "../../Editor";
import TextModel from "../model/tools/TextModel";
import {useIsMount} from "../../../../../hooks/useIsMount";

interface Props {
    id: string,
}
export default function TextTool({id} : Props) {
    const [textTool, setTextTool] = useState<TextModel>(new TextModel(id, '#000000'));
    const isMount = useIsMount();
    const [activeToolData, setActiveToolData] = useContext(ToolContext);
    const [isActiveTool, setIsActiveTool] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const dropdown = useRef(null);
    useDetectOutsideClick(dropdown, () => setShowOptions(false));

    function handleColorSelect(selectedColor: string) {
        setTextTool((prevText : TextModel) => {
            const newText = new TextModel(prevText.id, prevText.color);
            // Watch for error (when we assign a color which isn't allowed)
            try {
                newText.color = selectedColor;
                return newText;
            } catch (e) {
                console.log(e);
                return prevText;
            }
        });
    }

    function handleClick() {
        setActiveToolData(textTool);
    }

    useEffect(() => {
        setIsActiveTool(activeToolData.id === id);
    }, [activeToolData.id]);

    useEffect(() => {
        if (!isMount) setActiveToolData(textTool);
    }, [textTool]);



    return (
        <span className="relative">
            <span className={`transition-all duration-300 flex flex-row items-center rounded-full ${isActiveTool ? 'border-2 bg-zinc-800' : 'bg-white dark:bg-transparent border-2 border-transparent'}`}>

                <button onClick={handleClick} type="button" className={`bg-white ${isActiveTool ? 'border-2' : 'border-transparent border hover:bg-gray-200 '} p-1 overflow-hidden rounded-full transition-colors dark:bg-anno-space-700`}>
                    <svg className="w-7 h-7" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="22" height="22" fill="#63D390"/>
                        <path d="M14.1484 5.72656C14.3255 5.72656 14.4505 5.76823 14.5234 5.85156C14.6016 5.92969 14.6406 6.0651 14.6406 6.25781V9.20312C14.6406 9.38542 14.5964 9.51562 14.5078 9.59375C14.4193 9.67188 14.2682 9.71094 14.0547 9.71094C13.8411 9.71094 13.6901 9.67188 13.6016 9.59375C13.513 9.51562 13.4688 9.38542 13.4688 9.20312V6.78906H11.3828V13.9375H13.2266C13.4036 13.9375 13.5286 13.9792 13.6016 14.0625C13.6797 14.1406 13.7188 14.276 13.7188 14.4688C13.7188 14.6615 13.6797 14.7995 13.6016 14.8828C13.5286 14.9609 13.4036 15 13.2266 15H8.36719C8.1901 15 8.0625 14.9609 7.98438 14.8828C7.91146 14.7995 7.875 14.6615 7.875 14.4688C7.875 14.276 7.91146 14.1406 7.98438 14.0625C8.0625 13.9792 8.1901 13.9375 8.36719 13.9375H10.2109V6.78906H8.125V9.20312C8.125 9.38542 8.08073 9.51562 7.99219 9.59375C7.90365 9.67188 7.7526 9.71094 7.53906 9.71094C7.32552 9.71094 7.17448 9.67188 7.08594 9.59375C6.9974 9.51562 6.95312 9.38542 6.95312 9.20312V6.25781C6.95312 6.0651 6.98958 5.92969 7.0625 5.85156C7.14062 5.76823 7.26823 5.72656 7.44531 5.72656H14.1484Z" fill="#312D45"/>
                    </svg>

                </button>
                {isActiveTool &&
                    <button onClick={() => setShowOptions(!showOptions)} type="button" className="text-white">
                        {showOptions ? <ChevronUpIcon className="w-6 h-6"/> : <ChevronDownIcon className="w-6 h-6"/>}
                    </button>
                }
            </span>
            {showOptions &&
                <div ref={dropdown} className="absolute mt-4 rounded-3xl border-2 border-stone-300 bg-zinc-800 flex flex-col gap-4 p-4 w-72">
                    <div className="grid grid-cols-6 gap-2">
                        {textTool.allowedColors.map((color, idx) => (
                            <div key={idx} onClick={() => handleColorSelect(color)} className={`${textTool.color === color ? 'border-2 border-pink-300' : 'border-transparent border-2'} transition-all h-8 w-8 rounded-full`} style={{backgroundColor: color}}>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </span>

    )
}