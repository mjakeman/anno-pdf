import React from "react";
import {ArrowsPointingOutIcon} from "@heroicons/react/20/solid";
interface FullscreenButtonProps {
    onClick:  (params: any) => any;
    label: string,
}
export default function Fullscreen({onClick, label} : FullscreenButtonProps){
    return (
        <button type="button"
                onClick={onClick}>
            <span>{label}</span>
            <ArrowsPointingOutIcon className="h-7 w-7 p-1 border-2 rounded-full border-black" />
        </button>
    )
}