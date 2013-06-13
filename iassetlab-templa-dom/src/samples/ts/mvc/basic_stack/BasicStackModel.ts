///<reference path="../Controller/text_input/TextInputController.ts"/>
///<reference path="../controller/text_input/ITextInputModel.ts"/>
///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ImmutableLabelModel.ts"/>

///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/> 
///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/> 

// Module
module templa.dom.samples.mvc.basic_stack {


    // Class
    export class BasicStackModel extends templa.mvc.composite.AbstractStackControllerModel implements templa.dom.samples.mvc.controller.text_input.ITextInputModel {

        private labelViewKey: string;
        private labelViewFactory: templa.dom.mvc.IElementViewFactory;

        // Constructor
        constructor() {
            super();
            this.labelViewKey = "label";
            // TODO this should be passed in, not created internally
            this.labelViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<span key='"+this.labelViewKey+"'></span>");
        }

        getValue(): string {
            return "";
        }

        requestSubmit(value: string) {
            // push a new controller
            // TODO  this should probably be created via a factory rather than explicitly done here
            var labelController = this._createController(value);
            this._push(labelController);
        }

        private _createController(value:string): templa.mvc.IController {
            var labelController = new templa.dom.samples.mvc.controller.label.LabelController(this.labelViewFactory, "[key='" + this.labelViewKey + "']");
            labelController.setModel(new templa.dom.samples.mvc.controller.label.ImmutableLabelModel(value));
            return labelController;
        }

        public _entryToDescription(entry: templa.mvc.composite.IAbstractStackControllerModelEntry): any {
            var model:templa.dom.samples.mvc.controller.label.ImmutableLabelModel = <any>entry.controller.getModel();
            return model.getLabel();
        }

        public _createEntryFromDescription(description: string): templa.mvc.composite.IAbstractStackControllerModelEntry {
            var controller = this._createController(description);
            return {
                controller: controller
            };
        }

    }
}