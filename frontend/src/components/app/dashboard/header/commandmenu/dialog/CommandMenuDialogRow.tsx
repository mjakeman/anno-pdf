import {CommandOption} from "./CommandMenuDialog";
import {
    Cog6ToothIcon,
    DocumentIcon,
    DocumentMagnifyingGlassIcon,
    InformationCircleIcon
} from "@heroicons/react/24/solid";
import {Link} from "react-router-dom";

export default function CommandMenuDialogRow( { category, text, to, newTab } : CommandOption) {

    const iconMappings: any = {
      'documents': <DocumentIcon className="w-6 h-6"/>,
      'settings' : <Cog6ToothIcon className="w-6 h-6" />,
      'information' : <InformationCircleIcon className="w-6 h-6" />
    };

    return (
        <Link to={to} target={newTab? '_blank' : '_self'} className="p-4 rounded-xl transition-colors hover:bg-zinc-100 focus:bg-zinc-100 text-zinc-500 flex flex-row gap-4 items-center cursor-pointer dark:text-white dark:hover:bg-anno-space-750 dark:focus:bg-anno-space-750 ">
            <div className="text-stone-600 dark:text-white">
                { iconMappings[category] ?? <DocumentMagnifyingGlassIcon className="w-6 h-6"/>}
            </div>
            <div>
                { text }
            </div>
        </Link>
    );
}