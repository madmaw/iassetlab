///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>

// Module
module iassetlab.client.core.mvc.home {

    // Class
    export interface IHomeControllerModel extends templa.mvc.IModel {

        getDisplayedOption():string;

        requestDisplayOption(option:string): void;

    }
}