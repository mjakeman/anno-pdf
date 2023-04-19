import {CommandOption} from "./CommandMenuDialog";
import {Cog6ToothIcon, DocumentIcon} from "@heroicons/react/24/solid";

export default function CommandMenuDialogRow( { iconType, text, href, newTab } : CommandOption ) {

    const iconMappings = {
      'Document': <DocumentIcon className="w-6 h-6"/>,
      'Gear' : <Cog6ToothIcon className="w-6 h-6" />
    };

    return (
        <a href={href}  target={newTab? '_blank' : '_self'} className="p-4 rounded-xl transition-colors hover:bg-zinc-100 text-zinc-500 flex flex-row gap-4 items-center cursor-pointer dark:text-white dark:hover:bg-anno-space-750">
            <div className="text-stone-600 dark:text-white">
                { iconMappings[iconType] }
            </div>
            <div>
                { text }
            </div>
        </a>

    );
}