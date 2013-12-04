///<reference path="ITextInputModel.ts"/>

///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../../build/dist/iassetlab-templa-dom.d.ts"/> 

// Module 
module templa.dom.samples.mvc.controller.text_input {

    // Class
    export class TextInputController extends templa.dom.mvc.jquery.AbstractJQueryController<ITextInputModel> {
        // Constructor
        constructor(
            _viewFactory: templa.dom.mvc.IElementViewFactory,
            private _inputElementSelector: string,
            private _buttonElementSelector: string
        ) {
            super(_viewFactory);
        }

        public _doStart(): boolean {
            // listen upon the button for click events
            this.$(this._buttonElementSelector).click(() => {
                this._requestSubmit();
            });
            this.$(this._inputElementSelector).keypress((e:KeyboardEvent) => {
                if (e.which == 13) {
                    this._requestSubmit();
                    e.preventDefault();
                }
            });
            return true;
        }

        private _requestSubmit() {
            var value: string = this.getValue();
            var textInputModel = this._model;
            textInputModel.requestSubmit(value);
        }

        public getValue():string {
            return this.$(this._inputElementSelector).val();
        }

        public _doLoad(model: ITextInputModel) {
            var inputModel = model;
            var value = inputModel.getValue();
            this.$(this._inputElementSelector).val(value);
        }

    }

}
