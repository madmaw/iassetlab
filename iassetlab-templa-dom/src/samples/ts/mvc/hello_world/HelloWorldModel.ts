///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>

///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/> 
///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/> 

// Module  
module templa.dom.samples.mvc.hello_world {
    export class HelloWorldModel extends templa.mvc.AbstractModel implements templa.dom.samples.mvc.controller.label.ILabelModel {
        private _name: string;

        constructor(_name: string) {
            super();
            this._name = _name;
        }

        public getLabel(): string {
            return this._name;
        }
    }
}

