///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc {
    export interface IElementView extends templa.mvc.IView {

        getRoots():Node[];
    }
}