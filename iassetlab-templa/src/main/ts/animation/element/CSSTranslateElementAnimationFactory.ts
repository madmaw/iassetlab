///<reference path="IElementAnimationFactory.ts"/>
///<reference path="CSSElementAnimation.ts"/>
///<reference path="../IAnimation.ts"/>

// Module
module templa.animation.element {

    // Class
    export class CSSTranslateElementAnimationFactory implements IElementAnimationFactory {

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

            var initialStyle: string = "position:relative; top:"+initialY+"px;left:"+initialX+"px;";
            var transformStyle: string = "all "+this._timeSeconds+"s ease-in translate("+(finalX-initialX)+"px ,"+(finalY - initialY)+"px)";
            return new CSSElementAnimation(initialStyle, transformStyle);
        }
    }

}
