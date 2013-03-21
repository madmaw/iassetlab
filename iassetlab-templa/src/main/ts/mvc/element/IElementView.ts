///<reference path="../IView.ts"/>
///<reference path="../IElementReference.ts"/>

module templa.mvc.element {
    export interface IElementView extends templa.mvc.IView {

        getRoots():Node[];
    }
}