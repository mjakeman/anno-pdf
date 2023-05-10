import {useContext, useState} from "react";
import {EllipsisHorizontalIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/20/solid";

import {DocumentDuplicateIcon, TrashIcon } from "@heroicons/react/24/outline";
import {AuthContext} from "../../../../contexts/AuthContextProvider";
import {AnnoDocument} from "../Models";


interface ActionMenuProps {
    onDownload:  (params: any) => any,
    onCopy:  (params: any) => any,
    onDelete:  (params: any) => any,

    annoDoc: AnnoDocument
}
export default function ActionMenu({onDownload, onCopy, onDelete, annoDoc} : ActionMenuProps ) {

    const [showExpandedMenu, setShowExpandedMenu] = useState(false);

    const {currentUser} = useContext(AuthContext);

    const isOwner = annoDoc.owner.uid == currentUser?.uid;

    return (
        <div className="flex flex-row items-center">
            <button onClick={() => setShowExpandedMenu(!showExpandedMenu)} type="button" className="z-50 bg-anno-red-primary dark:bg-anno-red-secondary w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-anno-red-secondary dark:hover:bg-anno-pink-500">
                {showExpandedMenu ? <XMarkIcon className="w-5 h-5 text-white" /> : <EllipsisHorizontalIcon className="w-8 h-8 text-white"/> }
            </button>
            {showExpandedMenu &&
                <div className="-ml-4 flex rounded-r-xl border-y-2 border-r-2 border-anno-red-primary dark:border-anno-red-secondary">
                    <div className="flex flex-row ml-6 mr-2 gap-2 items-stretch justify-center">

                        <button onClick={onDownload} type="button" className="rounded-lg px-2 py-1 hover:bg-zinc-200 dark:hover:bg-anno-space-700 transition-colors">
                            <ArrowDownTrayIcon className="w-5 h-5 text-anno-red-primary dark:text-anno-pink-500" />
                        </button>

                        {/* TODO: maybe make this a component? */}
                        <div className="border-l-2 border-anno-pink-500 dark:border-pink-100 my-1.5 translate-x-1/2"></div>

                        {/* TODO maybe maybe each option a component?*/}
                        <button onClick={onCopy} type="button" className="rounded-lg px-2 hover:bg-zinc-200 dark:hover:bg-anno-space-700 transition-colors">
                            <DocumentDuplicateIcon className="w-4 h-4 text-anno-red-primary dark:text-anno-pink-500" />
                        </button>

                        {isOwner && <button onClick={onDelete}  type="button" className="rounded-lg px-2 hover:bg-red-100 dark:hover:bg-zinc-300 transition-colors">
                            <TrashIcon className="w-5 h-5 stroke-2 text-red-500 dark:text-white" />
                        </button>}

                    </div>

                </div>
            }
        </div>

    );
}