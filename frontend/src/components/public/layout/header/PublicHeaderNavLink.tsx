import {Link} from "react-router-dom";

interface PublicHeaderNavLinkProps {
    to: string,
    label: string,
}
// TODO: remove prefix of '/project-group-fearless-foxes' when ready
export default function PublicHeaderNavLink({to, label} : PublicHeaderNavLinkProps) {
    return (
        <Link className="font-semibold text-anno-red-primary dark:text-anno-pink-500 px-3 py-1 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-anno-space-700 dark:hover:text-white" to={`/project-group-fearless-foxes${to}`}>{label}</Link>
    );
}