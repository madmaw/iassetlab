///<reference path="../../../../../../iassetlab-templa/src/main/ts/mvc/composite/IStackControllerModel.ts"/>

// Module
module iassetlab.client.core.mvc.stack {

    // Class
    export interface IBackForwardStackControllerModel extends templa.mvc.composite.IStackControllerModel {

        canPush(): bool;

        requestPush(): void;
    }

}

