///<reference path="IElementView.ts"/>
///<reference path="IElementReference.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc {
    export interface IElementViewFactory {
        create(container: IElementReference, prepend?:boolean):IElementView;
    }
}