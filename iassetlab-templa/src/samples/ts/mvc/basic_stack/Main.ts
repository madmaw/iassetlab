///<reference path="../../../../main/ts/mvc/AbstractModel.ts"/>
///<reference path="../../../../main/ts/mvc/composite/IStackControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/element/IElementViewFactory.ts"/>
///<reference path="../../../../main/ts/mvc/element/DivElementViewFactory.ts"/>
///<reference path="../../../../main/ts/mvc/element/composite/StackElementController.ts"/>

///<reference path="../Controller/label/LabelController.ts"/>
///<reference path="../Controller/label/ILabelModel.ts"/>
///<reference path="../Controller/text_input/TextInputController.ts"/>
///<reference path="../Controller/text_input/ITextInputModel.ts"/>

// Module
module templa.samples.mvc.basic_stack {

    // Class
    export class BasicStackModel extends templa.mvc.AbstractModel implements templa.samples.mvc.controller.text_input.ITextInputModel, templa.mvc.composite.IStackControllerModel {

        private controllerStack: templa.samples.mvc.controller.label.LabelController[];
        private labelViewKey: string;
        private labelViewFactory: templa.mvc.element.IElementViewFactory;

        // Constructor
        constructor() {
            super();
            this.controllerStack = [];
            this.labelViewKey = "label";
            this.labelViewFactory = new templa.mvc.element.DivElementViewFactory("<span key='"+this.labelViewKey+"'></span>");
        }

        getValue(): string {
            return "";
        }

        requestSubmit(value: string) {
            // push a new controller
            
            var labelController = new templa.samples.mvc.controller.label.LabelController(this.labelViewFactory, this.labelViewKey);
            labelController.setModel(new LabelModel(value));
            this.controllerStack.push(labelController);
            // TODO probably should have old controller in there too
            this._fireModelChangeEvent(new templa.mvc.ModelChangeEvent("pushed", labelController));
        }

        isStackEmpty(): bool {
            return this.controllerStack.length == 0;
        }

        canPop(): bool {
            return !this.isStackEmpty();
        }

        requestPop() {
            var popped = this.controllerStack.pop();
            this._fireModelChangeEvent(new templa.mvc.ModelChangeEvent("popped", popped));
        }

        getControllers(): templa.mvc.IController[]{
            var controllers: templa.mvc.IController[] = [];
            if (this.controllerStack.length > 0) {
                var topController = this.controllerStack[this.controllerStack.length - 1];
                controllers.push(topController);
            }
            return controllers;
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
        var stackModel = new BasicStackModel();

        var stackViewFactory = new templa.mvc.element.DivElementViewFactory("<div key='stack'></div>");
        var stackController = new templa.mvc.element.composite.StackElementController(stackViewFactory);
        stackController.setModel(stackModel);
        stackController.init(stackContainer);
        stackController.start();

        var inputElementKey = "input_element";
        var inputButtonKey = "input_button";
        var inputViewFactory = new templa.mvc.element.DivElementViewFactory("<input key='"+inputElementKey+"'></input><br/><input type='button' key='"+inputButtonKey+"' value='Submit'></input>");
        var inputController = new templa.samples.mvc.controller.text_input.TextInputController(inputViewFactory, inputElementKey, inputButtonKey);
        inputController.setModel(stackModel);
        inputController.init(inputContainer);
        inputController.start();
    }

}