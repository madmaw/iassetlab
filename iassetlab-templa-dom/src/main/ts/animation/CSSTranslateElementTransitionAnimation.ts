///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.animation {

    export var CSSElementTransitionEventNames = ["webkitTransitionEnd", "transitionEnd", "otransitionend", "oTransitionEnd"];

    export var CSSElementTransitionNames = ["transition", "-moz-transition", "-webkit-transition", "-o-transition", "-ms-transition"];
    export var CSSElementTransformNames = ["transform", "-moz-transform", "-webkit-transform", "-o-transform", "-ms-transform"];

    // Class
    export class CSSTranslateElementTransitionAnimation extends templa.animation.AbstractAnimation {

        private _animationEventListener:EventListener;

        // Constructor
        constructor(private _view:Element, private _initialX:number, private _initialY:number, private _transitionStyle:string, private _transformStyle:string) {
            super();
            this._animationEventListener = () => {
                this.destroy();
            };
        }

        public _doInit(): boolean {

            var style = this._view.getAttribute("style");
            if (style == null) {
                style = "";
            }
            style += "margin-top: " + this._initialY + "px; margin-left: " + this._initialX + "px;";
            this._view.setAttribute("style", style);
            return true;
        }

        public _doStart(): boolean {
            for (var i in CSSElementTransitionEventNames) {
                var eventName = CSSElementTransitionEventNames[i];
                this._view.addEventListener(eventName, this._animationEventListener, false);
            }
            var style = this._view.getAttribute("style");
            if (style == null) {
                style = "";
            }
            for (var i in CSSElementTransitionNames) {
                var name = CSSElementTransitionNames[i];
                style += name;
                style += " : ";
                style += this._transitionStyle;
                style += "; ";
            }
            for (var i in CSSElementTransformNames) {
                var name = CSSElementTransformNames[i];
                style += name;
                style += " : ";
                style += this._transformStyle;
                style += "; ";
            }
            this._view.setAttribute("style", style);
            return true;
        }

        public _doDestroy(): boolean {
            for (var i in CSSElementTransitionEventNames) {
                var eventName = CSSElementTransitionEventNames[i];
                this._view.removeEventListener(eventName, this._animationEventListener);
            }
            return true;
        }
    }

}
