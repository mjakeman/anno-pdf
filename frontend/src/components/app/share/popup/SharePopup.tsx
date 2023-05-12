import React, {useContext, useEffect, useRef, useState} from "react";
import SharedWithUserRow from "./SharedWithUserRow";
import useDetectOutsideClick from "../../../../hooks/useDetectOutsideClick";
import {AnnoDocument, AnnoUser, SharedUser} from "../../editor/Models";
import {AuthContext} from "../../../../contexts/AuthContextProvider";
import axios from "axios";
import {useToast} from "../../../../hooks/useToast";

interface SharePopupProps {
    owner: AnnoUser,
    annoDocument: AnnoDocument,
    onSharePress:  (params: any) => any;

    peopleSharedWith: SharedUser[],
    onOutsideClick: (params: any) => any;
}
export default function SharePopup({owner, annoDocument, onSharePress, peopleSharedWith, onOutsideClick } : SharePopupProps) {

    const {firebaseUserRef} = useContext(AuthContext);
    const shareDropdown = useRef<HTMLDivElement>(null);
    const [email, setEmail] = useState('');
    const {addToast} = useToast();
    const {currentUser} = useContext(AuthContext);

    useDetectOutsideClick(shareDropdown, onOutsideClick);

    const [sharedWithUsers, setSharedWithUsers] = useState(peopleSharedWith);

    async function removeFromPeople(emailOfPersonToBeRemoved: string, peopleList: SharedUser[]) {
        // Remove the user from the backend
        let token = await firebaseUserRef!.getIdToken();
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/documents/${annoDocument.uuid}/removeUser`, {email: emailOfPersonToBeRemoved}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(() => {
            const indexOfObject = peopleList.findIndex(object => {
                return object.email === emailOfPersonToBeRemoved;
            });
            setSharedWithUsers([
                ...peopleList.slice(0, indexOfObject),
                ...peopleList.slice(indexOfObject + 1),
            ]);
            addToast({
            
                message: 'Successfully removed user.',
                type: 'success'
            })
        }).catch(error => {
            addToast({
                message: 'Failed to remove user. Please double check you are the document owner and try again.',
                type: 'error'
            })
        });
    }

    // Onload, filter out the current user.
    useEffect(() => {
        setSharedWithUsers(sharedWithUsers.filter((user) => {
            return user.email !== currentUser?.email;
        }));
    }, []);

    return (
        <div ref={shareDropdown}
             className="drop-shadow-around rounded-lg p-4 flex flex-col gap-2 w-104 bg-white dark:bg-anno-space-900 dark:border-2 dark:border-anno-space-100">
            <h1 className="font-bold text-black dark:text-white">Share '{annoDocument.title}'</h1>
            <div className="flex flex-row gap-4">
                <input value={email} data-cy="share-email" onChange={e => setEmail(e.target.value)}
                       className="px-2 py-1 grow border-2 border-zinc-300 rounded-lg text-black focus:outline-anno-pink-500 placeholder:text-neutral-400 placeholder:font-light"
                       placeholder="Enter email address here..." type="email" id="share-email"/>
                <button onClick={() => onSharePress(email)} type="button" data-cy="share-button"
                        className="bg-anno-red-primary dark:bg-anno-red-secondary px-4 text-white flex flex-row font-light items-center content-center rounded-lg gap-1 transition-colors hover:bg-anno-red-secondary dark:hover:bg-anno-pink-500">Share
                </button>
            </div>
            <p className="text-neutral-400 text-sm dark:text-white">People with access</p>
            <div className="overflow-auto flex flex-col border-t-2 border-zinc-300 px-2 py-4 h-60">
                {sharedWithUsers.length
                    ?
                    sharedWithUsers.map((user, index) => (
                        <SharedWithUserRow ownerUid={owner.uid} key={index} email={user.email} userUid={user.uid}
                                           name={user.name ?? 'New User'}
                                           onConfirmRemove={(email) => removeFromPeople(email, sharedWithUsers)}/>
                    ))
                    :
                    <div className="flex justify-center items-center italic font-light text-zinc-300">
                        You are the only editor in this document.
                    </div>
                }
            </div>
        </div>
    );
}
