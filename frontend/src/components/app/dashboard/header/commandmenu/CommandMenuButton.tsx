import React, {useEffect, useState} from "react";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";

interface CommandMenuButtonProps {
    onClick: (params: any) => any,
}
export default function CommandMenuButton( { onClick } : CommandMenuButtonProps) {

    const [os, setOS] = useState<string | null>(null);

    // Get the OS
    useEffect(() => {
        setOS(getOs());
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                onClick(event);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [os]);


    return (
        <button onClick={onClick} type="button" className="w-104 flex flex-row justify-between items-center border-2 border-zinc-300 hover:border-zinc-500 transition-colors px-2 py-1 rounded-lg focus:outline-anno-pink-500 dark:text-anno-space-100 dark:border-anno-space-100 dark:bg-anno-space-700">
            <div className="flex flex-row gap-1">
                <MagnifyingGlassIcon className="w-6 h-6 text-neutral-400 dark:text-anno-space-100" />
                <div className="text-zinc-400 dark:text-anno-space-100">
                    Search for documents, settings and more
                </div>
            </div>
            <div className="text-zinc-500 dark:text-anno-space-100">
                {os === 'Mac OS' && '⌘ K'}
                {os === 'Windows' && 'Ctrl + K'}
            </div>
        </button>
    )
}

/**
 * Returns the desktop OS of the current device
 */
function getOs() : string | null {
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf('Mac') > -1) {
        return 'Mac OS';
    }
    if (userAgent.indexOf('Win') > -1) {
        return 'Windows';
    }
    return null;
}