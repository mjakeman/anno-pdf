import React from "react";
interface FullscreenButtonProps {
    onClick:  (params: any) => any;
    label: string,
    icon?: React.ReactNode,

}
export default function Fullscreen({onClick, label, icon} : FullscreenButtonProps){
    return (
        <button type="button"
                onClick={onClick}>
            <span>{label}</span>
            {icon}
        </button>
    )
}