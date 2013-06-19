///<reference path="../IController.ts"/>
///<reference path="../IModel.ts"/>

// Module
module templa.mvc.list {

    // Class
    export interface IListControllerModel extends templa.mvc.IModel {

        getController(index: number, reuseController: templa.mvc.IController<templa.mvc.IModel>): templa.mvc.IController<templa.mvc.IModel>;

        getControllerType(index: number): string;

        getControllerCount(): number;

    }

}