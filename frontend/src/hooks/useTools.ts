import {useContext, useEffect} from "react";
import {ToolContext} from "../components/app/editor/Editor";

/**
 * A custom React hook that manages the active tool in the canvas.
 * 
 * @param canvas - The canvas object to apply the active tool to.
 * 
 * @returns void
 */

export default function useTools(canvas: any) {
    // Get active tool from context
    const [activeToolData] = useContext(ToolContext);

    // Apply active tool to canvas when it changes
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