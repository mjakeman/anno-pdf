import Tool from "./Tool";

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

}
export default Eraser;