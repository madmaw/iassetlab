///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>
///<reference path="../controller/label/ImmutableLabelModel.ts"/>
///<reference path="../controller/text_input/TextInputController.ts"/>
///<reference path="../controller/text_input/ITextInputModel.ts"/>

///<reference path="../../../../../build/defs/jquery.d.ts"/> 
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/> 
///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/> 

// Module  
module templa.dom.samples.mvc.decorated_stack {
    // Class
    export class DecoratedStackModel extends templa.mvc.composite.AbstractStackControllerModel implements templa.dom.samples.mvc.controller.text_input.ITextInputModel, templa.mvc.composite.IStackControllerModel {
        
        // Constructor
        constructor(
            private _topLevelController: templa.mvc.IController           
,
            private _labelViewFactory: templa.dom.mvc.IElementViewFactory,
            private _labelViewSelector: string,
            private _inputViewFactory: templa.dom.mvc.IElementViewFactory,
            private _inputValueSelector: string,
            private _inputButtonSelector: string,
            private _toolbarDecoratorFactory:(controllers:templa.mvc.IController[]) => templa.mvc.IController
        ) {
            super(false);
        }

        getValue(): string {
            return "";
        }

        requestSubmit(value: string) {
            // push a new controller
            if (value != null && value.length > 0) {
                // create the label
                var decoratorController = this._createController(value);

                this._push(decoratorController, value);
            }
        }

        public _createController(value: string): templa.mvc.IController {
            var labelController = new templa.dom.samples.mvc.controller.label.LabelController(this._labelViewFactory, this._labelViewSelector);
            labelController.setModel(new templa.dom.samples.mvc.controller.label.ImmutableLabelModel(value));

            // create an input controller
            var inputController = new templa.dom.samples.mvc.controller.text_input.TextInputController(this._inputViewFactory, this._inputValueSelector, this._inputButtonSelector);
            inputController.setModel(this);

            return this._toolbarDecoratorFactory([labelController, inputController]);
        }

        public _entryToDescription(entry: templa.mvc.composite.IAbstractStackControllerModelEntry): any {
            return entry.data;
        }

        public _createEntryFromDescription(description: string): templa.mvc.composite.IAbstractStackControllerModelEntry {
            var controller = this._createController(description);
            return {
                controller: controller,
                data: description
            };
        }
    }

}
