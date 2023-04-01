import React, {useState} from "react";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/24/outline";

export default function Zoom() {
    const [zoom, setZoom] = useState(100);

    const zoomIn = () => {
        if (zoom < 200) {
            setZoom(zoom + 1);
        }
    }

    const zoomOut = () => {
        if (zoom > 0) {
            setZoom(zoom - 1);
        }
    }
    return (
        <div className="flex flex-row items-center content-center">
            <button type="button"
                    onClick={zoomOut}
                    className="px-1 text-gray-400 dark:text-white">
                <MinusCircleIcon className="h-7 w-7"/>
            </button>

            <label className="text-center w-16 border-2 border-gray-300 rounded-lg bg-white dark:bg-anno-space-700 dark:text-white">{zoom}%</label>

            <button type="button"
                    onClick={zoomIn}
                    className="px-1 text-gray-400 dark:text-white">
                <PlusCircleIcon className="h-7 w-7"/>
            </button>
        </div>
    )
}