import {Link} from "react-router-dom";

interface PublicFooterNavLinkProps {
    to: string,
    label: string,
}
// TODO: remove prefix of '/project-group-fearless-foxes' when ready
export default function PublicFooterNavLink({to, label} : PublicFooterNavLinkProps) {
    return (
        <Link className="transition-colors text-white hover:text-anno-pink" to={`/project-group-fearless-foxes${to}`}>{label}</Link>
    );
}