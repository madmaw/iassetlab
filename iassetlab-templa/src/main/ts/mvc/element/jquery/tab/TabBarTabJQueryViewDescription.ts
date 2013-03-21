///<reference path="../../IElementView.ts"/>

// Module
module templa.mvc.element.jquery.tab {

    // Class
    export class TabBarTabJQueryViewDescription {

        // Constructor
        constructor( private _clickableElementSelector:string, private _styleableElementSelector:string, private _view:IElementView) {
        }

        public get clickableElementSelector(): string {
            return this._clickableElementSelector;
        }

        public get styleableElementSelector(): string {
            return this._styleableElementSelector;
        }

        public get view(): IElementView {
            return this._view;
        }
    }

}
