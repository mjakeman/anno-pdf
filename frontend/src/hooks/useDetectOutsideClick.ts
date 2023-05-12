import React, {useEffect} from "react";

/**
 * A custom React hook that detects clicks outside of a specified element.
 * 
 * @param ref - A ref object that points to the element to detect clicks outside of.
 * @param onOutsideClick - A callback function that is called when a click outside of the element is detected.
 * 
 * @returns void
 */

export default function useDetectOutsideClick(ref: React.RefObject<HTMLElement>, onOutsideClick: (event: MouseEvent) => void) {
    useEffect(() => {

        function handleOutsideClick(event: MouseEvent) {
            // Check if the clicked element is outside of the specified element
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onOutsideClick(event);
            }
        }
        // Add a mousedown event listener to the document
        document.addEventListener('mousedown', handleOutsideClick)

        // Remove the event listener on cleanup
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        };
    }, [ref, onOutsideClick]);


}