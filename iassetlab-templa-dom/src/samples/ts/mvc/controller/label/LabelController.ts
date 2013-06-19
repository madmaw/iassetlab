///<reference path="ILabelModel.ts"/>

///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/> 
///<reference path="../../../../../../build/dist/iassetlab-templa-dom.d.ts"/> 

// Module
module templa.dom.samples.mvc.controller.label {

    // Class
    export class LabelController extends templa.dom.mvc.jquery.AbstractJQueryController<ILabelModel> {
        
        constructor(_viewFactory: templa.dom.mvc.IElementViewFactory, private _labelElementSelector:string) {
            super(_viewFactory);
        }

        public _doLoad(model: ILabelModel) {
            var labelModel = model;
            var label = labelModel.getLabel(); 
            this.$(this._labelElementSelector).text(label);
        }

        public getTitle(): string {
            var labelModel = this.getModel();
            return labelModel.getLabel();
        }

        public _handleModelChangeEvent(event: templa.mvc.ModelChangeEvent) {
            super._handleModelChangeEvent(event);
            this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(false, true));
        }
    }


}