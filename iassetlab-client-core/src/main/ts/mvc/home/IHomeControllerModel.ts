///<reference path="../../../../../../iassetlab-templa/src/main/ts/mvc/IModel.ts"/>

// Module
module iassetlab.client.core.mvc.home {

    // Class
    export interface IHomeControllerModel extends templa.mvc.IModel {

        displayedOption:string;

        requestDisplayOption(option:string): void;

    }
}