///<reference path="../../IElementView.ts"/>

///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/> 

// Module
module templa.dom.mvc.jquery.command {

    // Class
    export class CommandJQueryViewDescription {
        // Constructor
        constructor (private _view:IElementView, private _actionElementSelector:string) { }

        public getView(): templa.dom.mvc.IElementView {
            return this._view;
        }

        public getActionElementSelector(): string {
            return this._actionElementSelector;
        }
    }

}

