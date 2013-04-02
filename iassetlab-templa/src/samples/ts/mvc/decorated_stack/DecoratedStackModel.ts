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
///<reference path="DecoratedStackToolbarDecoratorModel.ts"/>

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
            private _decoratorViewFactory: templa.mvc.element.IElementViewFactory,
            private _decoratorBodyControllerKey: string,
            private _decoratorToolbarControllerKey: string,
            private _toolbarViewFactory: templa.mvc.element.IElementViewFactory,
            private _toolbarBackViewSelector: string,
            private _toolbarGeneralViewSelector: string,
            private _toolbarCommandElementViewFactory: templa.mvc.element.jquery.command.ICommandJQueryViewDescriptionFactory
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
                var labelController = new templa.samples.mvc.controller.label.LabelController(this._labelViewFactory, this._labelViewSelector);
                labelController.setModel(new templa.samples.mvc.controller.label.ImmutableLabelModel(value));

                // create an input controller
                var inputController = new templa.samples.mvc.controller.text_input.TextInputController(this._inputViewFactory, this._inputValueSelector, this._inputButtonSelector);
                inputController.setModel(this);

                var toolbarController = new templa.mvc.element.jquery.command.ToolbarCommandJQueryController(
                    this._toolbarViewFactory,
                    this._toolbarCommandElementViewFactory,
                    this._toolbarBackViewSelector,
                    this._toolbarGeneralViewSelector
                );
                toolbarController.setModel(new templa.mvc.command.CommandControllerModelAdapter(this._topLevelController));

                var decoratorController = new templa.mvc.element.jquery.composite.KeyedJQueryController(
                    this._decoratorViewFactory
                );
                decoratorController.setModel(
                    new DecoratedStackToolbarDecoratorModel(
                        toolbarController,
                        this._decoratorToolbarControllerKey,
                        [labelController, inputController],
                        this._decoratorBodyControllerKey
                    )
                );
                this._push(decoratorController);
            }
        }
    }

}
