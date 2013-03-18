///<reference path="../../../../../main/ts/mvc/element/AbstractElementController.ts"/>
///<reference path="../../../../../main/ts/mvc/element/IElementViewFactory.ts"/>
///<reference path="../../../../../main/ts/mvc/IModel.ts"/>
///<reference path="ILabelModel.ts"/>

// Module
module templa.samples.mvc.controller.label {

    // Class
    export class LabelController extends templa.mvc.element.AbstractElementController {
        
        constructor(_viewFactory: templa.mvc.element.IElementViewFactory, private _labelElementKey:string) {
            super(_viewFactory);
        }

        public _doLoad(model: templa.mvc.IModel) {
            var labelModel: ILabelModel = <ILabelModel>model;
            var label = labelModel.getLabel();
            var labelElement: MSHTMLElementExtensions = <MSHTMLElementExtensions><any>this._find(this._labelElementKey);
            labelElement.innerText = label;
        }
    }


}