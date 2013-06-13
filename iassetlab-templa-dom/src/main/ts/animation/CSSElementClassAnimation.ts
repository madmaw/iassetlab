///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.animation {

    export var cssAnimationEndEventNames = ["animationend", "webkitAnimationEnd", "oanimationend", "MSAnimationEnd"];
     
    // Class
    export class CSSElementClassAnimation extends templa.animation.AbstractAnimation {

        private _animationListener: EventListener;
        

        // Constructor
        constructor(private _view: Element, private _class: string, private _maxTimeMillis?: number, private _lifecycleFunction?: (phase: string, view: Element) => void ) {
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
            if (this._lifecycleFunction != null) {
                this._lifecycleFunction(templa.animation.animationStateInitialized, this._view);
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
            if (this._maxTimeMillis != null) {
                setTimeout(this._animationListener, this._maxTimeMillis);
            }
            if (this._lifecycleFunction != null) {
                this._lifecycleFunction(templa.animation.animationStateStarted, this._view);
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
            var result;
            if (clazz != null) {
                var index = clazz.indexOf(this._class);
                if (index >= 0) {
                    clazz = clazz.substring(0, index) + clazz.substring(index + this._class.length);
                    this._view.setAttribute("class", clazz);
                    result = true;
                    if (this._lifecycleFunction != null) {
                        // slight delay to allow CSS to complete?!
                        var delay;
                        if (this._maxTimeMillis != null) {
                            // assume that any queued up animations will run on similar timescales
                            delay = this._maxTimeMillis / 2;
                        } else {
                            delay = 100;
                        }
                        window.setTimeout(() => {
                            this._lifecycleFunction(templa.animation.animationStateFinished, this._view);
                        }, delay);
                    }

                } else {
                    result = false;
                }
            } else {
                result = false;
            }
            return result;
        }

    }

}