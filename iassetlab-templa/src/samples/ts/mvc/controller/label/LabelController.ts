///<reference path="../../../../../main/ts/mvc/element/jquery/AbstractJQueryController.ts"/>
///<reference path="../../../../../main/ts/mvc/element/IElementViewFactory.ts"/>
///<reference path="../../../../../main/ts/mvc/IModel.ts"/>
///<reference path="ILabelModel.ts"/>

// Module
module templa.samples.mvc.controller.label {

    // Class
    export class LabelController extends templa.mvc.element.jquery.AbstractJQueryController {
        
        constructor(_viewFactory: templa.mvc.element.IElementViewFactory, private _labelElementSelector:string) {
            super(_viewFactory);
        }

        public _doLoad(model: templa.mvc.IModel) {
            var labelModel: ILabelModel = <ILabelModel>model;
            var label = labelModel.getLabel();
            this.$(this._labelElementSelector).text(label);
        }
    }


}