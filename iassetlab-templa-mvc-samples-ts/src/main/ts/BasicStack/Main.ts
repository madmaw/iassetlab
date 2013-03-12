///<reference path="../../lib/templa-mvc-core.d.ts"/>
///<reference path="../../lib/templa-mvc-element.d.ts"/>
///<reference path="../Controller/TextInput/ITextInputModel.ts"/>
///<reference path="../Controller/Label/LabelController.ts"/>
///<reference path="../Controller/Label/ILabelModel.ts"/>

// Module
module Templa.MVC.Samples.BasicStack {

    // Class
    export class BasicStackModel extends Templa.MVC.AbstractModel implements Templa.MVC.Samples.Controller.TextInput.ITextInputModel, Templa.MVC.Composite.IStackControllerModel {

        private controllerStack: Templa.MVC.Samples.Controller.Label.LabelController[];
        private labelViewKey: string;
        private labelViewFactory: Templa.MVC.Element.IElementViewFactory;

        // Constructor
        constructor() {
            super();
            this.controllerStack = [];
            this.labelViewKey = "label";
            this.labelViewFactory = new Templa.MVC.Element.HTMLElementViewFactory("<span key='"+this.labelViewKey+"'></span>");
        }

        getValue(): string {
            return "";
        }

        requestSubmit(value: string) {
            // push a new controller
            
            var labelController = new Templa.MVC.Samples.Controller.Label.LabelController(this.labelViewFactory, this.labelViewKey);
            labelController.setModel(new LabelModel(value));
            this.controllerStack.push(labelController);
            // TODO probably should have old controller in there too
            this._fireModelChangeEvent(new Templa.MVC.ModelChangeEvent("pushed", labelController));
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

        getControllers(): Templa.MVC.IController[]{
            var controllers: Templa.MVC.IController[] = [];
            if (this.controllerStack.length > 0) {
                var topController = this.controllerStack[this.controllerStack.length - 1];
                controllers.push(topController);
            }
            return controllers;
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
        var stackModel = new BasicStackModel();

        var stackViewFactory = new Templa.MVC.Element.HTMLElementViewFactory("<div key='stack'></div>");
        var stackController = new Templa.MVC.Element.Composite.StackElementController(stackViewFactory);
    }

}