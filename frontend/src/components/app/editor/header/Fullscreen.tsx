import React from "react";
import {ArrowsPointingOutIcon} from "@heroicons/react/24/solid";
interface FullscreenButtonProps {
    onClick:  (params: any) => any;
    label?: string,
}
export default function Fullscreen({onClick, label} : FullscreenButtonProps){
    return (
        <button type="button" onClick={onClick}>
            {label && <span>{label}</span>}
            <ArrowsPointingOutIcon className="h-10 w-10 p-1.5 border-2 rounded-full border-black dark:border-white dark:text-white" />
        </button>
    )
}