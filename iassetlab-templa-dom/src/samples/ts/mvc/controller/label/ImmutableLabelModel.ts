///<reference path="ILabelModel.ts"/>

///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/> 
///<reference path="../../../../../../build/dist/iassetlab-templa-dom.d.ts"/> 

// Module
module templa.dom.samples.mvc.controller.label {

    // Class
    export class ImmutableLabelModel extends templa.mvc.AbstractModel implements templa.dom.samples.mvc.controller.label.ILabelModel {

        constructor(private _label: string) {
            super(); 
        }

        public getLabel(): string {
            return this._label;
        }

        
    }

}