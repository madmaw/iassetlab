///<reference path="../../../lib/templa-mvc-core.d.ts"/>
///<reference path="../../../lib/templa-mvc-element.d.ts"/>
///<reference path="ITextInputModel.ts"/>

// Module
module Templa.MVC.Samples.Controller.TextInput {

    // Class
    export class TextInputController extends Templa.MVC.Element.AbstractElementController {
        // Constructor
        constructor(
            _viewFactory: Templa.MVC.Element.IElementViewFactory,
            private _inputElementKey: string,
            private _buttonElementKey: string
        ) {
            super(_viewFactory);
        }

        public start() {
            super.start();
            // listen upon the button for click events
            var buttonElement: HTMLInputElement = <HTMLInputElement><any>this._find(this._buttonElementKey);
            buttonElement.onclick = () => {
                var value:string = this.getValue();
                var textInputModel:ITextInputModel = <ITextInputModel>this._model;
                textInputModel.requestSubmit(value);
            };
        }

        public getValue():string {
            var inputElement: HTMLInputElement = <HTMLInputElement><any>this._find(this._inputElementKey);
            return inputElement.value;
        }

        public _load(model: Templa.MVC.IModel) {
            var inputModel: ITextInputModel = <ITextInputModel>model;
            var value = inputModel.getValue();
            var inputElement: HTMLInputElement = <HTMLInputElement><any>this._find(this._inputElementKey);
            inputElement.value = value;
        }

    }

}
