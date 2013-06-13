///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/> 
///<reference path="../../../../../../build/dist/iassetlab-templa-dom.d.ts"/> 

// Module 
module templa.dom.samples.mvc.controller.text_input {

    // Class
    export interface ITextInputModel extends templa.mvc.IModel {
        
        getValue(): string;

        requestSubmit(value: string);
    }

}