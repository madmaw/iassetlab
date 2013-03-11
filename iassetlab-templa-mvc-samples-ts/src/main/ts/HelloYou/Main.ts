///<reference path="../../lib/templa-mvc-core.d.ts"/>
///<reference path="../Controller/Label/LabelController.ts"/>
///<reference path="../Controller/Label/ILabelModel.ts"/>
///<reference path="../Controller/TextInput/TextInputController.ts"/>
///<reference path="../Controller/TextInput/ITextInputModel.ts"/>

module Templa.Samples.HelloYou {
    export class HelloYouModel extends Templa.Model.AbstractModel implements Templa.Samples.Controller.Label.ILabelModel, Templa.Samples.Controller.TextInput.ITextInputModel {
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
            this._fireModelChangeEvent(new Templa.ModelChangeEvent());
        }
    }

    export function init(labelContainer:Element, inputContainer:Element) {
        var helloYouModel = new HelloYouModel("You");

        var labelViewFactory = new Templa.Controller.View.HTMLElementViewFactory("Hello <span key='name_element'></span>!");
        var labelController = new Templa.Samples.Controller.Label.LabelController(labelViewFactory, "name_element");
        labelController.setModel(helloYouModel);
        labelController.init(labelContainer);
        labelController.start();

        var textInputViewFactory = new Templa.Controller.View.HTMLElementViewFactory("<input key='input_element'></input><br/><input type='button' key='input_button' value='Submit'></input>");
        var textInputController = new Templa.Samples.Controller.TextInput.TextInputController(textInputViewFactory, "input_element", "input_button");
        textInputController.setModel(helloYouModel);
        textInputController.init(inputContainer);
        textInputController.start();
    }

}

