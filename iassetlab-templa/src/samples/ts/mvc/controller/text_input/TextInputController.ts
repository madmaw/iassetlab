///<reference path="../../../../../main/ts/mvc/element/AbstractElementController.ts"/>
///<reference path="ITextInputModel.ts"/>

// Module
module templa.samples.mvc.controller.text_input {

    // Class
    export class TextInputController extends templa.mvc.element.AbstractElementController {
        // Constructor
        constructor(
            _viewFactory: templa.mvc.element.IElementViewFactory,
            private _inputElementKey: string,
            private _buttonElementKey: string
        ) {
            super(_viewFactory);
        }

        public _doStart(): bool {
            // listen upon the button for click events
            var buttonElement: HTMLInputElement = <HTMLInputElement><any>this._find(this._buttonElementKey);
            buttonElement.onclick = () => {
                var value: string = this.getValue();
                var textInputModel: ITextInputModel = <ITextInputModel>this._model;
                textInputModel.requestSubmit(value);
            };
            return true;
        }

        public getValue():string {
            var inputElement: HTMLInputElement = <HTMLInputElement><any>this._find(this._inputElementKey);
            return inputElement.value;
        }

        public _doLoad(model: templa.mvc.IModel) {
            var inputModel: ITextInputModel = <ITextInputModel>model;
            var value = inputModel.getValue();
            var inputElement: HTMLInputElement = <HTMLInputElement><any>this._find(this._inputElementKey);
            inputElement.value = value;
        }

    }

}
