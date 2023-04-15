import {useEffect, useState} from "react";

export default function useLocalStorage(key: string, initialValue?: any) {

    const [value, setValue] = useState(() => {
        try {
            const data = window.localStorage.getItem(key);
            return data ? JSON.parse(data) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [value, setValue])
    return [value, setValue];
}