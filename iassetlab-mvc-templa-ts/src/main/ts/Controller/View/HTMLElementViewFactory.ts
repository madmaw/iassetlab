///<reference path="../IElementVewFactory.ts"/>
///<reference path="HTMLElementView.ts"/>

module Templa.Controller.View {
    export class HTMLElementViewFactory implements Templa.Controller.IElementViewFactory {

        public HTMLElementViewFactory(private _html:string) {

        }

        public create(container:Element):Templa.Controller.IElementView {
            return new HTMLElementView(this._html, container);
        }
    }
}