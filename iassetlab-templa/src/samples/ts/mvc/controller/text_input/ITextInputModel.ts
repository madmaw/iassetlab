///<reference path="../../../../../main/ts/mvc/IModel.ts"/>

// Module
module templa.samples.mvc.controller.text_input {

    // Class
    export interface ITextInputModel extends templa.mvc.IModel {
        
        getValue(): string;

        requestSubmit(value: string);
    }

}