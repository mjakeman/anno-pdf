import React, {ChangeEvent, useRef, useState} from "react";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import CommandMenuDialogResults from "./CommandMenuDialogResults";
import useDetectOutsideClick from "../../../../../hooks/useDetectOutsideClick";
interface CommandMenuDialogProps {
    onClose: (params: any) => any,
}


export type CommandOption = {
    iconType: 'Document' | 'Gear',
    text: string,
    href: string,
    newTab: boolean,
}


export default function CommandMenuDialog({onClose} : CommandMenuDialogProps) {


    const dialogRef = useRef<HTMLDivElement>(null);

    useDetectOutsideClick(dialogRef, onClose);

    const [searchInput, setSearchInput] = useState('');

    function handleSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
        setSearchInput(event.target.value);
    }

    return (
        <div ref={dialogRef} className="bg-white shadow rounded-xl flex flex-col w-180 h-96 dark:bg-anno-space-900">
            <div className="flex flex-row gap-2 justify-between w-full items-center border-b-2 border-neutral-200 dark:border-white p-4">
                <div className="grow flex flex-row gap-2 items-center">
                    <MagnifyingGlassIcon className="w-6 h-6 text-stone-500 dark:text-white"/>
                    <input autoFocus onChange={handleSearchInputChange} type="text" placeholder="Search for anything..." className="grow text-lg px-2 py-1 focus:outline-0 placeholder:text-neutral-400 dark:bg-anno-space-900 dark:text-white dark:placeholder:text-white"/>
                </div>
                {/* TODO: add 3d Effect */}
                <button onClick={onClose} type="button" className="dark:text-white dark:hover:bg-anno-space-100 dark:border-anno-space-100 rounded-lg p-1 transition-colors hover:bg-zinc-200 transition-colors font-bold font-mono text-2xs border-t-2 border-x-2 border-b-4 border-zinc-500 text-zinc-500">
                    ESC
                </button>
            </div>
            <CommandMenuDialogResults searchInput={searchInput} />
        </div>
    );
}
