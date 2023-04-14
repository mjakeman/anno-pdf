import {Link} from "react-router-dom";
import PublicFooterNavLink from "./PublicFooterNavLink";
import DarkModeToggleTest from "../../../DarkModeToggleTest";

export default function PublicFooter() {
    return (
        <footer className="bg-anno-red-primary p-8 flex flex-row item-start justify-center gap-12 dark:bg-anno-red-secondary">
            <p className="text-white text-center">&copy; Anno 2023 | The University of Auckland | New Zealand </p>
            <div className="flex flex-col">
                <PublicFooterNavLink to={"/about"} label="About"/>
                <PublicFooterNavLink to={"/contact"} label="Contact"/>
                <PublicFooterNavLink to={"/terms"} label="Terms"/>
            </div>
            <div className="flex flex-col">
                <PublicFooterNavLink to={"/login"} label="Login"/>
                <PublicFooterNavLink to={"/signup"} label="Sign up"/>
            </div>
            <div className="flex flex-col">
                <a href={"https://github.com/UOA-CS732-SE750-Students-2023/project-group-fearless-foxes"} target="_blank" className="transition-colors text-white hover:text-anno-pink-500">GitHub</a>
            </div>
            <DarkModeToggleTest />
        </footer>
    );
}