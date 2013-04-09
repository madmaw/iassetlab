///<reference path="../../../../main/ts/mvc/IController.ts"/>
///<reference path="../../../../main/ts/mvc/composite/AbstractStackControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/composite/IStackControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/command/CommandControllerModelAdapter.ts"/>
///<reference path="../../../../main/ts/mvc/element/DirectElementReference.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/command/ICommandJQueryViewDescriptionFactory.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/command/ToolbarCommandJQueryController.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/composite/StackJQueryController.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/composite/KeyedJQueryController.ts"/>
///<reference path="../../../../main/ts/mvc/element/TemplateElementViewFactory.ts"/>
///<reference path="../../../../main/ts/animation/element/CSSElementClassAnimationFactory.ts"/>
///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>
///<reference path="../controller/label/ImmutableLabelModel.ts"/>
///<reference path="../controller/text_input/TextInputController.ts"/>
///<reference path="../controller/text_input/ITextInputModel.ts"/>

// Module
module templa.samples.mvc.decorated_stack {

    // Class
    export class DecoratedStackModel extends templa.mvc.composite.AbstractStackControllerModel implements templa.samples.mvc.controller.text_input.ITextInputModel, templa.mvc.composite.IStackControllerModel {
        
        // Constructor
        constructor(
            private _topLevelController: templa.mvc.IController           
,
            private _labelViewFactory: templa.mvc.element.IElementViewFactory,
            private _labelViewSelector: string,
            private _inputViewFactory: templa.mvc.element.IElementViewFactory,
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
            var labelController = new templa.samples.mvc.controller.label.LabelController(this._labelViewFactory, this._labelViewSelector);
            labelController.setModel(new templa.samples.mvc.controller.label.ImmutableLabelModel(value));

            // create an input controller
            var inputController = new templa.samples.mvc.controller.text_input.TextInputController(this._inputViewFactory, this._inputValueSelector, this._inputButtonSelector);
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
