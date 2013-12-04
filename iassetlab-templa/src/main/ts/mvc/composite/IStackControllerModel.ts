///<reference path="ICompositeControllerModel.ts"/>

module templa.mvc.composite {

    export var stackControllerModelEventPushed = "pushed";
    export var stackControllerModelEventPopped = "popped";

    export interface IStackControllerModel extends templa.mvc.composite.ICompositeControllerModel {
        isStackEmpty():boolean;

        canPop():boolean;

        requestPop():void;
    }
}