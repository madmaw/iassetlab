// Module
module templa.mvc.element.command {

    // Class
    export class ActionElementView {
        // Constructor
        constructor (private _view:IElementView, private _actionElementKey:string) { }

        public get view(): IElementView {
            return this._view;
        }

        public get actionElementKey(): string {
            return this._actionElementKey;
        }
    }

}

