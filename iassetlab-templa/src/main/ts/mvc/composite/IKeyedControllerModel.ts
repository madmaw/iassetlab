///<reference path="ICompositeControllerModel.ts"/>
///<reference path="../IController.ts"/>

// Module
module templa.mvc.composite {

    // Class
    export interface IKeyedControllerModel extends templa.mvc.composite.ICompositeControllerModel {
        getControllerKey(controller: IController<IModel>): string;
    }

}
