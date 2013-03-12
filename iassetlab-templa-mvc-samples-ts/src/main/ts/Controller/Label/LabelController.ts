///<reference path="../../../lib/templa-mvc-core.d.ts"/>
///<reference path="../../../lib/templa-mvc-element.d.ts"/>
///<reference path="ILabelModel.ts"/>

// Module
module Templa.MVC.Samples.Controller.Label {

    // Class
    export class LabelController extends Templa.MVC.Element.AbstractElementController {
        
        constructor(_viewFactory: Templa.MVC.Element.IElementViewFactory, private _labelElementKey:string) {
            super(_viewFactory);
        }

        public _load(model: Templa.MVC.IModel) {
            var labelModel: ILabelModel = <ILabelModel>model;
            var label = labelModel.getLabel();
            var labelElement: MSHTMLElementExtensions = <MSHTMLElementExtensions><any>this._find(this._labelElementKey);
            labelElement.innerText = label;
        }
    }


}