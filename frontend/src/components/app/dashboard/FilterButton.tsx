import React from "react";

interface Props {
    onClick:  (params: any) => any;
    label: string,
    icon?: React.ReactNode,
    isSelected: boolean
}

const selectedStyle = "bg-violet-200 border-indigo-400 text-indigo-700 hover:bg-violet-200 dark:bg-anno-pink-100 dark:border-anno-red-secondary dark:text-anno-red-primary dark:hover:bg-anno-pink-100 dark:text-gray-500"

export default function FilterButton({onClick, label, icon, isSelected} : Props) {
    return (
        <button type="button"
                onClick={onClick}
                className={`py-1 px-4 text-gray-500 flex flex-row gap-1 items-center content-center rounded-2xl font-bold text-lg transition-colors hover:bg-gray-200 dark:hover:text-gray-500 border-2 border-gray-300 dark:text-white 
                ${isSelected ? selectedStyle : ''}` }
        >
            {icon}
            <span>{label}</span>

        </button>
    )
}