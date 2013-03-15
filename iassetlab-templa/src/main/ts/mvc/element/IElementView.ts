module templa.mvc.element {
    export interface IElementView {

        attach();

        detach();

        find(key:string):Element;

        getRoots():Node[];
    }
}