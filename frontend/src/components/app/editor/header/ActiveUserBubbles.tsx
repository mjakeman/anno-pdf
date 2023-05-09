import React, {useEffect, useState} from "react";
import ProfileBubble, {ProfileBubbleSizes} from "../../../ProfileBubble";
import ActiveUserBubble from "./ActiveUserBubble";
import {ChevronUpIcon} from "@heroicons/react/24/solid";
import {AnnoUser} from "../Models";

interface ActiveUserBubblesProps {
    activeUsers: AnnoUser[],
}
export default function ActiveUserBubbles({activeUsers} : ActiveUserBubblesProps) {

    // TODO: Can change this value - might be good to change based on screen size in the future?
    const maxBubblesToDisplay = 3;

    const [showOverflow, setShowOverflow] = useState(false);

    const [displayedUsers, setDisplayedUsers] = useState<AnnoUser[]>([]);
    const [overflowUsers, setOverflowUsers] = useState<AnnoUser[]>([]);
    const [overflowUsersLength, setOverflowUsersLength] = useState(0);

    useEffect(()=>{

        setShowOverflowUsersList(false);

        const activeUserCopy = [...activeUsers];

        if (activeUsers.length > maxBubblesToDisplay) {
            setShowOverflow(true);
            setDisplayedUsers(activeUserCopy.slice(0, maxBubblesToDisplay));
            let overflow = activeUserCopy.slice(maxBubblesToDisplay);
            setOverflowUsers(overflow);
            setOverflowUsersLength(overflow.length);
        } else {
            setDisplayedUsers(activeUserCopy);
        }

    }, [activeUsers]);

    const [showOverflowUsersList, setShowOverflowUsersList] = useState(false);

    return (
        <div className={"flex flex-row z-50 items-center gap-2 justify-between"}>

            {/* Active User Bubbles */}
            <div className="flex flex-row ml-4">
                {displayedUsers.map((user, index) => (
                    <span key={index} className="-ml-4">
                        <ActiveUserBubble user={user} />
                    </span>
                ))}
            </div>

            {/* (Overflow) Active users*/}
            <div className={`${!showOverflow && "hidden"} relative `}>

                {/* Toggle list of (overflow) active users */}
                <button onClick={() => setShowOverflowUsersList(!showOverflowUsersList)} type="button" className="text-zinc-500 w-8 h-8 transition-colors rounded-full border-2 border-transparent dark:text-stone-300 dark:hover:text-white dark:hover:bg-anno-space-100 dark:hover:border-anno-space-100 flex items-center justify-center hover:bg-gray-100 hover:border-gray-200">
                    {showOverflowUsersList
                        ?
                            <ChevronUpIcon className="w-6 h-6"/>
                        :
                            `+ ${overflowUsersLength}`
                    }
                </button>

                {/* Toggled when clicking above button */}
                {/* TODO add ability such that when clicking anywhere it disappears */}
                <div className={`${!showOverflowUsersList && "hidden"} mt-2 right-0 absolute max-h-72 overflow-auto w-max bg-white dark:bg-anno-space-900 dark:border-2 dark:border-anno-space-100 shadow px-6 py-4 rounded-xl flex flex-col gap-2`}>
                    {overflowUsers.map((user, index) => (
                        <div key={index} className="flex flex-row items-center gap-2">
                            <ProfileBubble size={ProfileBubbleSizes.Small} name={user.name}/>
                            <div className="flex flex-col grow">
                                <p className="font-medium text-black dark:text-white">{user.name}</p>
                                <span className="text-slate-500 text-sm dark:text-stone-300">{user.email}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}