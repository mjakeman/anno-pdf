import React, {useState} from "react";
import SharedWithUserRow from "./SharedWithUserRow";

interface SharePopupProps {
    onSharePress:  (params: any) => any;
}
export default function SharePopup({onSharePress } : SharePopupProps) {

    // TODO: replace with API call in (the parent component maybe, once the bigger 'Share' in top right of screen is clicked?)
    const testPeople = [
        { id: 0, name: 'John Doe', email: 'johndoe@gmail.com', },
        { id: 1, name: 'Alice Smith', email: 'alice@hotmail.com', },
        { id: 2, name: 'Charlie Hopkins', email: 'charlie@yahoo.com', },
        { id: 3, name: 'Bob Brown', email: 'bob@gmail.com', },
        { id: 4, name: 'David Mannings', email: 'david@yahoo.com', },
        { id: 5, name: 'Eve Post', email: 'eve@hotmail.com', },
    ];

    const [sharedWithUsers, setSharedWithUsers] = useState(testPeople);

    function removeFromPeople(idOfSharedUserToBeRemoved: number, peopleList: { id: number, name: string, email: string }[]) {
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
        <div className="shadow-md rounded-lg p-4 flex flex-col gap-2 w-104">
            <h1 className="font-bold">Share '{docName}'</h1>
            <div className="flex flex-row gap-4">
                <input className="px-2 py-1 grow border-2 border-zinc-300 rounded-lg text-black focus:outline-anno-pink  placeholder:text-neutral-400 placeholder:font-light" placeholder="Enter email address here..." type="email" id="share-email"/>
                <button type="button" className="bg-anno-red-primary px-4 text-white flex flex-row font-light items-center content-center rounded-lg gap-1 transition-colors hover:bg-anno-red-secondary">Share</button>
            </div>
            <p className="text-neutral-400 text-sm">People with access</p>
            <div className="overflow-auto flex flex-col border-t-2 border-zinc-300 px-2 py-4 gap-2 h-60">
                {sharedWithUsers.length
                    ?
                    sharedWithUsers.map((user, index) => (
                        <SharedWithUserRow key={index} email={user.email} userId={user.id} fullName={user.name} onConfirmRemove={(id) => removeFromPeople(id, sharedWithUsers)}/>
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

