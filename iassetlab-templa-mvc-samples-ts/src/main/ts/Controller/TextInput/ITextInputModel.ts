///<reference path="../../../lib/templa-mvc-core.d.ts"/>

// Module
module Templa.MVC.Samples.Controller.TextInput {

    // Class
    export interface ITextInputModel extends Templa.MVC.IModel {
        
        getValue(): string;

        requestSubmit(value: string);
    }

}