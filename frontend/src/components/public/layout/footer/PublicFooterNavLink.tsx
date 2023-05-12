import {Link} from "react-router-dom";

interface Props {
    to: string,
    label: string,
}

export default function PublicFooterNavLink({to, label} : Props) {
    return (
        <Link className="transition-colors text-white hover:text-anno-pink-500" to={`${to}`}>{label}</Link>
    );
}