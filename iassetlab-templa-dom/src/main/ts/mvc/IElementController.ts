///<reference path="IElementReference.ts"/>

///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>

module templa.dom.mvc {

    export interface IElementController<ModelType extends templa.mvc.IModel> extends templa.mvc.IController<ModelType> {
        init(container: IElementReference, prepend?: bool): bool;
    }


}