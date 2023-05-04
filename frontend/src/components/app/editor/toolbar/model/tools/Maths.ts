import Tool from "./Tool";
import {Canvas, IObjectOptions, Object} from "fabric/fabric-impl";
import {fabric} from "fabric";
import TeXToSVG from "tex-to-svg";

class Maths extends Tool {

    constructor(id: string)  {
        super(id);
    }

    draw(canvas: Canvas): void {
        canvas.on('mouse:down', (event) => {
            if (event.target === null) {
                // @ts-ignore
                let text = new fabric.Math("\\frac{n!}{k!(n-k)!} = \\binom{n}{k}", {
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

// @ts-ignore
fabric.Math = fabric.util.createClass(fabric.Object, {
    type: 'MathItext',
    latex: '',
    svgString: '',

    initialize: function (initialLatex: string, options: IObjectOptions) {
        options = options || {};
        this.latex = initialLatex;
        this.svgString = TeXToSVG(this.latex);
        this.callSuper('initialize', options);
        this.on('mousedblclick', this.edit);
    },
    _renderMath(svgString: string, canvas: fabric.Canvas) {
        // Render Math object
        let current = this;
        fabric.loadSVGFromString(svgString, (objects, options) => {
            let obj = fabric.util.groupSVGElements(objects, options);
            (obj as any).set({latex: this.latex});
            obj.scale(10);
            obj.on('mousedblclick', (e) => this.editLatex(obj.canvas, obj, (obj as any).latex))
            let left =   current.left;
            let top =    current.top;
            let angle = current.angle;
            obj.set({
                left: left,
                top: top,
                angle: angle,
            });
            obj.toObject = (function(toObject) {
                return function() {
                    return fabric.util.object.extend(toObject.call(obj), {
                        latex: (obj as any).latex
                    });
                };
            })(fabric.Group.prototype.toObject);
            canvas.add(obj);
            canvas.setActiveObject(obj);
            canvas.remove(current);
        });
    },

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