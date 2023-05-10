import ProfileBubble, {ProfileBubbleSizes} from "../../../ProfileBubble";
import React, {useContext, useEffect, useState} from "react";
import {TrashIcon, XMarkIcon} from "@heroicons/react/24/solid"
import {AuthContext} from "../../../../contexts/AuthContextProvider";
interface SharedWithUserRowProps {
    ownerUid: string,
    userUid: string | null,
    name: string, // Will be set to 'New User'

    email: string,

    onConfirmRemove: (params: any) => any;


}
export default function SharedWithUserRow({ownerUid, userUid, name, email, onConfirmRemove} : SharedWithUserRowProps) {

    const [showConfirmation, setShowConfirmation] = useState(false);
    const {currentUser} = useContext(AuthContext);
    const isRowCurrentUser = userUid === currentUser?.uid;
    const isLoggedIn = ownerUid === currentUser?.uid;

    function handleDeleteConfirm() {
        setShowConfirmation(false);
        onConfirmRemove(email);
    }

    return (
        <div className={`flex flex-row items-center gap-4 p-2 rounded-xl transition-colors ${showConfirmation && "bg-red-200 dark:bg-anno-space-700"}`}>

            <ProfileBubble size={ProfileBubbleSizes.Small} name={name}/>

            <div className="flex flex-col grow">
                <p className="font-medium text-black dark:text-white">{name} {isRowCurrentUser && "(you)"} </p>
                <span className="text-slate-500 text-sm dark:text-stone-300">{email}</span>
            </div>

            { isLoggedIn &&
                <>

                    {showConfirmation
                        ?
                        <div className="flex flex-row gap-4">
                            <button onClick={() => setShowConfirmation(false)} type="button" className="w-8 h-8 transition-colors rounded-full border-2 border-gray-300 bg-gray-200 dark:bg-anno-space-700 dark:text-white dark:border-anno-space-100 dark:hover:bg-anno-space-100 flex items-center justify-center hover:bg-gray-100 hover:border-gray-200 text-gray-400">
                                <XMarkIcon className="w-5 h-5"/>
                            </button>
                            <button onClick={() => handleDeleteConfirm()} type="button" className="w-8 h-8 bg-gray-200 rounded-full border-2 border-anno-red-primary bg-anno-pink-500 flex items-center hover:bg-gray-100 hover:bg-red-400 hover:border-red-700 transition-colors justify-center text-anno-red-primary">
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        </div>
                        :
                        <button
                            className="border-transparent border-2 font-semibold text-md justify-self-end text-anno-red-secondary dark:text-red-500 px-3 py-1 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-anno-space-100 hover:text-anno-red-primary hover:border-gray-200"
                            type="button"
                            onClick={() => setShowConfirmation(true)}
                        >
                            Remove
                        </button>
                    }
                </>
            }
        </div>
    );
}