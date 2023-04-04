import {useState} from "react";
import {EllipsisHorizontalIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/20/solid";

import {DocumentDuplicateIcon, TrashIcon } from "@heroicons/react/24/outline";


interface ActionMenuProps {
    onDownload:  (params: any) => any,
    onCopy:  (params: any) => any,
    onDelete:  (params: any) => any,
}
export default function ActionMenu({onDownload, onCopy, onDelete} : ActionMenuProps ) {

    const [showExpandedMenu, setShowExpandedMenu] = useState(false);

    return (
        <div className="flex flex-row items-center">
            <button onClick={() => setShowExpandedMenu(!showExpandedMenu)} type="button" className="z-50 bg-anno-red-primary w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-anno-red-secondary">
                {showExpandedMenu ? <XMarkIcon className="w-5 h-5 text-white" /> : <EllipsisHorizontalIcon className="w-8 h-8 text-white"/> }
            </button>
            {showExpandedMenu &&
                <div className="-ml-4 flex rounded-r-xl border-y-2 border-r-2 border-anno-red-primary">
                    <div className="flex flex-row ml-6 mr-2 gap-2 items-stretch justify-center">

                        <button onClick={onDownload} type="button" className="rounded-lg px-2 py-1 hover:bg-zinc-200">
                            <ArrowDownTrayIcon className="w-5 h-5 text-anno-red-primary" />
                        </button>

                        {/* TODO: maybe make this a component? */}
                        <div className="border-l-2 border-anno-pink my-1 translate-x-1/2"></div>

                        <button onClick={onCopy} type="button" className="rounded-lg px-2 hover:bg-zinc-200">
                            <DocumentDuplicateIcon className="w-4 h-4 text-anno-red-primary" />
                        </button>

                        <div className="border-l-2 border-anno-pink my-1 translate-x-1/2"></div>

                        <button onClick={onDelete}  type="button" className="rounded-lg px-2 hover:bg-red-100">
                            <TrashIcon className="w-5 h-5 stroke-2 text-red-500" />
                        </button>

                    </div>

                </div>
            }
        </div>

    );
}