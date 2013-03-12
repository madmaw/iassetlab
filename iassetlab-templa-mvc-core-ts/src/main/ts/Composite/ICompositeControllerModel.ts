///<reference path="../IModel.ts"/>
///<reference path="../IController.ts"/>

module Templa.MVC.Composite {
    export interface ICompositeControllerModel extends Templa.MVC.IModel {
        getControllers(): Templa.MVC.IController[];
    }
}