///<reference path="RotatedElementViewProxy.ts"/>
///<reference path="../IElementViewFactory.ts"/>
///<reference path="../DirectElementReference.ts"/>

module templa.mvc.element.jquery {

    export class RotatedElementViewProxyFactory implements templa.mvc.element.IElementViewFactory {

        constructor(private _proxied: templa.mvc.element.IElementViewFactory, private _useContainer?:bool) {

        }

        create(container: IElementReference, prepend?: bool): IElementView {
            
            var element = document.createElement("div");
            var proxyContainer = new templa.mvc.element.DirectElementReference(element);
            var proxied = this._proxied.create(proxyContainer, false);
            return new RotatedElementViewProxy(container, this._useContainer, prepend, proxied, element);
        }
    }
}