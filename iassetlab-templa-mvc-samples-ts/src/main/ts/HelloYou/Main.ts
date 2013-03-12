///<reference path="../../lib/templa-mvc-core.d.ts"/>
///<reference path="../../lib/templa-mvc-element.d.ts"/>
///<reference path="../Controller/Label/LabelController.ts"/>
///<reference path="../Controller/Label/ILabelModel.ts"/>
///<reference path="../Controller/TextInput/TextInputController.ts"/>
///<reference path="../Controller/TextInput/ITextInputModel.ts"/>

module Templa.MVC.Samples.HelloYou {
    export class HelloYouModel extends Templa.MVC.AbstractModel implements Templa.MVC.Samples.Controller.Label.ILabelModel, Templa.MVC.Samples.Controller.TextInput.ITextInputModel {
        private _name: string;

        constructor(_name: string) {
            super();
            this._name = _name;
        }

        public getLabel(): string {
            return this._name;
        }

        public getValue(): string {
            return this._name;
        }

        public requestSubmit(value: string) {
            this._name = value;
            this._fireModelChangeEvent(new Templa.MVC.ModelChangeEvent());
        }
    }

    export function init(labelContainer:Element, inputContainer:Element) {
        var helloYouModel = new HelloYouModel("You");

        var labelViewFactory = new Templa.MVC.Element.HTMLElementViewFactory("Hello <span key='name_element'></span>!");
        var labelController = new Templa.MVC.Samples.Controller.Label.LabelController(labelViewFactory, "name_element");
        labelController.setModel(helloYouModel);
        labelController.init(labelContainer);
        labelController.start();

        var textInputViewFactory = new Templa.MVC.Element.HTMLElementViewFactory("<input key='input_element'></input><br/><input type='button' key='input_button' value='Submit'></input>");
        var textInputController = new Templa.MVC.Samples.Controller.TextInput.TextInputController(textInputViewFactory, "input_element", "input_button");
        textInputController.setModel(helloYouModel);
        textInputController.init(inputContainer);
        textInputController.start();
    }

}

