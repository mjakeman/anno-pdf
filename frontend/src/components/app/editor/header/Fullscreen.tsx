import React from "react";
import {ArrowsPointingOutIcon} from "@heroicons/react/24/solid";
interface FullscreenButtonProps {
    onClick:  (params: any) => any;
    label?: string,
}
export default function Fullscreen({onClick, label} : FullscreenButtonProps){
    return (
        <button type="button" onClick={onClick} className="border-2 p-1.5 rounded-full border-black dark:border-anno-space-100 hover:bg-anno-space-100 transition-colors">
            {label && <span>{label}</span>}
            <ArrowsPointingOutIcon className="h-6 w-6 text-black dark:text-white" />
        </button>
    )
}