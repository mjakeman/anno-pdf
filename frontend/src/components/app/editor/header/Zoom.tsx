import {ChangeEvent, FocusEvent, useContext, useEffect, useRef, useState} from "react";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/outline";
import {ZoomContext} from "../Editor";

// NOTE: Not in use unfortunately due to executive decision

export default function Zoom() {

    const [zoom, setZoom] = useContext(ZoomContext);
    const [displayZoom, setDisplayZoom] = useState(`${zoom}%`);
    const [inputValue, setInputValue] = useState('');

    const zoomIncrements = [
        25,
        33,
        50,
        67,
        75,
        80,
        90,
        100,
        110,
        125,
        150,
        175,
        200,
        250,
        300,
        400,
        500,
    ];
    const [currentIncrementIndex, setCurrentIncrementIndex] = useState(findIndex(zoomIncrements, zoom));

    const minZoom = zoomIncrements[0];
    const maxZoom = zoomIncrements[zoomIncrements.length - 1];

    const zoomInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setDisplayZoom(`${zoom}%`);
    }, [zoom]);

    const zoomIn = () => {
        console.log(currentIncrementIndex)
        let index = currentIncrementIndex + 1;
        if (currentIncrementIndex < zoomIncrements.length - 1){
            setCurrentIncrementIndex(index);
            setZoom(zoomIncrements[index])
        }
    }

    const zoomOut = () => {
        let index = currentIncrementIndex - 1;
        if (currentIncrementIndex > 0) {
            setCurrentIncrementIndex(index);
            setZoom(zoomIncrements[index])
        }
    }

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        const text = event.target.value;
       if (isValidZoomFormat(text)) {
           const newZoomVal = getZoomValueFromText(text);

           // If it is out of range, set the index and state values
           if (newZoomVal < minZoom) {
               setCurrentIncrementIndex(0);
               setZoom(minZoom)
               setDisplayZoom(`${minZoom}%`);
           } else if (newZoomVal > maxZoom) {
               setZoom(maxZoom)
               setDisplayZoom(`${maxZoom}%`);
               setCurrentIncrementIndex(zoomIncrements.length - 1);

           // Otherwise, use the entered value
           } else {
               setZoom(newZoomVal);
               setDisplayZoom(`${newZoomVal}%`);
               setCurrentIncrementIndex(findIndex(zoomIncrements, newZoomVal));
           }
       } else {
           setDisplayZoom(`${zoom}%`);
       }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDisplayZoom(event.target.value);
    }

        return (
        <div className="flex flex-row items-center content-center">
            <button type="button"
                    onClick={zoomOut}
                    className="px-1 text-gray-400 dark:text-white">
                <MinusCircleIcon className="h-7 w-7"/>
            </button>

            <input ref={zoomInput} type="text" className="text-center px-2 py-1 w-16 border-2 border-gray-300 rounded-xl bg-white dark:bg-anno-space-700 dark:text-white"
                   onBlur={(e) => handleBlur(e)} onChange={handleChange}  value={displayZoom}></input>

            <button type="button"
                    onClick={zoomIn}
                    className="px-1 text-gray-400 dark:text-white">
                <PlusCircleIcon className="h-7 w-7"/>
            </button>
        </div>
    )
}

// Finds the index of a given number in a sorted array.
function findIndex(sortedArray: number[], x: number): number {
    let start = 0;
    let end = sortedArray.length - 1;
    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        if (sortedArray[mid] === x) return mid;
        else if (sortedArray[mid] < x) start = mid + 1;
        else end = mid - 1;
    }
    return start;
}
// Checks if valid format (i.e. digits followed by optional percentage sign)
function isValidZoomFormat(zoomText: string) {
    const regex = /^\d+%?$/
    return regex.test(zoomText);
}

// Get the integer value from the zoom. This zoomText may contain percentage signs, so factor this in.
function getZoomValueFromText(zoomText: string) {
    let zoomValue = zoomText.replace('%', '');
    return parseInt(zoomValue);
}