import {Canvas} from "fabric/fabric-impl";

abstract class Tool {
    id: string;
    protected constructor(id: string) {
        this.id = id;
    }
    abstract draw(canvas: Canvas): void;
}
export default  Tool;