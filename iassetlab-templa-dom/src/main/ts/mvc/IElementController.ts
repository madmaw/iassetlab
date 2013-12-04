///<reference path="IElementReference.ts"/>

///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>

module templa.dom.mvc {

    export interface IElementController extends templa.mvc.IController {
        init(container: IElementReference, prepend?: boolean): boolean;
    }


}