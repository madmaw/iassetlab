///<reference path="../IElementReference.ts"/>
///<reference path="IElementView.ts"/>
///<reference path="../../util/Elements.ts"/>

// Module
module templa.mvc.element {

    // Class
    export class AttributeElementReference implements templa.mvc.IElementReference {
        // Constructor
        constructor(private _view:templa.mvc.element.IElementView, private _attributeName:string, private _attributeValue:string, private _filter?:(o:Node)=>bool) {
        }

        public resolve(): Element {
            // TODO want to filter out sub-controller names
            return templa.util.Elements.find(this._attributeName, this._attributeValue, this._view.getRoots(), this._filter);
        }
    }
}
