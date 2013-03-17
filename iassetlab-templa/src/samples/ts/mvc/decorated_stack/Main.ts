///<reference path="../../../../main/ts/mvc/IController.ts"/>
///<reference path="../../../../main/ts/mvc/composite/AbstractStackControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/composite/IStackControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/command/CommandControllerModelAdapter.ts"/>
///<reference path="../../../../main/ts/mvc/element/command/ICommandElementViewFactory.ts"/>
///<reference path="../../../../main/ts/mvc/element/command/ToolbarCommandElementController.ts"/>
///<reference path="../../../../main/ts/mvc/element/composite/StackElementController.ts"/>
///<reference path="../../../../main/ts/mvc/element/composite/KeyedElementController.ts"/>
///<reference path="../../../../main/ts/mvc/element/handlebars/HandlebarsElementViewFactory.ts"/>
///<reference path="../../../../main/ts/mvc/element/handlebars/command/HandlebarsCommandElementViewFactory.ts"/>
///<reference path="../../../../main/ts/animation/element/CSSTranslateElementAnimationFactory.ts"/>
///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>
///<reference path="../controller/text_input/TextInputController.ts"/>
///<reference path="../controller/text_input/ITextInputModel.ts"/>

// Module
module templa.samples.mvc.decorated_stack {

    // Class
    export class DecoratedStackModel extends templa.mvc.composite.AbstractStackControllerModel implements templa.samples.mvc.controller.text_input.ITextInputModel, templa.mvc.composite.IStackControllerModel {
        
        private labelViewKey: string;
        private labelViewFactory: templa.mvc.element.IElementViewFactory;
        private decoratorToolbarViewKey: string;
        private decoratorBodyViewKey: string;
        private decoratorViewFactory: templa.mvc.element.IElementViewFactory;
        private toolbarBackViewKey: string;
        private toolbarGeneralViewKey: string;
        private toolbarViewFactory: templa.mvc.element.IElementViewFactory;
        private toolbarCommandElementViewFactory: templa.mvc.element.command.ICommandElementViewFactory;

        // Constructor
        constructor(private _topLevelController:templa.mvc.IController) {
            super();
            this.labelViewKey = "label";
            this.labelViewFactory = new templa.mvc.element.handlebars.HandlebarsElementViewFactory(
                "<span id='{{id}}' key='{{label_key}}'></span>",
                "id",
                { label_key: this.labelViewKey }
            );
            this.decoratorToolbarViewKey = "toolbar";
            this.decoratorBodyViewKey = "body";
            this.decoratorViewFactory = new templa.mvc.element.handlebars.HandlebarsElementViewFactory(
                "<div id='{{id}}'><div key='{{toolbar_key}}'></div><div key='{{view_key}}'></div></div>", 
                "id",
                { toolbar_key: this.decoratorToolbarViewKey, view_key: this.decoratorBodyViewKey }
            );
            this.toolbarBackViewKey = "back";
            this.toolbarGeneralViewKey = "general";
            this.toolbarViewFactory = new templa.mvc.element.handlebars.HandlebarsElementViewFactory(
                "<div id='{{id}}'><div key='{{back_buttons}}'></div><div key='{{general_buttons}}'></div></div>",
                "id",
                { back_buttons: this.toolbarBackViewKey, general_buttons: this.toolbarGeneralViewKey }
            );

            this.toolbarCommandElementViewFactory = new templa.mvc.element.handlebars.commands.HandlebarsCommandElementViewFactory(
                "<a key='{{key}}' id='{{id}}'>{{command.id}}</a>",
                "id",
                "key"               
            );
        }

        getValue(): string {
            return "";
        }

        requestSubmit(value: string) {
            // push a new controller

            var labelController = new templa.samples.mvc.controller.label.LabelController(this.labelViewFactory, this.labelViewKey);
            labelController.setModel(new LabelModel(value));

            var toolbarController = new templa.mvc.element.command.ToolbarCommandElementController(this.toolbarViewFactory, this.toolbarCommandElementViewFactory, this.toolbarBackViewKey, this.toolbarGeneralViewKey);
            toolbarController.setModel(new templa.mvc.command.CommandControllerModelAdapter(this._topLevelController));

            var decoratorController = new templa.mvc.element.composite.KeyedElementController(this.decoratorViewFactory);
            decoratorController.setModel(new ToolbarDecoratorModel(toolbarController, this.decoratorToolbarViewKey, labelController, this.decoratorBodyViewKey));

            this._push(decoratorController);
        }
    }



    export class ToolbarDecoratorModel extends templa.mvc.AbstractModel implements templa.mvc.composite.IKeyedControllerModel {

        constructor(private _toolbarController: templa.mvc.IController, private _toolbarControllerKey: string, private _otherController: templa.mvc.IController, private _otherControllerKey:string) {
            super();
        }

        public getControllerKey(controller: templa.mvc.IController): string {
            var result: string;
            if (controller == this._toolbarController) {
                result = this._toolbarControllerKey;
            } else {
                result = this._otherControllerKey;
            }
            return result;
        }

        public getControllers(): templa.mvc.IController[]{
            return [this._toolbarController, this._otherController];
        }
    }

    export class LabelModel extends templa.mvc.AbstractModel implements templa.samples.mvc.controller.label.ILabelModel {

        constructor(private _label: string) {
            super();
        }

        public getLabel(): string {
            return this._label;
        }
    }

    export function init(stackContainer: Element, inputContainer: Element) {

        var stackViewFactory = new templa.mvc.element.handlebars.HandlebarsElementViewFactory(
            "<div id='{{id}}' key='stack'></div>",
            "id"
        );
        var pushAddAnimationFactory = new templa.animation.element.CSSTranslateElementAnimationFactory(10, 1, 0, 0, 0);
        var pushRemoveAnimationFactory = new templa.animation.element.CSSTranslateElementAnimationFactory(10, 0, 0, -1, 0);
        var popAddAnimationFactory = new templa.animation.element.CSSTranslateElementAnimationFactory(10, -1, 0, 0, 0);
        var popRemoveAnimationFactory = new templa.animation.element.CSSTranslateElementAnimationFactory(10, 0, 0, 1, 0);
        var stackController = new templa.mvc.element.composite.StackElementController(
            stackViewFactory,
            popAddAnimationFactory,
            popRemoveAnimationFactory,
            pushAddAnimationFactory,
            pushRemoveAnimationFactory
        );
        var stackModel = new DecoratedStackModel(stackController);
        stackController.setModel(stackModel);
        stackController.init(stackContainer);
        stackController.start();

        var inputElementKey = "input_element";
        var inputButtonKey = "input_button";
        var inputViewFactory = new templa.mvc.element.handlebars.HandlebarsElementViewFactory(
            "<div id='{{id}}'><input key='{{input_element}}'></input><br/><input type='button' key='{{input_button}}' value='Submit'></input></div>",
            "id",
            { input_element: inputElementKey, input_button: inputButtonKey }
        );
        var inputController = new templa.samples.mvc.controller.text_input.TextInputController(inputViewFactory, inputElementKey, inputButtonKey);
        inputController.setModel(stackModel);
        inputController.init(inputContainer);
        inputController.start();
    }

}
