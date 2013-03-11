///<reference path="../../IModel.ts"/>
///<reference path="../../IController.ts"/>

module Templa.Controller.Composite {
    export interface ICompositeControllerModel extends Templa.IModel {
        getControllers():Templa.IController[];
    }
}