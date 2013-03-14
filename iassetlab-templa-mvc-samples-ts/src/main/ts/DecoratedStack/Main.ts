///<reference path="../../lib/templa-mvc-core.d.ts"/>
///<reference path="../../lib/templa-mvc-element.d.ts"/>
///<reference path="../../lib/templa-mvc-element-handlebars.d.ts"/>
///<reference path="../Controller/Label/LabelController.ts"/>
///<reference path="../Controller/Label/ILabelModel.ts"/>
///<reference path="../Controller/TextInput/TextInputController.ts"/>
///<reference path="../Controller/TextInput/ITextInputModel.ts"/>

// Module
module Templa.MVC.Samples.DecoratedStack {

    // Class
    export class DecoratedStackModel extends Templa.MVC.AbstractModel implements Templa.MVC.Samples.Controller.TextInput.ITextInputModel, Templa.MVC.Composite.IStackControllerModel {
        
        private controllerStack: Templa.MVC.Element.Composite.KeyedElementController[];
        private labelViewKey: string;
        private labelViewFactory: Templa.MVC.Element.IElementViewFactory;
        private decoratorToolbarViewKey: string;
        private decoratorBodyViewKey: string;
        private decoratorViewFactory: Templa.MVC.Element.IElementViewFactory;
        private toolbarBackViewKey: string;
        private toolbarGeneralViewKey: string;
        private toolbarViewFactory: Templa.MVC.Element.IElementViewFactory;
        private toolbarCommandElementViewFactory: Templa.MVC.Element.Commands.ICommandElementViewFactory;

        // Constructor
        constructor(private _topLevelController:IController) {
            super();
            this.controllerStack = [];
            this.labelViewKey = "label";
            this.labelViewFactory = new Templa.MVC.Element.Handlebarz.HandlebarsElementViewFactory(
                "<span id='{{id}}' key='{{label_key}}'></span>",
                "id",
                { label_key: this.labelViewKey }
            );
            this.decoratorToolbarViewKey = "toolbar";
            this.decoratorBodyViewKey = "body";
            this.decoratorViewFactory = new Templa.MVC.Element.Handlebarz.HandlebarsElementViewFactory(
                "<div id='{{id}}'><div key='{{toolbar_key}}'></div><div key='{{view_key}}'></div></div>", 
                "id",
                { toolbar_key: this.decoratorToolbarViewKey, view_key: this.decoratorBodyViewKey }
            );
            this.toolbarBackViewKey = "back";
            this.toolbarGeneralViewKey = "general";
            this.toolbarViewFactory = new Templa.MVC.Element.Handlebarz.HandlebarsElementViewFactory(
                "<div id='{{id}}'><div key='{{back_buttons}}'></div><div key='{{general_buttons}}'></div></div>",
                "id",
                { back_buttons: this.toolbarBackViewKey, general_buttons: this.toolbarGeneralViewKey }
            );

            this.toolbarCommandElementViewFactory = new Templa.MVC.Element.Handlebarz.Commands.HandlebarsCommandElementViewFactory(
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

            var labelController = new Templa.MVC.Samples.Controller.Label.LabelController(this.labelViewFactory, this.labelViewKey);
            labelController.setModel(new LabelModel(value));

            var toolbarController = new Templa.MVC.Element.Commands.ToolbarCommandsElementController(this.toolbarViewFactory, this.toolbarCommandElementViewFactory, this.toolbarBackViewKey, this.toolbarGeneralViewKey);
            toolbarController.setModel(new Templa.MVC.Commands.CommandsControllerModelAdapter(this._topLevelController));

            var decoratorController = new Templa.MVC.Element.Composite.KeyedElementController(this.decoratorViewFactory);
            decoratorController.setModel(new ToolbarDecoratorModel(toolbarController, this.decoratorToolbarViewKey, labelController, this.decoratorBodyViewKey));

            this.controllerStack.push(decoratorController);
            // TODO probably should have old controller in there too
            this._fireModelChangeEvent(new Templa.MVC.ModelChangeEvent("pushed", decoratorController));
        }

        isStackEmpty(): bool {
            return this.controllerStack.length == 0;
        }

        canPop(): bool {
            return !this.isStackEmpty();
        }

        requestPop() {
            var popped = this.controllerStack.pop();
            this._fireModelChangeEvent(new Templa.MVC.ModelChangeEvent("popped", popped));
        }

        getControllers(): Templa.MVC.IController[] {
            var controllers: Templa.MVC.IController[] = [];
            if (this.controllerStack.length > 0) {
                var topController = this.controllerStack[this.controllerStack.length - 1];
                controllers.push(topController);
            }
            return controllers;
        }
    }



    export class ToolbarDecoratorModel extends AbstractModel implements Templa.MVC.Composite.IKeyedControllerModel {

        constructor(private _toolbarController:IController, private _toolbarControllerKey:string, private _otherController:IController, private _otherControllerKey:string) {
            super();
        }

        public getControllerKey(controller: IController): string {
            var result: string;
            if (controller == this._toolbarController) {
                result = this._toolbarControllerKey;
            } else {
                result = this._otherControllerKey;
            }
            return result;
        }

        public getControllers(): IController[]{
            return [this._toolbarController, this._otherController];
        }
    }

    export class LabelModel extends Templa.MVC.AbstractModel implements Templa.MVC.Samples.Controller.Label.ILabelModel {

        constructor(private _label: string) {
            super();
        }

        public getLabel(): string {
            return this._label;
        }
    }

    export function init(stackContainer: Element, inputContainer: Element) {

        var stackViewFactory = new Templa.MVC.Element.Handlebarz.HandlebarsElementViewFactory(
            "<div id='{{id}}' key='stack'></div>",
            "id"
        );
        var stackController = new Templa.MVC.Element.Composite.StackElementController(stackViewFactory);
        var stackModel = new DecoratedStackModel(stackController);
        stackController.setModel(stackModel);
        stackController.init(stackContainer);
        stackController.start();

        var inputElementKey = "input_element";
        var inputButtonKey = "input_button";
        var inputViewFactory = new Templa.MVC.Element.Handlebarz.HandlebarsElementViewFactory(
            "<div id='{{id}}'><input key='{{input_element}}'></input><br/><input type='button' key='{{input_button}}' value='Submit'></input></div>",
            "id",
            { input_element: inputElementKey, input_button: inputButtonKey }
        );
        var inputController = new Templa.MVC.Samples.Controller.TextInput.TextInputController(inputViewFactory, inputElementKey, inputButtonKey);
        inputController.setModel(stackModel);
        inputController.init(inputContainer);
        inputController.start();
    }

}
