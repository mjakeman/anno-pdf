import Tool from "./Tool";
import {Canvas} from "fabric/fabric-impl";
import MathObject from "../../../MathObject";

class Maths extends Tool {

    constructor(id: string)  {
        super(id);
    }

    draw(canvas: Canvas): void {
        canvas.on('mouse:down', (event) => {
            if (event.target === null) {
                let text = new MathObject("\\frac{n!}{k!(n-k)!} = \\binom{n}{k}", {
                    left: event.e.offsetX,
                    top: event.e.offsetY,
                    scaleX: 4,
                    scaleY: 4,
                    height: 10,
                    width: 30,
                });
                canvas.add(text)
                canvas.setActiveObject(text);
            }
        });
    }

}
export default Maths;