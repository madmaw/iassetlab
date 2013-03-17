///<reference path="../IAnimation.ts"/>
///<reference path="../AbstractAnimation.ts"/>

// Module
module templa.animation.element {

    // Class
    export class CSSElementAnimation extends AbstractAnimation {
        // Constructor
        constructor(private _initialStyle, private _transformStyle:string) {
            super();
        }


    }

}
