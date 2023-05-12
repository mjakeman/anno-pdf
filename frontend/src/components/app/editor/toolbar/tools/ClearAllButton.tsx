import React, {useContext} from "react";
import {DocumentContext} from "../../Editor";
import {fabric} from "fabric";
import {useNavigate} from "react-router-dom";

export default function ClearAllButton() {

    const [_users, _add, _remove, _shared, _reset, document] = useContext(DocumentContext);

    const navigate = useNavigate();

    const handleClearAllClick = () => {
        const result = confirm('Are you sure you want to clear all annotations?');
        if (result) {
            console.log("Clearing annotations!");
            console.log(document.pages);
            const canvasArray = document.pages as fabric.Canvas[];
            for (const canvas of canvasArray) {
                canvas.getObjects().forEach((obj) => {
                    canvas.remove(obj);
                });
                canvas.discardActiveObject().renderAll();
            }
        }
    }

    return (
        <span className="relative flex items-center justify-center">
            <button onClick={handleClearAllClick} type="button" className={`bg-gray-200 dark:bg-anno-space-100 border-transparent border active:bg-gray-300 rounded-full transition-colors p-2`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                     stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                </svg>
            </button>
        </span>

    )
}