import Tool from "./Tool";
import {Canvas} from "fabric/fabric-impl";

class Eraser extends Tool {
    private _size: number;

    constructor(id: string, size: number) {
        super(id);
        this._size = size;

    }

    get size(): number {
        return this._size;
    }

    set size(value: number) {
        this._size = value;
    }

    draw(canvas: Canvas): void {
    }
}
export default Eraser;