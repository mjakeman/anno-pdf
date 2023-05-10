import ProfileBubble, {ProfileBubbleSizes} from "../../../ProfileBubble";
import React, {useState} from "react";

interface ActiveUserBubbleProps {
    user: {id: number, fullName: string, email: string };
}

export default function ActiveUserBubble({user} : ActiveUserBubbleProps) {

    const [showUserInfoCard, setShowUserInfoCard] = useState(false);

    return (
        <div className="relative">
            <span onMouseOver={() => setShowUserInfoCard(true)} onMouseLeave={() => setShowUserInfoCard(false)} className="hover:cursor-pointer">
                <ProfileBubble size={ProfileBubbleSizes.Large} email={user.email}></ProfileBubble>
            </span>

            {/* Shown only on hover... */}
            <div className={`${!showUserInfoCard && "hidden"} right-0 absolute z-50 bg-white dark:bg-anno-space-900 dark:border-2 dark:border-anno-space-100 shadow px-6 py-4 rounded-xl flex flex-row items-center gap-2`}>
                <ProfileBubble size={ProfileBubbleSizes.Small} email={user.email}/>
                <div className="flex flex-col grow">
                    <p className="font-medium text-black dark:text-white">{user.fullName}</p>
                    <span className="text-slate-500 text-sm dark:text-stone-300">{user.email}</span>
                </div>
            </div>
        </div>
    );
}