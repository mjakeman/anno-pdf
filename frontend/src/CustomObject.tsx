import {fabric} from "fabric";
import React, {useRef} from "react";
import TeXToSVG from 'tex-to-svg';


class CustomObject extends fabric.Object {
    _latex: string
    _svgImgString: string

    _isEditing: boolean
    _latestLeft: number | undefined
    _latestTop:  number | undefined

    _width: number

    constructor(latex:string, options: any) {
        super(options);
        this._latex = latex;
        this._svgImgString = this.getSvgFromLatex();
        this._isEditing = false;
        this.on('mousedblclick', this.edit);
        this.on('deselected', this.deselected)
        this._latestTop = options.top;
        this._latestLeft = options.left;
        this._width = 10;
    }

    deselected() {
        this._latestTop = this.top;
        this._latestLeft = this.left;
    }

    render(ctx: CanvasRenderingContext2D) {
        let current = this;
        if (!current._isEditing) {
            fabric.loadSVGFromString(current._svgImgString, function(objects, options) {
                let obj = fabric.util.groupSVGElements(objects, options);
                let activeObjects = current.canvas?.getActiveObjects();

                let left = current.left;
                let top = current.top;

                // Essentially overrides the default positioning due to a bug when selecting multiple.
                // Hacky way of fixing it.
                if (activeObjects && activeObjects.length > 1) {
                    // Formula is
                    // current.left = current._latestLeft - current.group?.left - current.group?.width/2
                    // But we want to override that.
                    // TODO: Maybe refactor?
                    if (current.left && current.top && current.group && current.group.left && current.group.top && current.group.width && current.group.height) {
                        left = current.left + current.group?.left + current.group?.width/2;
                        top = current.top + current.group?.top + current.group?.height/2;
                    }
                }
                obj.set({
                    left: left,
                    top: top,
                    scaleX: 10,
                    scaleY: 10,
                });
                obj.render(ctx);
            });
        }

    }

    edit() {
        this._isEditing = true;
        // Create the latex for it, and set that we're editing it
        const iText = new fabric.IText(this._latex, {
            left: this.left,
            top: this.top,
        });
        this.canvas?.add(iText);
        this.canvas?.setActiveObject(iText);

        // When we change, make sure we keep track.
        iText.on('changed', (e) => {
            if (iText.text) {
                this._latex = iText.text;
            }
        });

        // When we exit editing, remove this text and instead have the image.
        iText.on('editing:exited', () => {
            this._svgImgString = this.getSvgFromLatex();
            console.log(this.getSvgFromLatex());
            this._isEditing = false;
            this.canvas?.remove(iText);
        });
        iText.enterEditing();
    }

    getSvgFromLatex() {
        const options = {
            width: 120,
            ex: 200,
            em: 200,
            scaleX: 10,
            scaleY: 10,
        };
        return TeXToSVG(this._latex, options);
    }
}

export default CustomObject;