///<reference path="IElementView.ts"/>
module templa.mvc.element {
    export interface IElementViewFactory {
        create(container:Element):IElementView;
    }
}