///<reference path="../../../lib/templa-mvc-core.d.ts"/>
///<reference path="ILabelModel.ts"/>

// Module
module Templa.Samples.Controller.Label {

    // Class
    export class LabelController extends Templa.Controller.AbstractElementViewController {
        
        constructor(_viewFactory:Templa.Controller.IElementViewFactory, private _labelElementKey:string) {
            super(_viewFactory);
        }

        public _load(model: Templa.IModel) {
            var labelModel: ILabelModel = <ILabelModel>model;
            var label = labelModel.getLabel();
            var labelElement: MSHTMLElementExtensions = <MSHTMLElementExtensions><any>this._find(this._labelElementKey);
            labelElement.innerText = label;
        }
    }


}