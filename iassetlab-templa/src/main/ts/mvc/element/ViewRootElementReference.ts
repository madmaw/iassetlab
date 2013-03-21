///<reference path="../IElementReference.ts"/>
///<reference path="IElementView.ts"/>

// Module
module templa.mvc.element {

    // Class
    export class ViewRootElementReference implements IElementReference {
        // Constructor
        constructor (private _view:IElementView) { }

        public resolve(): Element {
            return <Element><any>this._view.getRoots()[0];
        }
    }

}
