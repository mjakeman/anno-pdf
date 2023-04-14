import React, {useEffect} from "react";

export default function useDetectOutsideClick(ref: React.RefObject<HTMLElement>, onOutsideClick: (event: MouseEvent) => void) {
    useEffect(() => {

        function handleOutsideClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onOutsideClick(event);
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        };
    }, [ref, onOutsideClick]);


}