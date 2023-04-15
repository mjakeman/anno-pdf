import React, {useRef, useState} from "react";
import SharedWithUserRow from "./SharedWithUserRow";
import useDetectOutsideClick from "../../../../hooks/useDetectOutsideClick";

interface SharePopupProps {
    onSharePress:  (params: any) => any;

    peopleSharedWith: {id: number, fullName: string, email: string}[],
    onOutsideClick: (params: any) => any;
}
export default function SharePopup({onSharePress, peopleSharedWith, onOutsideClick } : SharePopupProps) {

    const shareDropdown = useRef<HTMLDivElement>(null);

    useDetectOutsideClick(shareDropdown, onOutsideClick);

    const [sharedWithUsers, setSharedWithUsers] = useState(peopleSharedWith);

    function removeFromPeople(idOfSharedUserToBeRemoved: number, peopleList: { id: number, fullName: string, email: string }[]) {
        const indexOfObject = peopleList.findIndex(object => {
            return object.id === idOfSharedUserToBeRemoved;
        });
        setSharedWithUsers([
            ...peopleList.slice(0, indexOfObject),
            ...peopleList.slice(indexOfObject + 1),
        ]);
    }

    // TODO: replace with the actual name of the doc, from context (or state?)
    const docName = 'Employment Contract w/ UoA';

    return (
        <div ref={shareDropdown} className="drop-shadow-around rounded-lg p-4 flex flex-col gap-2 w-104 bg-white dark:bg-anno-space-900 dark:border-2 dark:border-anno-space-100">
            <h1 className="font-bold text-black dark:text-white">Share '{docName}'</h1>
            <div className="flex flex-row gap-4">
                <input className="px-2 py-1 grow border-2 border-zinc-300 rounded-lg text-black focus:outline-anno-pink-500 placeholder:text-neutral-400 placeholder:font-light" placeholder="Enter email address here..." type="email" id="share-email"/>
                <button type="button" className="bg-anno-red-primary dark:bg-anno-red-secondary px-4 text-white flex flex-row font-light items-center content-center rounded-lg gap-1 transition-colors hover:bg-anno-red-secondary dark:hover:bg-anno-pink-500">Share</button>
            </div>
            <p className="text-neutral-400 text-sm dark:text-white">People with access</p>
            <div className="overflow-auto flex flex-col border-t-2 border-zinc-300 px-2 py-4 h-60">
                {sharedWithUsers.length
                    ?
                    sharedWithUsers.map((user, index) => (
                        <SharedWithUserRow key={index} email={user.email} userId={user.id} fullName={user.fullName} onConfirmRemove={(id) => removeFromPeople(id, sharedWithUsers)}/>
                    ))
                    :
                    <div className="flex justify-center items-center italic font-light text-zinc-300">
                        You are the only editor in this document.
                    </div>
                }
            </div>
        </div>
    )
}

