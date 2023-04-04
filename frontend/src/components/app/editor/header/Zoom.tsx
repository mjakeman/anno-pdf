import React, {useState} from "react";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/outline";

// TODO - probably want to prevent being able to enter > 200 or less than 0
export default function Zoom() {
    const [zoom, setZoom] = useState("100");

    const zoomIn = () => {
        if (parseInt(zoom) < 200) {
            setZoom((parseInt(zoom) + 1).toString());
        }
    }

    const zoomOut = () => {
        if (parseInt(zoom) > 0) {
            setZoom((parseInt(zoom) - 1).toString());
        }
    }

    const handleChange = (event: { target: { value: any; }; }) => {
        if (!event.target.value) {
            const value = "0";
            setZoom(value);
        }
        else {
            const value = event.target.value;
            setZoom(parseInt(value).toString());
        }
    };

    return (
        <div className="flex flex-row items-center content-center">
            <button type="button"
                    onClick={zoomOut}
                    className="px-1 text-gray-400 dark:text-white">
                <MinusCircleIcon className="h-7 w-7"/>
            </button>

            <input className="text-center w-16 border-2 border-gray-300 rounded-lg bg-white dark:bg-anno-space-700 dark:text-white"
                   id={zoom} onChange={handleChange} value={zoom}></input>

            <button type="button"
                    onClick={zoomIn}
                    className="px-1 text-gray-400 dark:text-white">
                <PlusCircleIcon className="h-7 w-7"/>
            </button>
        </div>
    )
}