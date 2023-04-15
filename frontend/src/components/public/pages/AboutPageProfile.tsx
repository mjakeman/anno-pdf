import matthewDp from "../../../assets/images/aboutpage/profiles/mj.jpeg";

interface AboutPageProfileProps {
    name: string,
    role: string,
    imgPath: string;
}

export default function AboutPageProfile({name, role, imgPath} : AboutPageProfileProps ) {
    return (
        <div className="flex-col flex gap-2">
            <img className="rounded-xl" src={imgPath} alt="Photo of Matthew" />
            <span className="text-lg">
                <p className="text-white">{name}</p>
                <p className="text-neutral-400 dark:text-neutral-300">{role}</p>
            </span>
        </div>
    );
}