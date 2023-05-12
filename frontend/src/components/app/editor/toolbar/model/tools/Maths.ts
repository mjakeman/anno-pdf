import Tool from "./Tool";
import {Canvas, IObjectOptions, Object} from "fabric/fabric-impl";
import {fabric} from "fabric";
import TeXToSVG from "tex-to-svg";

/**
 * Tool Representation
 */
class Maths extends Tool {

    constructor(id: string)  {
        super(id);
    }

    draw(canvas: Canvas): void {
        canvas.on('mouse:down', (event) => {
            // If we click the canvas (not an object):
            if (event.target === null) {
                // @ts-ignore
                let text = new MathAnnotation("\\frac{n!}{k!(n-k)!} = \\binom{n}{k}", {
                    left: event.e.offsetX,
                    top: event.e.offsetY,
                });
                canvas.add(text)
                canvas.setActiveObject(text);
            }
        });
    }

}
export default Maths;

/**
 * Math Annotation representation (used by Math Tool).
 *
 * Essentially this object is meant to create either an SVG (for the Maths presentation) or an IText (for the latex
 * editing) - which allows for smooth 'Math Annotations'.
 */
export const MathAnnotation = fabric.util.createClass(fabric.Object, {

    type: 'MathItext',
    latex: '',
    svgString: '',

    initialize: function (initialLatex: string, options: IObjectOptions) {
        options = options || {};
        this.latex = initialLatex;

        // Get the latex as an svg
        this.svgString = TeXToSVG(this.latex);

        // Initialise this as a fabric object
        this.callSuper('initialize', options);

        // Create a listener to allow for editing
        this.on('mousedblclick', this.editLatex);
    },

    /**
     * This renders the svg on a given canvas.
     * When this object is initially rendered, it is an SVG.
     * @param svgString
     * @param canvas
     */
    _renderMath(svgString: string, canvas: fabric.Canvas) {

        // Keep a reference of the object
        let current = this;

        // Load the SVG from the given string
        fabric.loadSVGFromString(svgString, (objects, options) => {
            let obj = fabric.util.groupSVGElements(objects, options);
            (obj as any).set({latex: this.latex});
            obj.scale(10); // svg is small - so scale


            obj.on('mousedblclick', (e) => this.editLatex(obj.canvas, obj, (obj as any).latex))

            // Set object fields needed for a canvas object
            let left =   current.left;
            let top =    current.top;
            let angle = current.angle;
            obj.set({
                left: left,
                top: top,
                angle: angle,
            });

            // @ts-ignore
            obj['uuid'] = current['uuid'];
            obj.toObject = (function(objRef, toObject) {
                return () => {
                    const intermediary = fabric.util.object.extend(toObject.call(objRef), {
                        uuid: (objRef as any).uuid,
                        latex: (objRef as any).latex
                    });
                    let mathAnnotation = new MathAnnotation("\\frac{n!}{k!(n-k)!} = \\binom{n}{k}", intermediary.options);
                    mathAnnotation.uuid = intermediary.uuid;
                    return mathAnnotation.toObject(['uuid', 'latex']);
                };
            })(obj, obj.toObject);

            canvas.add(obj);
            canvas.setActiveObject(obj);
            canvas.remove(current);
        });
    },

    // Override the object render method
    _render: function (ctx: CanvasRenderingContext2D) {
        this._renderMath(this.svgString, this.canvas);
    },

    editLatex(canvas: fabric.Canvas, mathSvg: Object, storedLatex: string) {
        // Create the latex for it, and set that we're editing it
        canvas.remove(mathSvg);
        const iText = new fabric.IText(storedLatex, {
            left: mathSvg.left,
            top: mathSvg.top,
        });

        // Mark ourselves as transient (i.e. don't report changes)
        (iText as any).transient = true;

        canvas.add(iText);
        canvas.setActiveObject(iText);

        let enteredLatex = storedLatex;
        // When we change, make sure we keep track.
        iText.on('changed', (e) => {
            if (iText.text) {
                enteredLatex = iText.text;
            }
        });

        // When we exit editing, remove this text and instead have the image.
        iText.on('editing:exited', () => {
            let svgString = TeXToSVG(iText.text as any);
            this.latex = iText.text;
            canvas.remove(iText);
            this._renderMath(svgString, canvas);
        });
        iText.enterEditing();
    }
});