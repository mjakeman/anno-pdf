import ActionMenu from "./ActionMenu";
import Fullscreen from "./Fullscreen";
import Zoom from "./Zoom";
import ActiveUserBubbles from "./ActiveUserBubbles";
import PrimaryButton from "../../../PrimaryButton";
import {UserPlusIcon} from "@heroicons/react/24/outline";
import SharePopup from "../../share/popup/SharePopup";
import React, {useState} from "react";
import DarkModeToggleTest from "../../../DarkModeToggleTest";
import Logo from "../../../Logo";
import { useNavigate } from "react-router-dom";

export default function EditorHeader() {
    const navigate = useNavigate();
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
        <header className="bg-white dark:bg-anno-space-900 border-b-[1px] border-zinc-400 dark:border-anno-space-100 w-full flex flex-row items-center justify-between px-4 py-2 dark:bg-anno-space-700">

            {/* Left side */}
            <div className="flex flex-row items-center justify-between gap-4">

                {/* Logo */}
                <Logo className="w-8 h-8 hover:cursor-pointer" onClick={()=>navigate("/project-group-fearless-foxes/dash")}/>

                {/* Document details */}
                <div className="flex flex-col justify-start">
                    {/* TODO: add edit function*/}
                    <h1 className="text-lg font-bold text-anno-red-primary dark:text-anno-pink-500 self-end">
                        {testDocumentName}
                    </h1>
                    <p className="text-xs text-neutral-400 dark:text-white font-light self-start">
                        {testLastUpdated}
                    </p>
                </div>

                <ActionMenu onCopy={() => console.log('Copy pressed')} onDelete={() => console.log('Delete pressed')} onDownload={() => console.log('Download pressed')}/>

                <DarkModeToggleTest/>

            </div>

            {/* Right Side */}
            <div className="flex flex-row items-center justify-between gap-2">

                <Fullscreen onClick={() => console.log('Clicked!')}/>

                <Zoom />

                {/* Active Users */}
                <ActiveUserBubbles activeUsers={activeUsers} />

                {/* Share button*/}
                <div className="relative">

                    <PrimaryButton label={"Share"} icon={<UserPlusIcon className={"h-6 w-6"} />} onClick={() => setShowSharePopup(true)}/>

                    <span className={`absolute mt-2 z-50 right-0 ${!showSharePopup ? "hidden" : "block"} `}>
                        <SharePopup onOutsideClick={() => setShowSharePopup(false)} onSharePress={() => console.log('Shared button inside popup was pressed!')} peopleSharedWith={testPeople}/>
                    </span>

                </div>
            </div>

        </header>
    );
}