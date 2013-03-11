///<reference path="IModel.ts"/>

module Templa {

    export interface IController {

        setModel(model:IModel);

        init(container:Element);

        load();

        start();

        stop();

        destroy();
    }

}