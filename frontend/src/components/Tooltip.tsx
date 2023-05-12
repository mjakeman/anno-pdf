import {useState} from "react";

type position = "top" | "right" | "bottom" | "left";

interface Props {
    children: React.ReactNode;
    text: string;
    position: position;
}

export default function Tooltip({ children, text, position }: Props) {
    const [isHovered, setIsHovered] = useState(false);
    const styles = getPositionStyles(position);

    return (
        <div
            className="relative group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
            {isHovered && (
                <div className={"absolute bg-gray-800 text-white rounded py-1 px-2 text-xs whitespace-nowrap z-[9999] " + styles}>
                    {text}
                </div>
            )}
        </div>
    );
}

function getPositionStyles(position: position) {
    switch (position) {
        case "top":
            return "left-1/2 -translate-x-1/2 bottom-[calc(100%+0.5rem)]";
        case "right":
            return "top-1/2 -translate-y-1/2 left-[calc(100%+0.5rem)]";
        case "bottom":
            return "left-1/2 -translate-x-1/2 top-[calc(100%+0.5rem)]";
        case "left":
            return "top-1/2 -translate-y-1/2 right-[calc(100%+0.5rem)]";
        default:
            return "";
    }
}