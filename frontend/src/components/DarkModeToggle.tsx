import React, {useContext} from "react";
import {DarkModeContext} from "../App";
import {MoonIcon, SunIcon} from "@heroicons/react/24/solid";

export default function DarkModeToggle() {

    const [isDarkMode, setIsDarkMode] = useContext(DarkModeContext);

    const buttonColour = isDarkMode ? "bg-white hover:bg-gray-300"
        : "bg-anno-space-800 hover:bg-anno-space-900";

    return (
        <button className={`px-2 py-2 transition-colors rounded-full ${buttonColour}`} onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <SunIcon className="h-6 w-6 text-anno-red-secondary"/>
                : <MoonIcon className="h-6 w-6 text-white"/>}
        </button>
    );
}