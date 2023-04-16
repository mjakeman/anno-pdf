import React, {useContext} from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import {DarkModeContext} from "../App";

export default function DarkModeToggleTest() {

    const [isDarkMode, setIsDarkMode] = useContext(DarkModeContext);

    return (
        <button className="bg-gray-200 text-black px-3 py-2 transition-colors hover:bg-blue-200 rounded" onClick={() => setIsDarkMode(!isDarkMode)}>Toggle Dark Mode: {isDarkMode ? 'DARK' : 'LIGHT'}</button>
    );
}