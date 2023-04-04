import ProfileBubble, {ProfileBubbleSizes} from "../../../ProfileBubble";
import React, {useState} from "react";
import {TrashIcon, XMarkIcon} from "@heroicons/react/24/solid"
interface SharedWithUserRowProps {
    userId: number,
    fullName: string,

    email: string,

    onConfirmRemove: (params: any) => any;


}
export default function SharedWithUserRow({userId, fullName, email, onConfirmRemove} : SharedWithUserRowProps) {

    const [showConfirmation, setShowConfirmation] = useState(false);

    // TODO: change '0' to the currentlyLoggedInUser's id (based on context/store of who is logged in)
    const isCurrentUser = userId === 0;

    function handleDeleteConfirm() {
        setShowConfirmation(false);
        onConfirmRemove(userId);
    }

    return (
        <div className={`flex flex-row items-center gap-4 p-2 rounded-xl transition-colors ${showConfirmation && "bg-red-200"}`}>

            <ProfileBubble size={ProfileBubbleSizes.Small} fullName={fullName}/>

            <div className="flex flex-col grow">
                <p className="font-medium">{fullName} {isCurrentUser && "(you)"} </p>
                <span className="text-slate-500 text-sm">{email}</span>
            </div>

            <button
                className={`${showConfirmation && "hidden"} border-transparent border-2 font-semibold text-md justify-self-end text-anno-red-secondary px-3 py-1 rounded-lg transition-colors hover:bg-gray-100 hover:text-anno-red-primary hover:border-gray-200`}
                type="button"
                onClick={() => setShowConfirmation(true)}
            >
                Remove
            </button>

            <div className={`${!showConfirmation && "hidden"} flex flex-row gap-4`}>
                <button onClick={() => setShowConfirmation(false)} type="button" className="w-8 h-8 transition-colors rounded-full border-2 border-gray-300 bg-gray-200 flex items-center justify-center hover:bg-gray-100 hover:border-gray-200 text-gray-400">
                    <XMarkIcon className="w-5 h-5"/>
                </button>
                <button onClick={() => handleDeleteConfirm()} type="button" className="w-8 h-8 bg-gray-200 rounded-full border-2 border-anno-red-primary bg-anno-pink flex items-center hover:bg-gray-100 hover:bg-red-400 hover:border-red-700 transition-colors justify-center text-anno-red-primary">
                    <TrashIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
}