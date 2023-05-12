import Tool from "./Tool";
import {Canvas} from "fabric/fabric-impl";
import {fabric} from "fabric";

class TextModel extends Tool {

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
            // If we click the canvas (not an object):
            if (event.target === null) {

                // Add the text object
                let text = new fabric.IText('', {left: event.e.offsetX, top: event.e.offsetY, fill: this._color});
                canvas.add(text);
                canvas.setActiveObject(text);

                // Make sure that when they edit, if the length of the text is 0, just remove the text object
                text.on('editing:exited', () => {
                    if (text.text?.length === 0) {
                        canvas.remove(text);
                    }
                });
                // Then enter editing
                text.enterEditing();
            }
        });
    }

}
export default TextModel;