import {useEffect, useState} from "react";

/**
 * A custom React hook that provides a state variable that is persisted to local storage.
 * 
 * @param key - The key to use for storing the state variable in local storage.
 * @param initialValue - The initial value to use for the state variable.
 * 
 * @returns An array containing the current value of the state variable and a function to update the value.
 */

export default function useLocalStorage(key: string, initialValue?: any) {

    const [value, setValue] = useState(() => {
        try {
            // Try to get the value from local storage
            const data = window.localStorage.getItem(key);
            // Parse stored JSON or if none return initialValue
            return data ? JSON.parse(data) : initialValue;
        } catch {
            // If error also return initialValue
            return initialValue;
        }
    });

    // Update local storage whenever the state variable changes
    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [value, setValue])
    return [value, setValue];
}