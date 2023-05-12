import {useContext, useEffect} from "react";
import {ToolContext} from "../components/app/editor/Editor";

export default function useTools(canvas: any) {

    const [activeToolData] = useContext(ToolContext);

    useEffect(() => {
        if (canvas) {
            reset();
            activeToolData.draw(canvas);
        }
    }, [activeToolData]);

    function reset() {
        if (canvas) {
            canvas.isDrawingMode = false;
            canvas.off('mouse:down');
        }
    }
}