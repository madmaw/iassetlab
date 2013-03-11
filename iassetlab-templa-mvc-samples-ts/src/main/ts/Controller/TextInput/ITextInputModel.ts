///<reference path="../../../lib/templa-mvc-core.d.ts"/>

// Module
module Templa.Samples.Controller.TextInput {

    // Class
    export interface ITextInputModel extends Templa.IModel {
        
        getValue(): string;

        requestSubmit(value: string);
    }

}