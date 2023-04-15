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
                className={"bg-anno-red-primary py-1.5 px-4 text-white flex flex-row items-center justify-center rounded-lg gap-1 text-lg transition-colors hover:bg-anno-red-secondary dark:bg-anno-red-secondary dark:hover:bg-anno-pink-500"}
        >
            <span>{label}</span>
            {icon}
        </button>
    )
}