///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/> 
///<reference path="../../../../../../build/dist/iassetlab-templa-dom.d.ts"/> 
 
// Module
module templa.dom.samples.mvc.controller.label {

    // Class
    export interface ILabelModel extends templa.mvc.IModel {
        getLabel(): string;
    }

}