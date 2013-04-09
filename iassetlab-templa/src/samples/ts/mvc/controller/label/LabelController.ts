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

        public getTitle(): string {
            var labelModel: ILabelModel = <ILabelModel>this.getModel();
            return labelModel.getLabel();
        }

        public _handleModelChangeEvent(event: templa.mvc.ModelChangeEvent) {
            super._handleModelChangeEvent(event);
            this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(false, true));
        }
    }


}