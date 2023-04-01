import Fullscreen from "./Fullscreen"
import React, {useState} from "react";
import PrimaryButton from "./PrimaryButton";
import {UserPlusIcon} from "@heroicons/react/24/outline";
import Zoom from "./Zoom";
import SharePopup from "./SharePopup";
import ActiveUserBubbles from "./ActiveUserBubbles";

export default function App() {

    const [isDarkMode, setIsDarkMode] = useState(false);

    function toggleDarkMode() {
        // TODO: Add the localStorage and systemPreference when we have users + their reference
        isDarkMode ?   document.documentElement.classList.remove('dark') : document.documentElement.classList.add('dark');
        setIsDarkMode(!isDarkMode);
    }

    // TODO: replace with API call in (the parent component maybe, once the bigger 'Share' in top right of screen is clicked?)
    const testPeople = [
        { id: 0, fullName: 'John Doe', email: 'johndoe@gmail.com', },
        { id: 1, fullName: 'Alice Smith', email: 'alice@hotmail.com', },
        { id: 2, fullName: 'Charlie Hopkins', email: 'charlie@yahoo.com', },
        { id: 3, fullName: 'Bob Brown', email: 'bob@gmail.com', },
        { id: 4, fullName: 'David Mannings', email: 'david@yahoo.com', },
        { id: 5, fullName: 'Eve Post', email: 'eve@hotmail.com', },
    ];

    // TODO: replace with the live set of active users which is changing.
    const activeUsers = [
        { id: 0, fullName: 'John Doe', email: 'johndoe@gmail.com', },
        { id: 1, fullName: 'Alice Smith', email: 'alice@hotmail.com', },
        { id: 2, fullName: 'Charlie Hopkins', email: 'charlie@yahoo.com', },
        { id: 3, fullName: 'Bob Brown', email: 'bob@gmail.com', },
        { id: 4, fullName: 'David Mannings', email: 'david@yahoo.com', },
    ];

    const [showSharePopup, setShowSharePopup] = useState(false);


    return (
        <div className="h-screen flex flex-col">
            <div className="grow dark:bg-anno-space-700">


                <p>Layout Component goes here (everything else goes inside layout)?</p>

                <Fullscreen label={""} onClick={() => console.log('Clicked!')}/>
                <Zoom />

                {/*Share Button - TODO: Doesn't do anything at the moment*/}
                <PrimaryButton label={"Share"} icon={<UserPlusIcon className={"h-6 w-6"} />} onClick={() => console.log('Clicked!')}/>

                {/* Active Users */}
                <ActiveUserBubbles activeUsers={activeUsers} />

                {/* Share button*/}
                {/*TODO: add the ability to click anywhere from popup and close it*/}
                <div className="relative">
                    <span className="absolute">
                        {/*Share Button - TODO: Doesn't do anything at the moment*/}
                        <PrimaryButton label={"Share"} icon={<UserPlusIcon className={"h-6 w-6"} />} onClick={() => setShowSharePopup(!showSharePopup)}/>
                    </span>
                    <span className={`absolute mt-12 ${!showSharePopup ? "hidden" : "block"} `}>
                        <SharePopup onSharePress={() => console.log('Shared button inside popup was pressed!')} peopleSharedWith={testPeople}/>
                    </span>
                </div>
            </div>

            <footer className="justify-self-end bg-anno-red-primary p-8 flex flex-col items-center justify-center items-center gap-4 dark:bg-anno-red-secondary">
                <p className="text-white text-center">&copy; Anno 2023 | The University of Auckland | New Zealand </p>

                {/*TODO: Remove when we have users */}
                <button className="bg-gray-200 text-black px-3 py-2 transition-colors hover:bg-blue-200 rounded" onClick={() => toggleDarkMode()}>Toggle Dark Mode: {isDarkMode ? 'DARK' : 'LIGHT'}</button>
            </footer>
        </div>
    )
}