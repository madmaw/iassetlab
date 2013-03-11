///<reference path="../ICompositeControllerModel.ts"/>

module Templa.Controller.Composite.Stack {
    export interface IStackControllerModel extends Templa.Controller.Composite.ICompositeControllerModel {
        isStackEmpty():bool;

        canPop():bool;

        requestPop():void;
    }
}