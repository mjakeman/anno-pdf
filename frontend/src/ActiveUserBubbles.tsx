import React, {useEffect, useState} from "react";
import ProfileBubble, {ProfileBubbleSizes} from "./ProfileBubble";
import ActiveUserBubble from "./assets/ActiveUserBubble";
import {ChevronUpIcon} from "@heroicons/react/24/solid";
interface UserData {
    id: number,
    fullName: string,
    email: string,
}

interface ActiveUserBubblesProps {
    activeUsers: UserData[],
}
export default function ActiveUserBubbles({activeUsers} : ActiveUserBubblesProps) {

    // TODO: Can change this value - might be good to change based on screen size in the future?
    const maxBubblesToDisplay = 3;

    const [showOverflow, setShowOverflow] = useState(false);

    const [displayedUsers, setDisplayedUsers] = useState<UserData[]>([]);
    const [overflowUsers, setOverflowUsers] = useState<UserData[]>([]);
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
        <div className={"flex flex-row z-50 ml-4 items-center gap-2"}>

            {/* Active User Bubbles */}
            <div className="flex flex-row">
                {displayedUsers.map((user, index) => (
                    <ActiveUserBubble user={user} key={index}/>
                ))}
            </div>

            {/* (Overflow) Active users*/}
            <div className={`${!showOverflow && "hidden"} relative `}>

                {/* Toggle list of (overflow) active users */}
                <button onClick={() => setShowOverflowUsersList(!showOverflowUsersList)} type="button" className="text-zinc-500 w-8 h-8 transition-colors rounded-full border-2 border-transparent flex items-center justify-center hover:bg-gray-100 hover:border-gray-200">
                    {showOverflowUsersList
                        ?
                            <ChevronUpIcon className="w-6 h-6"/>
                        :
                            `+ ${overflowUsersLength}`
                    }
                </button>

                {/* Toggled when clicking above button */}
                <div className={`${!showOverflowUsersList && "hidden"} absolute max-h-72 overflow-auto w-max bg-white shadow px-6 py-4 rounded-xl flex flex-col gap-2`}>
                    {overflowUsers.map((user, index) => (
                        <div key={index} className="flex flex-row items-center gap-2">
                            <ProfileBubble size={ProfileBubbleSizes.Small} fullName={user.fullName}/>
                            <div className="flex flex-col grow">
                                <p className="font-medium">{user.fullName}</p>
                                <span className="text-slate-500 text-sm">{user.email}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}