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
                <ProfileBubble size={ProfileBubbleSizes.Large} fullName={user.fullName}></ProfileBubble>
            </span>

            {/* Shown only on hover... */}
            <div className={`${!showUserInfoCard && "hidden"} right-0 absolute z-50 bg-white shadow px-6 py-4 rounded-xl flex flex-row items-center gap-2`}>
                <ProfileBubble size={ProfileBubbleSizes.Small} fullName={user.fullName}/>
                <div className="flex flex-col grow">
                    <p className="font-medium">{user.fullName}</p>
                    <span className="text-slate-500 text-sm">{user.email}</span>
                </div>
            </div>
        </div>
    );
}