import Fullscreen from "./Fullscreen"
import React, {useState} from "react";
import PrimaryButton from "./PrimaryButton";
import {UserPlusIcon} from "@heroicons/react/24/outline";
import SharePopup from "./SharePopup";


export default function App() {

    const [isDarkMode, setIsDarkMode] = useState(false);

    function toggleDarkMode() {
        // TODO: Add the localStorage and systemPreference when we have users + their reference
        isDarkMode ?   document.documentElement.classList.remove('dark') : document.documentElement.classList.add('dark');
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div className="h-screen flex flex-col">
            <div className="grow dark:bg-anno-space-700">
                <p>Layout Component goes here (everything else goes inside layout)?</p>
                <Fullscreen label={""} onClick={() => console.log('Clicked!')}/>

                {/*Share Button - TODO: Doesn't do anything at the moment*/}
                <PrimaryButton label={"Share"} icon={<UserPlusIcon className={"h-6 w-6"} />} onClick={() => console.log('Primary button Clicked!')}/>

                <SharePopup onSharePress={() => console.log('Shared button inside popup was pressed!')}/>
            </div>

            <footer className="justify-self-end bg-anno-red-primary p-8 flex flex-col items-center justify-center items-center gap-4 dark:bg-anno-red-secondary">
                <p className="text-white text-center">&copy; Anno 2023 | The University of Auckland | New Zealand </p>

                {/*TODO: Remove when we have users */}
                <button className="bg-gray-200 text-black px-3 py-2 transition-colors hover:bg-blue-200 rounded" onClick={() => toggleDarkMode()}>Toggle Dark Mode: {isDarkMode ? 'DARK' : 'LIGHT'}</button>
            </footer>
        </div>
    )
}