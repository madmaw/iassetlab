///<reference path="IElementReference.ts"/>
///<reference path="IElementView.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc {

    // Class
    export class AttributeElementReference implements IElementReference {
        // Constructor
        constructor(private _view:IElementView, private _attributeName:string, private _attributeValue:string, private _filter?:(o:Node)=>boolean) {
        }

        public resolve(): Element {
            // TODO want to filter out sub-controller names
            return templa.util.Elements.find(this._attributeName, this._attributeValue, this._view.getRoots(), this._filter);
        }
    }
}
