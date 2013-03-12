///<reference path="IElementViewFactory.ts"/>
///<reference path="HTMLElementView.ts"/>

module Templa.MVC.Element {
    export class HTMLElementViewFactory implements IElementViewFactory {

        constructor(private _html:string) {

        }

        public create(container: Element): IElementView {
            return new HTMLElementView(this._html, <HTMLElement><any>container);
        }
    }
}