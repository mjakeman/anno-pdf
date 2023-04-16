import React from "react";

interface FilterButtonProps {
    onClick:  (params: any) => any;
    label: string,
    icon?: React.ReactNode,

}

export default function FilterButton({onClick, label, icon} : FilterButtonProps) {
    return (
        <button type="button"
                onClick={onClick}
                className={"py-1.5 px-4 text-gray-500 flex flex-row items-center content-center rounded-lg gap-1 text-lg transition-colors hover:bg-gray-100 border border-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"}
        >
            <span>{label}</span>
            {icon}
        </button>
    )
}