///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.animation {

    // Class
    export interface IElementAnimationFactory {
        create(container:Element, view:Element): templa.animation.IAnimation;
    }

}