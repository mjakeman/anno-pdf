function normaliseHashCode(code: number, min: number, max: number) {
    return Math.floor((code % (max - min)) + min);
}

function getHashCode(email: string) : number {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

export function generateUniqueColors(email: string) : {bgColor: string, borderColor: string} {

    // HSL ranges that best work for color generation
    const hRange = [0, 360];
    const sRange = [85, 95];
    const lRange = [30, 35];

    // Get the appropriate values
    const hash = getHashCode(email);
    let h = normaliseHashCode(hash, hRange[0], hRange[1]);
    const s = normaliseHashCode(hash, sRange[0], sRange[1]);
    const l = normaliseHashCode(hash, lRange[0], lRange[1]);

    // Border needs to be lighter than background
    const bgColor = `hsl(${h},${s}%,${l}%)`;
    const borderColor = `hsl(${h},${s}%,${l+20}%)`;

    return {bgColor, borderColor};
}