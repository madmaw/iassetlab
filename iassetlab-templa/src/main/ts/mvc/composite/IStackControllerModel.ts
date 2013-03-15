///<reference path="ICompositeControllerModel.ts"/>

module templa.mvc.composite {
    export interface IStackControllerModel extends templa.mvc.composite.ICompositeControllerModel {
        isStackEmpty():bool;

        canPop():bool;

        requestPop():void;
    }
}