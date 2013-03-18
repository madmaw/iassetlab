///<reference path="IElementAnimationFactory.ts"/>
///<reference path="CSSTranslateElementTransitionAnimation.ts"/>
///<reference path="../IAnimation.ts"/>

// Module
module templa.animation.element {

    // Class
    export class CSSTranslateElementTransitionAnimationFactory implements IElementAnimationFactory {

        // Constructor
        constructor(
            private _timeSeconds: number,
            private _xMultFrom: number,
            private _yMultFrom: number,
            private _xMultTo: number,
            private _yMultTo:number
        ) {
        }
        

        public create(container: Element, view: Element): IAnimation {
            var bounds = container.getBoundingClientRect();
            
            var initialX = this._xMultFrom * bounds.width;
            var initialY = this._yMultFrom * bounds.height;
            var finalX = this._xMultTo * bounds.width;
            var finalY = this._yMultTo * bounds.height;

            var transformStyle: string = "translate(" + (finalX - initialX) + "px ," + (finalY - initialY) + "px)";
            var transitionStyle: string = "all " + this._timeSeconds + "s ease-in";
            return new CSSTranslateElementTransitionAnimation(view, initialX, initialY, transitionStyle, transformStyle);
        }
    }

}
