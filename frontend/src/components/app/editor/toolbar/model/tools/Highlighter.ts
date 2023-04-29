import Tool from "./Tool";
import {PencilIcon} from "@heroicons/react/24/outline";
import React from "react";

class Highlighter extends Tool {
    private _allowedColors: string[]  = [
        '#dff000',
        '#ff9a00',
        '#FF0000',
        '#00ff04',
        '#00c5ff',
        '#ff00a7',
    ]
    private _size: number;
    private _color: string;
    constructor(id: string, size: number, color: string) {
        super(id)
        this._size = size;
        this._color = color;
    }

    get size(): number {
        return this._size;
    }

    set size(value: number) {
        this._size = value;
    }

    get color(): string {
        return this._color;
    }

    set color(value: string) {
        if (!this._allowedColors.includes(value)) {
            throw new Error("Invalid color selection.")
        }
        this._color = value;
    }

    get allowedColors(): string[] {
        return this._allowedColors;
    }

}
export default Highlighter;