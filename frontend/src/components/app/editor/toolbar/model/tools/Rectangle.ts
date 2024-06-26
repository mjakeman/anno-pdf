import Tool from "./Tool";
import {Canvas} from "fabric/fabric-impl";
import {fabric} from "fabric";

class Rectangle extends Tool {

    private _allowedColors: string[]  = [
        '#0000FF',
        '#000000',
        '#FF0000',
        '#054107',
        '#90900c',
        '#FFFFFF',
    ]

    private _color: string;
    constructor(id: string, color: string) {
        super(id)
        this._color = color;
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
        canvas.on('mouse:down', (event) => {
            if (event.target === null) {
                let text = new fabric.Rect({left: event.e.offsetX, top: event.e.offsetY, fill: this._color, width: 100, height: 100});
                canvas.add(text);
                canvas.setActiveObject(text);
            }
        });
    }

}
export default Rectangle;