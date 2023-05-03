import Tool from "./Tool";
import {Canvas} from "fabric/fabric-impl";

class Pen extends Tool {

    private _allowedColors: string[]  = [
        '#0000FF',
        '#000000',
        '#FF0000',
        '#054107',
        '#90900c',
        '#FFFFFF',
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

    draw(canvas: Canvas): void {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = this.size;
        canvas.freeDrawingBrush.color = this.color;
    }

}
export default Pen;