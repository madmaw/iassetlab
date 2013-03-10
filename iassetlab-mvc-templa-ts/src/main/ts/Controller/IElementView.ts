module Templa.Controller {
    export interface IElementView {

        attach();

        detach();

        find(key:string):Element;

        getRoots():Element[];
    }
}