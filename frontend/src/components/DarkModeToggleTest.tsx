import React, {useState} from "react";

export default function DarkModeToggleTest() {

    const [isDarkMode, setIsDarkMode] = useState(false);

    function toggleDarkMode() {
        // TODO: Add the localStorage and systemPreference when we have users + their reference
        isDarkMode ? document.documentElement.classList.remove('dark') : document.documentElement.classList.add('dark');
        setIsDarkMode(!isDarkMode);
    }

    return (
        <button className="bg-gray-200 text-black px-3 py-2 transition-colors hover:bg-blue-200 rounded" onClick={() => toggleDarkMode()}>Toggle Dark Mode: {isDarkMode ? 'DARK' : 'LIGHT'}</button>
    );
}