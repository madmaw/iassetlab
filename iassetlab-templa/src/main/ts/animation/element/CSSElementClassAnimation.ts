///<reference path="../AbstractAnimation.ts"/>

// Module
module templa.animation.element {

    export var cssAnimationEndEventNames = ["animationend", "webkitAnimationEnd", "oanimationend", "MSAnimationEnd"];

    // Class
    export class CSSElementClassAnimation extends AbstractAnimation {

        private _animationListener: EventListener;
        

        // Constructor
        constructor(private _view: Element, private _class: string, private _maxTimeMillis?:number) {
            super();
            this._animationListener = (e:Event) => {
                this.destroy();
            };
        }

        public _doInit(): bool {
            for (var i in cssAnimationEndEventNames) {
                var cssAnimationEndEventName = cssAnimationEndEventNames[i];
                this._view.addEventListener(cssAnimationEndEventName, this._animationListener, false);
            }
            return true;
        }

        public _doStart(): bool {
            var clazz = this._view.getAttribute("class");
            if (clazz == null || clazz.length == 0) {
                clazz = this._class;
            } else {
                clazz += " " + this._class;
            }
            this._view.setAttribute("class", clazz);
            // force destroy if max time millis supplied
            if (this._maxTimeMillis) {
                setTimeout(this._animationListener, this._maxTimeMillis);
            }
            return true;
        }

        public _doDestroy(): bool {
            for (var i in cssAnimationEndEventNames) {
                var cssAnimationEndEventName = cssAnimationEndEventNames[i];
                this._view.removeEventListener(cssAnimationEndEventName, this._animationListener, false);
            }
            // remove this class
            var clazz = this._view.getAttribute("class");
            if (clazz != null) {
                var index = clazz.indexOf(this._class);
                if (index >= 0) {
                    clazz = clazz.substring(0, index) + clazz.substring(index + this._class.length);
                    this._view.setAttribute("class", clazz);
                }
            }
            return true;
        }

    }

}