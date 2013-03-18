///<reference path="../IView.ts"/>

module templa.mvc.element {
    export interface IElementView extends templa.mvc.IView {

        find(key:string):Element;

        getRoots():Node[];
    }
}