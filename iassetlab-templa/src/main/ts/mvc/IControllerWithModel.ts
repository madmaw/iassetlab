///<reference path="IModel.ts"/>
///<reference path="IController.ts"/>

module templa.mvc {

    export interface IControllerWithModel<ModelType extends IModel> extends IController {

        setModel(model:ModelType): void;
    }

}