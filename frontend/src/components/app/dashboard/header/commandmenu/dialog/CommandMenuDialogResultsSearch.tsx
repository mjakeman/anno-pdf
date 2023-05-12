import CommandMenuDialogRow from "./CommandMenuDialogRow";
import React, {useEffect, useState} from "react";
import {CommandOption} from "./CommandMenuDialog";

interface Props {
    searchResults: CommandOption[],
    searchInput: string,
}

interface GroupedResults {
    [key: string]: CommandOption[];
}


export default function CommandMenuDialogResultsSearch( {searchResults, searchInput} : Props) {

    const [groupedResults, setGroupedResults] = useState<GroupedResults>({});

    useEffect(() => {
        const results = searchResults.reduce((acc: any, singleResult: CommandOption) => {
            const key = singleResult.category;
            acc[key] = acc[key] || [];
            acc[key].push(singleResult);
            return acc;
        }, {})
        setGroupedResults(results);
    }, [searchResults]);

    if (Object.keys(groupedResults).length === 0) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <p className="text-stone-400">No results for '{searchInput}'</p>
            </div>
        )
    }
    return (
        <>
            {Object.keys(groupedResults).map((category) => (
                <div key={category} className="flex flex-col gap-2 w-full">
                    <h1 className="text-neutral-400 text-lg dark:text-white">
                        {toTitleCase(category)}
                    </h1>
                    <div className={"flex flex-col"}>
                        {groupedResults[category].map((command: CommandOption, index:number) => (
                            <CommandMenuDialogRow key={index}
                                                  text={command.text}
                                                  newTab={command.newTab}
                                                  to={command.to}
                                                  category={command.category}
                                                  />
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
}

/**
 * Returns text in title case (first letter capitalised)
 * @param text
 */
function toTitleCase(text: string) {
    return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
}