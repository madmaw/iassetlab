///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="../../../../../build/defs/jquery.d.ts"/>

// Module
module iassetlab.client.core.mvc.stack {

    // Class
    export interface IBackForwardStackControllerModel extends templa.mvc.composite.IStackControllerModel {

        canPush(): boolean;

        requestPush(): void;
    }

}

