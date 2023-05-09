import React from "react";

export enum ProfileBubbleSizes {
    Small = "w-10 h-10 text-lg",
    Large = "w-12 h-12 text-xl"
}

interface ProfileBubbleProps {
    size: ProfileBubbleSizes,
    name: string,
}

export default function ProfileBubble({size, name} : ProfileBubbleProps) {

    // Use styling generated from a name
    const {bgColor, borderColor} = generateUniqueColors(name);
    const profileColor = {
        backgroundColor: bgColor,
        borderColor: borderColor,
    }

    return (
        <div>
            <div className={`${size} font-medium text-white rounded-full flex items-center justify-center border-2`} style={profileColor}>
                {name[0]}
            </div>

        </div>
    );
}
function normaliseHashCode(code: number, min: number, max: number) {
    return Math.floor((code % (max - min)) + min);
}

function getHashCode(fullName: string) : number {
    // TODO: add way of preventing a hover changing the timestamp
    // const fullNameWithTimestamp = fullName + new Date().getMinutes().toString();
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
        hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function generateUniqueColors(fullName: string) : {bgColor: string, borderColor: string} {

    // HSL ranges that best work for color generation
    const hRange = [0, 360];
    const sRange = [85, 95];
    const lRange = [30, 35];

    // Get the appropriate values
    const hash = getHashCode(fullName);
    let h = normaliseHashCode(hash, hRange[0], hRange[1]);
    const s = normaliseHashCode(hash, sRange[0], sRange[1]);
    const l = normaliseHashCode(hash, lRange[0], lRange[1]);

    // Border needs to be lighter than background
    const bgColor = `hsl(${h},${s}%,${l}%)`;
    const borderColor = `hsl(${h},${s}%,${l+20}%)`;

    return {bgColor, borderColor};
}
