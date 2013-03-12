///<reference path="ICompositeControllerModel.ts"/>

module Templa.MVC.Composite {
    export interface IStackControllerModel extends Templa.MVC.Composite.ICompositeControllerModel {
        isStackEmpty():bool;

        canPop():bool;

        requestPop():void;
    }
}