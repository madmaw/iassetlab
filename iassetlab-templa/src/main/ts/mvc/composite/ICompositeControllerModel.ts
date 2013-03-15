///<reference path="../IModel.ts"/>
///<reference path="../IController.ts"/>

module templa.mvc.composite {
    export interface ICompositeControllerModel extends templa.mvc.IModel {
        getControllers(): templa.mvc.IController[];
    }
}