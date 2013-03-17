///<reference path="../IAnimation.ts"/>

// Module
module templa.animation.element {

    // Class
    export interface IElementAnimationFactory {
        create(container:Element, view:Element): IAnimation;
    }

}