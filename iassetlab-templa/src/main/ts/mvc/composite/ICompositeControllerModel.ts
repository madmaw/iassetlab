///<reference path="../IModel.ts"/>
///<reference path="../IController.ts"/>

module templa.mvc.composite {

    export var compositeControllerModelEventControllersChanged = "controllersChanged";

    export interface ICompositeControllerModel extends templa.mvc.IModel {
        getControllers(): templa.mvc.IController[];
    }
}