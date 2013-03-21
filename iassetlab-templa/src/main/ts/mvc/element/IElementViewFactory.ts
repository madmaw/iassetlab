///<reference path="IElementView.ts"/>
///<reference path="../IElementReference.ts"/>
module templa.mvc.element {
    export interface IElementViewFactory {
        create(container: IElementReference):IElementView;
    }
}