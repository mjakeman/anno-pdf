import React from "react";

interface PrimaryButtonProps {
    onClick:  (params: any) => any;
    label: string,
    icon?: React.ReactNode,

}

export default function PrimaryButton({onClick, label, icon} : PrimaryButtonProps) {
    return (
        <button type="button"
                onClick={onClick}
                className={"bg-anno-red-primary py-2 px-4 text-white flex flex-row items-center content-center rounded-lg gap-1 text-lg transition-colors hover:bg-anno-red-secondary"}
        >
            <span>{label}</span>
            {icon}
        </button>
    )
}