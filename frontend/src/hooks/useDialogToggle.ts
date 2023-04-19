import {Dispatch, SetStateAction, useEffect, useState} from "react";

/**
 * Custom hook to show a dialog with the given keys
 * @param exitKey key to control the exit of the dialog.
 * @param toggleKey Combined with Ctrl or ⌘ i.e. Ctrl + k or ⌘ + k.
 */
export default function useDialogToggle(exitKey: string, toggleKey: string) : [boolean, Dispatch<SetStateAction<boolean>>]{

    // TODO: refactor to context?
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === exitKey && showDialog) {
                setShowDialog(false);
            }
            if ((event.metaKey || event.ctrlKey) && event.key === toggleKey) {
                setShowDialog(!showDialog);
            }

        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showDialog]);

    return [showDialog, setShowDialog];
}