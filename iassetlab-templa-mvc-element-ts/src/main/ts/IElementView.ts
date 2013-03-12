module Templa.MVC.Element {
    export interface IElementView {

        attach();

        detach();

        find(key:string):Element;

        getRoots():Node[];
    }
}