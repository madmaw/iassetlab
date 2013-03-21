///<reference path="../../IElementView.ts"/>
// Module
module templa.mvc.element.jquery.command {

    // Class
    export class CommandJQueryViewDescription {
        // Constructor
        constructor (private _view:IElementView, private _actionElementSelector:string) { }

        public get view(): IElementView {
            return this._view;
        }

        public get actionElementSelector(): string {
            return this._actionElementSelector;
        }
    }

}

