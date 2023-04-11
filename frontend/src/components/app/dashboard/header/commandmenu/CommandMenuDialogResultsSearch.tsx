import CommandMenuDialogRow from "./CommandMenuDialogRow";
import React from "react";
import {CommandOption} from "./CommandMenuDialog";

// TODO: see if its worth moving the searchResults prop into this component alone (i.e. API call is made here)
interface CommandMenuDialogResultsSearchProps {
    searchResults: {settings: CommandOption[], documents: CommandOption[]}
    searchInput: string,
}

export default function CommandMenuDialogResultsSearch( {searchResults, searchInput} : CommandMenuDialogResultsSearchProps) {

    if (!searchResults.settings || !searchResults.documents)
        // TODO: change, at the moment this is assuming the results are not good.
        return (
            <div>
                An error occurred.
            </div>
        );

    if (searchResults.settings.length == 0 && searchResults.documents.length === 0) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <p className="text-stone-400">No results for '{searchInput}'</p>
            </div>
        )
    }
    return (
        <>
            {searchResults.documents.length > 0 &&
                <div className="flex flex-col gap-2 w-full">
                    <h1 className="text-neutral-400 text-lg">
                        Settings
                    </h1>
                    <div className={"flex flex-col"}>
                        {searchResults.documents.map((command, index) => (
                            <CommandMenuDialogRow text={command.text} iconType={command.iconType}
                                                  newTab={command.newTab} href={command.href}
                                                  key={index}/>
                        ))}
                    </div>
                </div>
            }
            {searchResults.settings.length > 0 &&
                <div className="flex flex-col gap-2 w-full">
                    <h1 className="text-neutral-400 text-lg">
                        Settings
                    </h1>
                    <div className={"flex flex-col"}>
                        {searchResults.settings.map((command, index) => (
                            <CommandMenuDialogRow text={command.text} iconType={command.iconType}
                                                  newTab={command.newTab} href={command.href}
                                                  key={index}/>
                        ))}
                    </div>
                </div>
            }
        </>
    );
}