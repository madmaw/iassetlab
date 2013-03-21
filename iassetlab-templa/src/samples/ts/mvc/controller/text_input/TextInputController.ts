///<reference path="../../../../../main/ts/mvc/element/jquery/AbstractJQueryController.ts"/>
///<reference path="ITextInputModel.ts"/>

// Module
module templa.samples.mvc.controller.text_input {

    // Class
    export class TextInputController extends templa.mvc.element.jquery.AbstractJQueryController {
        // Constructor
        constructor(
            _viewFactory: templa.mvc.element.IElementViewFactory,
            private _inputElementSelector: string,
            private _buttonElementSelector: string
        ) {
            super(_viewFactory);
        }

        public _doStart(): bool {
            // listen upon the button for click events
            this.$(this._buttonElementSelector).click(() => {
                var value: string = this.getValue();
                var textInputModel: ITextInputModel = <ITextInputModel>this._model;
                textInputModel.requestSubmit(value);
            });
            return true;
        }

        public getValue():string {
            return this.$(this._inputElementSelector).val();
        }

        public _doLoad(model: templa.mvc.IModel) {
            var inputModel: ITextInputModel = <ITextInputModel>model;
            var value = inputModel.getValue();
            this.$(this._inputElementSelector).val(value);
        }

    }

}
