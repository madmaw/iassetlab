///<reference path="../../../../main/ts/mvc/AbstractModel.ts"/>
///<reference path="../../../../main/ts/mvc/ModelChangeEvent.ts"/>
///<reference path="../../../../main/ts/mvc/element/DirectElementReference.ts"/>

///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>
///<reference path="../controller/text_input/TextInputController.ts"/>
///<reference path="../controller/text_input/ITextInputModel.ts"/>

module templa.samples.mvc.hello_you {
    export class HelloYouModel extends templa.mvc.AbstractModel implements templa.samples.mvc.controller.label.ILabelModel, templa.samples.mvc.controller.text_input.ITextInputModel {
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
            this._fireModelChangeEvent(new templa.mvc.ModelChangeEvent());
        }
    }

}

