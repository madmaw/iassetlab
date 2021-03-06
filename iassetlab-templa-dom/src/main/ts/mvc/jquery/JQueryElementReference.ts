///<reference path="IJQuerySelectorHandler.ts"/>
///<reference path="../IElementReference.ts"/>

///<reference path="../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc.jquery {

    // Class
    export class JQueryElementReference implements IElementReference {
        // Constructor
        constructor(private _selectorHandler:IJQuerySelectorHandler, private _selector:string) {
        }

        public resolve(): Element {
            var query: JQuery = this._selectorHandler.$(this._selector);
            var result: Element;
            if (query.length > 0) {
                result = query.get()[0];
            } else {
                result = null;
            }
            return result;
        }
    }

}
