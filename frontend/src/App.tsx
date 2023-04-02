import Fullscreen from "./Fullscreen"
import React, {useState} from "react";
import PrimaryButton from "./PrimaryButton";
import {UserPlusIcon, ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/24/outline";
import MeasurementToolbar from "./MeasurementToolbar";
import Zoom from "./Zoom";
import SharePopup from "./SharePopup";
import ActiveUserBubbles from "./ActiveUserBubbles";
import Viewer from "./Viewer";

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
    const [pageNumber, setPageNumber] = useState(1);


    return (
        <div className="h-screen flex flex-col overflow-hidden justify-between">
            <header className="flex flex-row dark:bg-anno-space-700 border-b-2">
                <p>Layout Component goes here (everything else goes inside layout)?</p>

                <span className="grow"/>

                <Fullscreen label={""} onClick={() => console.log('Clicked!')}/>
                <Zoom />

                {/* Active Users */}
                <ActiveUserBubbles activeUsers={activeUsers} />

                {/* Share button*/}
                {/*TODO: add the ability to click anywhere from popup and close it*/}
                <div className="relative">
                <span>
                    {/*Share Button - TODO: Doesn't do anything at the moment*/}
                    <PrimaryButton label={"Share"} icon={<UserPlusIcon className={"h-6 w-6"} />} onClick={() => setShowSharePopup(!showSharePopup)}/>
                </span>
                <span className={`fixed right-0 mt-6 ${!showSharePopup ? "hidden" : "block"} `}>
                    <SharePopup onSharePress={() => console.log('Shared button inside popup was pressed!')} peopleSharedWith={testPeople}/>
                </span>
                </div>
            </header>

            {/* Toolbar */}
            <div className="absolute translate-y-2/3 left-1/2 -translate-x-1/2 overflow-visible z-50">
                <MeasurementToolbar onToolSelect={(tool)=>onToolSelect(tool)}></MeasurementToolbar>
            </div>

            {/* Document Space */}
            <main className="relative h-full max-h-full bg-zinc-300 dark:bg-zinc-800 overflow-hidden">
                <Viewer url="test.pdf" pageNumber={pageNumber}/>
                {/* TODO: Make react component */}
                <div className="absolute top-[50%] left-0 ml-4">
                    <button className="transition-all bg-black opacity-50 hover:opacity-70 rounded-full p-2" onClick={e => setPageNumber(pageNumber - 1)}>
                        <ArrowLeftIcon className="text-white h-6 w-6"/>
                    </button>
                </div>

                <div className="absolute top-[50%] right-0 mr-4">
                    <button className="transition-all bg-black opacity-50 hover:opacity-70 rounded-full p-2" onClick={e => setPageNumber(pageNumber + 1)}>
                        <ArrowRightIcon className="text-white h-6 w-6"/>
                    </button>
                </div>

            </main>

            {/*<footer className="bg-anno-red-primary p-8 flex flex-col items-center justify-center items-center gap-4 dark:bg-anno-red-secondary">
                <p className="text-white text-center">&copy; Anno 2023 | The University of Auckland | New Zealand </p>

                {/*TODO: Remove when we have users /}
                <button className="bg-gray-200 text-black px-3 py-2 transition-colors hover:bg-blue-200 rounded" onClick={() => toggleDarkMode()}>Toggle Dark Mode: {isDarkMode ? 'DARK' : 'LIGHT'}</button>
            </footer>*/}
        </div>
    )
}

function onToolSelect(tool: string) {
    console.log(tool);
}