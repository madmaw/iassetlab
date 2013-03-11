///<reference path="../../../lib/templa-mvc-core.d.ts"/>
///<reference path="ITextInputModel.ts"/>

// Module
module Templa.Samples.Controller.TextInput {

    // Class
    export class TextInputController extends Templa.Controller.AbstractElementViewController {
        // Constructor
        constructor(
            _viewFactory: Templa.Controller.IElementViewFactory,
            private _inputElementKey: string,
            private _buttonElementKey: string
        ) {
            super(_viewFactory);
        }

        public start() {
            super.start();
            // listen upon the button for click events
            var buttonElement: HTMLInputElement = <HTMLInputElement>this._find(this._buttonElementKey);
            buttonElement.onclick = () => {
                var value:string = this.getValue();
                var textInputModel:ITextInputModel = <ITextInputModel>this._model;
                textInputModel.requestSubmit(value);
            };
        }

        public getValue():string {
            var inputElement: HTMLInputElement = <HTMLInputElement>this._find(this._inputElementKey);
            return inputElement.value;
        }

        public _load(model: Templa.IModel) {
            var inputModel: ITextInputModel = <ITextInputModel>model;
            var value = inputModel.getValue();
            var inputElement: HTMLInputElement = <HTMLInputElement>this._find(this._inputElementKey);
            inputElement.value = value;
        }

    }

}
