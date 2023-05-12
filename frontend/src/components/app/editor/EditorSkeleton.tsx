import React from "react";

/**
 * A placeholder skeleton while the editor is loading
 */
export default function EditorSkeleton() {
    return (
        <div className="bg-white dark:bg-anno-space-700 h-screen flex flex-col">

            {/* Header Bar */}
            <header className="bg-white dark:bg-anno-space-700 dark:border-anno-space-100 w-full flex flex-row items-center justify-between px-4 py-2 dark:bg-anno-space-700">
                    <div className={"animate-pulse h-14 grow bg-slate-200 dark:bg-anno-space-800"}>
                    </div>
            </header>

            {/* Toolbar */}
            <div className="fixed translate-y-2/3 left-1/2 -translate-x-1/2 overflow-visible z-50 bg-slate-200 dark:bg-anno-space-700 rounded-full">
                <div className={"animate-pulse bg-slate-200 dark:bg-anno-space-800 h-14 w-180 dark:bg-anno-space-800 w-180 p-2 rounded-full flex items-center gap-2 drop-shadow-around"}>
                    <div className=""></div>
                </div>
            </div>

            {/* Document Space */}
            <div className="grow bg-white dark:bg-anno-space-700 px-4 py-2 ">
                <div className="animate-pulse h-full w-full bg-zinc-300 dark:bg-anno-space-800">
                </div>
            </div>
        </div>
    );
}