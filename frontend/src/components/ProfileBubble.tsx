import React from "react";
import { generateUniqueColors } from "./public/ProfileHashUtil";

export enum ProfileBubbleSizes {
    Small = "w-10 h-10 text-lg",
    Large = "w-12 h-12 text-xl"
}

interface Props {
    size: ProfileBubbleSizes,
    email: string,
}

export default function ProfileBubble({size, email} : Props) {

    // Use styling generated from a name
    const {bgColor, borderColor} = generateUniqueColors(email);
    const profileColor = {
        backgroundColor: bgColor,
        borderColor: borderColor,
    }

    return (
        <div>
            <div className={`${size} font-medium text-white rounded-full flex items-center justify-center border-2`} style={profileColor}>
                {email[0].toUpperCase()}
            </div>

        </div>
    );
}

