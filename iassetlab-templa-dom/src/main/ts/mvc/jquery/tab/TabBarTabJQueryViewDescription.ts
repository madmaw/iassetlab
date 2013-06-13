///<reference path="../../IElementView.ts"/>

// Module
module templa.dom.mvc.jquery.tab {

    // Class
    export class TabBarTabJQueryViewDescription {

        // Constructor
        constructor( private _clickableElementSelector:string, private _styleableElementSelector:string, private _view:IElementView) {
        }

        public getClickableElementSelector(): string { 
            return this._clickableElementSelector;
        }

        public getStyleableElementSelector(): string {
            return this._styleableElementSelector;
        }

        public getView(): IElementView {
            return this._view;
        }
    }

}
