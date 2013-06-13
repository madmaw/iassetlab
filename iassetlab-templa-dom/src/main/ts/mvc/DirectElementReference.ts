///<reference path="IElementReference.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc {

    // Class
    export class DirectElementReference implements IElementReference {
        // Constructor
        constructor(private _element:Element) {
        }

        public resolve(): Element {
            return this._element;
        }
    }

}
