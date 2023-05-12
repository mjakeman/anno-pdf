import Tool from "./Tool";
import {Canvas} from "fabric/fabric-impl";

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

    private _maxSize: number = 30;

    private _minSize: number = 10;

    constructor(id: string, size: number, color: string) {
        super(id)
        this._size = size;
        this._color = color;
    }

    get size(): number {
        return this._size;
    }

    set size(value: number) {
        if (!(value >= this._minSize && value <= this._maxSize)) {
            throw new Error("Invalid pen size - not in range.")
        }
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

    get minSize(): number {
        return this._minSize;
    }
    get maxSize(): number {
        return this._maxSize;
    }

    draw(canvas: Canvas): void {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = this.size;
        canvas.freeDrawingBrush.color = `${this.color}40`; // See https://stackoverflow.com/questions/23201134/transparent-argb-hex-value
    }

}
export default Highlighter;