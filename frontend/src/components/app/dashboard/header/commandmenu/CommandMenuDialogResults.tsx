import CommandMenuDialogRow from "./CommandMenuDialogRow";
import React, {useEffect} from "react";
import {CommandOption} from "./CommandMenuDialog";
import CommandMenuDialogResultsRecent from "./CommandMenuDialogResultsRecent";
import CommandMenuDialogResultsSearch from "./CommandMenuDialogResultsSearch";

interface CommandMenuDialogResultsProps {
    searchInput: string,
}
export default function CommandMenuDialogResults({ searchInput } : CommandMenuDialogResultsProps) {

    // TODO: replace with API call
    const testResults : {settings: CommandOption[], documents: CommandOption[]} = {
        settings: [
            {
                iconType: 'Gear',
                text: 'Account',
                href: 'https://testAccount.etc',
                newTab: false,
            },
            {
                iconType: 'Gear',
                text: 'Update email',
                href: 'https://testUpdateEmail.etc',
                newTab: false,
            },
            {
                iconType: 'Gear',
                text: 'Update password',
                href: 'https://testUpdatePass.etc',
                newTab: false,
            },
            {
                iconType: 'Gear',
                text: 'Change profile picture',
                href: 'https://changeProfilePic.etc',
                newTab: false,
            },
        ],
        documents: [
            {
                iconType: 'Document',
                text: 'Slides SOFTENG 754',
                href: 'https://testSlides.etc',
                newTab: true,
            },
            {
                iconType: 'Document',
                text: 'Assignment Handout Debrief',
                href: 'https://testAssignmentHandout.etc',
                newTab: true,
            },
        ]
    }

// TODO: replace with localstorage grab of recently visited?
    const recent : CommandOption[] = [
        {
            iconType: 'Document',
            text: 'Lecture Notes - Thursday',
            href: 'https://testLectureNotes.etc',
            newTab: true,
        },
        {
            iconType: 'Gear',
            text: 'Account',
            href: 'https://testAccount.etc',
            newTab: false,
        },
    ];

    useEffect(() => {
        // TODO: This would be where we import the results
    }, [searchInput]);

    return (
        <div className="flex flex-col items-center overflow-y-auto p-2 m-2">
            {/* If we haven't searched anything, show the recent*/}
            {searchInput.length === 0
                ?
                <CommandMenuDialogResultsRecent recent={recent}/>
                :
                <CommandMenuDialogResultsSearch searchResults={testResults} searchInput={searchInput}/>
            }
        </div>
    );
}