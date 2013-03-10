///<reference path="IElementView.ts"/>
module Templa.Controller {
    export interface IElementViewFactory {
        create(container:Element):IElementView;
    }
}