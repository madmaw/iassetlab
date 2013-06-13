///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>
///<reference path="../controller/text_input/TextInputController.ts"/>
///<reference path="../controller/text_input/ITextInputModel.ts"/>

///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/> 
///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/> 

// Module  
module templa.dom.samples.mvc.hello_you {
    export class HelloYouModel extends templa.mvc.AbstractModel implements templa.dom.samples.mvc.controller.label.ILabelModel, templa.dom.samples.mvc.controller.text_input.ITextInputModel {
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

        public createStateDescription(models?: templa.mvc.IModel[]): any {
            models = this._checkModels(models);
            return this._name;
        }

        public loadStateDescription(description: any) {
            this._name = description;
        }


    }

}

