///<reference path="../IElementReference.ts"/>

// Module
module templa.mvc.element {

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
