import ActionMenu from "./ActionMenu";
import Fullscreen from "./Fullscreen";
import Zoom from "./Zoom";
import ActiveUserBubbles from "./ActiveUserBubbles";
import PrimaryButton from "../../../PrimaryButton";
import {UserPlusIcon} from "@heroicons/react/24/outline";
import SharePopup from "../../share/popup/SharePopup";
import React, {useState} from "react";

export default function EditorHeader() {


    const [isDarkMode, setIsDarkMode] = useState(false);

    function toggleDarkMode() {
        // TODO: Add the localStorage and systemPreference when we have users + their reference
        isDarkMode ? document.documentElement.classList.remove('dark') : document.documentElement.classList.add('dark');
        setIsDarkMode(!isDarkMode);
    }

    // TODO: replace with API call in (the parent component maybe, once the bigger 'Share' in top right of screen is clicked?)
    const testPeople = [
        {id: 0, fullName: 'John Doe', email: 'johndoe@gmail.com',},
        {id: 1, fullName: 'Alice Smith', email: 'alice@hotmail.com',},
        {id: 2, fullName: 'Charlie Hopkins', email: 'charlie@yahoo.com',},
        {id: 3, fullName: 'Bob Brown', email: 'bob@gmail.com',},
        {id: 4, fullName: 'David Mannings', email: 'david@yahoo.com',},
        {id: 5, fullName: 'Eve Post', email: 'eve@hotmail.com',},
    ];

    // TODO: replace with the live set of active users which is changing.
    const activeUsers = [
        {id: 0, fullName: 'John Doe', email: 'johndoe@gmail.com',},
        {id: 1, fullName: 'Alice Smith', email: 'alice@hotmail.com',},
        {id: 2, fullName: 'Charlie Hopkins', email: 'charlie@yahoo.com',},
        {id: 3, fullName: 'Bob Brown', email: 'bob@gmail.com',},
        {id: 4, fullName: 'David Mannings', email: 'david@yahoo.com',},
    ];

    // TODO: change to actual documentDetails
    const testDocumentName = 'Employment Contract w/ UoA';
    const testLastUpdated = 'Last updated 23 Feb 2023 at 11:04am by me';

    const [showSharePopup, setShowSharePopup] = useState(false);

    return (
        <header className="fixed bg-white border-b-[1px] border-zinc-400 w-full flex flex-row items-center justify-between px-4 py-2 dark:bg-anno-space-700">

            {/* Left side */}
            <div className="flex flex-row items-center justify-between gap-4">

                {/* TODO: Insert logo here */}

                {/* Document details */}
                <div className="flex flex-col justify-start">
                    <h1 className="text-lg font-bold text-anno-red-primary self-end">
                        {testDocumentName}
                    </h1>
                    <p className="text-xs text-neutral-400 font-light self-start">
                        {testLastUpdated}
                    </p>
                </div>

                <ActionMenu onCopy={() => console.log('Copy pressed')} onDelete={() => console.log('Delete pressed')} onDownload={() => console.log('Download pressed')}/>

                <button className="bg-gray-200 text-black px-3 py-2 transition-colors hover:bg-blue-200 rounded" onClick={() => toggleDarkMode()}>Toggle Dark Mode: {isDarkMode ? 'DARK' : 'LIGHT'}</button>

            </div>

            {/* Right Side */}
            <div className="flex flex-row items-center justify-between gap-2">

                <Fullscreen onClick={() => console.log('Clicked!')}/>

                <Zoom />

                {/* Active Users */}
                <ActiveUserBubbles activeUsers={activeUsers} />

                {/* Share button*/}
                {/* TODO: add the ability to click anywhere from popup and close it */}
                <div className="relative">

                    <PrimaryButton label={"Share"} icon={<UserPlusIcon className={"h-6 w-6"} />} onClick={() => setShowSharePopup(!showSharePopup)}/>

                    <span className={`absolute mt-2 z-50 right-0 ${!showSharePopup ? "hidden" : "block"} `}>
                        <SharePopup onSharePress={() => console.log('Shared button inside popup was pressed!')} peopleSharedWith={testPeople}/>
                    </span>

                </div>
            </div>

        </header>
    );
}