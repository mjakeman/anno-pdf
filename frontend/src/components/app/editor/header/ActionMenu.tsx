import {useContext, useState} from "react";
import {ArrowDownTrayIcon, EllipsisHorizontalIcon} from "@heroicons/react/24/solid";
import {XMarkIcon} from "@heroicons/react/20/solid";

import {DocumentDuplicateIcon, TrashIcon} from "@heroicons/react/24/outline";
import {AuthContext} from "../../../../contexts/AuthContextProvider";
import {AnnoDocument} from "../Models";
import Tooltip from "../../../Tooltip";


interface ActionMenuProps {
    onDownload:  (params: any) => any,
    onCopy:  (params: any) => any,
    onDelete:  (params: any) => any,

    annoDoc: AnnoDocument
}

/**
 * Represents the action menu in the editor
 * @param onDownload
 * @param onCopy
 * @param onDelete
 * @param annoDoc
 * @constructor
 */
export default function ActionMenu({onDownload, onCopy, onDelete, annoDoc} : ActionMenuProps ) {

    const [showExpandedMenu, setShowExpandedMenu] = useState(false);

    const {currentUser} = useContext(AuthContext);

    const isOwner = annoDoc.owner.uid == currentUser?.uid;

    const actionText = showExpandedMenu ? "Close" : "Action"

    return (
        <div className="flex flex-row items-center">
            <Tooltip text={actionText} position={showExpandedMenu ? "bottom" : "right"}>
                <button onClick={() => setShowExpandedMenu(!showExpandedMenu)} type="button" className="z-50 bg-anno-red-primary dark:bg-anno-red-secondary w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-anno-red-secondary dark:hover:bg-anno-pink-500">
                    {showExpandedMenu ? <XMarkIcon className="w-5 h-5 text-white" /> : <EllipsisHorizontalIcon className="w-8 h-8 text-white"/> }
                </button>
            </Tooltip>

            {/* If we've clicked the 3 dots ... */}
            {showExpandedMenu &&
                <div className="-ml-4 flex rounded-r-xl border-y-2 border-r-2 border-anno-red-primary dark:border-anno-red-secondary">
                    <div className="flex flex-row ml-6 mr-2 gap-2 items-stretch justify-center">

                        <button onClick={onDownload} type="button" className="rounded-lg px-2 py-1 hover:bg-zinc-200 dark:hover:bg-anno-space-700 transition-colors">
                            <ArrowDownTrayIcon className="w-5 h-5 text-anno-red-primary dark:text-anno-pink-500" />
                        </button>

                        <div className="border-l-2 border-anno-pink-500 dark:border-pink-100 my-1.5 translate-x-1/2"></div>

                        <button onClick={onCopy} type="button" className="rounded-lg px-2 hover:bg-zinc-200 dark:hover:bg-anno-space-700 transition-colors">
                            <DocumentDuplicateIcon className="w-4 h-4 text-anno-red-primary dark:text-anno-pink-500" />
                        </button>

                        {isOwner && <div className="border-l-2 border-anno-pink-500 dark:border-pink-100  my-1.5 translate-x-1/2"></div>}

                        {isOwner && <button onClick={onDelete}  type="button" className="rounded-lg px-2 hover:bg-red-100 dark:hover:bg-zinc-300 transition-colors">
                            <TrashIcon className="w-5 h-5 stroke-2 text-red-500 dark:text-white" />
                        </button>}

                    </div>

                </div>
            }
        </div>

    );
}