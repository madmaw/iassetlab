///<reference path="IElementView.ts"/>
module Templa.MVC.Element {
    export interface IElementViewFactory {
        create(container:Element):IElementView;
    }
}