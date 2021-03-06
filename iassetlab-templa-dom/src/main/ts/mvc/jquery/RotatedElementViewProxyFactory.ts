﻿///<reference path="RotatedElementViewProxy.ts"/>
///<reference path="../IElementReference.ts"/>
///<reference path="../IElementView.ts"/>
///<reference path="../IElementViewFactory.ts"/>
///<reference path="../DirectElementReference.ts"/>

///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc.jquery {

    export class RotatedElementViewProxyFactory implements templa.dom.mvc.IElementViewFactory {

        constructor(private _proxied: templa.dom.mvc.IElementViewFactory, private _useContainer?:boolean) {

        }

        create(container: IElementReference, prepend?: boolean): IElementView {
            
            var element = document.createElement("div");
            var proxyContainer = new templa.dom.mvc.DirectElementReference(element);
            var proxied = this._proxied.create(proxyContainer, false);
            return new RotatedElementViewProxy(container, this._useContainer, prepend, proxied, element);
        }
    }
}