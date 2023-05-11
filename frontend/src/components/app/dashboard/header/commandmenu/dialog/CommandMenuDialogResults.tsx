import React, {useContext, useEffect, useState} from "react";
import {CommandOption} from "./CommandMenuDialog";
import CommandMenuDialogResultsRecent from "./CommandMenuDialogResultsRecent";
import CommandMenuDialogResultsSearch from "./CommandMenuDialogResultsSearch";
import {DocumentRecord} from "../../../DashboardTable";
import {RecentContext} from "../../../../../../contexts/RecentContextProvider";
import {LoadedDocContext} from "../../../../../../contexts/LoadedDocsContextProvider";

interface Props {
    searchInput: string,
}
export default function CommandMenuDialogResults({ searchInput } : Props) {

    const {documents} = useContext(LoadedDocContext);
    const {recentDocBuffer} = useContext(RecentContext);
    const recent = buildRecentData(recentDocBuffer);

    const searchableData = buildInitialSearchableData(documents);
    const [searchResults, setSearchResults] = useState<CommandOption[]>([]);

    useEffect(() => {
        const results = searchableData.filter((option : CommandOption) => option.text.toLowerCase().includes(searchInput.toLowerCase()));
        setSearchResults(results)
    }, [searchInput]);

    return (
        <div className="flex flex-col items-center overflow-y-auto p-2 m-2">
            {/* If we haven't searched anything, show the recent */}
            {searchInput.length === 0
                ?
                <CommandMenuDialogResultsRecent recent={recent}/>
                :
                <CommandMenuDialogResultsSearch searchResults={searchResults} searchInput={searchInput}/>
            }
        </div>
    );
}

function buildRecentData(documents: DocumentRecord[]) {
    let recentData : CommandOption[] = [];
    documents.map((document) => {
        recentData.push(transformDocumentToCommandOption(document));
    })
    return recentData;
}


function buildInitialSearchableData(documents: DocumentRecord[] | null) : CommandOption[] {

    let searchableData : CommandOption[] = [];

    if (documents) {
        // Transform all the documents to be searchable
        documents.map((document) => {
            searchableData.push(transformDocumentToCommandOption(document));
        })
    }


    // The fixed values / routes we want to be searchable
    const fixedSearchData : CommandOption[] = [
            {
                category: 'information',
                text: 'About Anno',
                to: '/about',
                newTab: true,
            },
            {
                category: 'information',
                text: 'Contact Us',
                to: '/about',
                newTab: true,
            },
            {
                category: 'information',
                text: 'Our Terms',
                to: '/terms',
                newTab: true,
            }];

    // Return both of them
    return searchableData.concat(fixedSearchData);
}

function transformDocumentToCommandOption(document: DocumentRecord) : CommandOption {
    return {
        category: 'documents',
        text: document.name,
        to: `/document/${document.uuid}`,
        newTab: true,
    }
}