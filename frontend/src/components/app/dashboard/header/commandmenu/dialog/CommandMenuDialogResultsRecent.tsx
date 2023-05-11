import {CommandOption} from "./CommandMenuDialog";
import CommandMenuDialogRow from "./CommandMenuDialogRow";
import React from "react";

interface CommandMenuDialogResultsRecentProps {
    recent: CommandOption[]
}
export default function CommandMenuDialogResultsRecent( { recent } : CommandMenuDialogResultsRecentProps ) {

    if (recent.length === 0) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <p className="text-stone-400 dark:text-white">No recent documents</p>
            </div>
        )
    }
    return (
        <div className="flex flex-col gap-2 w-full">
            <h1 className="text-neutral-400 text-lg dark:text-white">
                Recent
            </h1>
            <div className={"flex flex-col"}>
                {recent.map((command: CommandOption, index: number) => (
                    <CommandMenuDialogRow text={command.text} category={command.category} newTab={command.newTab} to={command.to} key={index} />
                ))}
            </div>
        </div>
    )
}