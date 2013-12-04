///<reference path="IAnimation.ts"/>
///<reference path="AnimationStateChangeEvent.ts"/>
///<reference path="../util/Arrays.ts"/>

// Module
module templa.animation {

    // Class
    export class AbstractAnimation implements IAnimation {

        private _state: string;
        private _animationChangeListeners: { (source: IAnimation, changeEvent: AnimationStateChangeEvent): void; }[];


        // Constructor
        constructor() {
            this._state = animationStateCreated;
            this._animationChangeListeners = [];
        }

        public getState(): string {
            return this._state;
        }

        public init() {
            if (this._doInit()) {
                this._state = animationStateInitialized;
                this._fireAnimationStateChangeEvent(new AnimationStateChangeEvent(this._state));
            }
        }

        public _doInit(): boolean {
            return true;
        }

        public start() {
            if (this._doStart()) {
                this._state = animationStateStarted;
                this._fireAnimationStateChangeEvent(new AnimationStateChangeEvent(this._state));
            }
        }

        public _doStart(): boolean {
            return true;
        }

        public destroy() {
            if (this._doDestroy()) {
                this._state = animationStateFinished;
                this._fireAnimationStateChangeEvent(new AnimationStateChangeEvent(this._state));
            }
        }

        public _doDestroy(): boolean {
            return true;
        }

        public _fireAnimationStateChangeEvent(changeEvent: AnimationStateChangeEvent) {
            for (var i in this._animationChangeListeners) {
                var animationChangeListener: (source: IAnimation, changeEvent: AnimationStateChangeEvent) => void = this._animationChangeListeners[i];
                animationChangeListener(this, changeEvent);
            }
        }

        public addAnimationListener(listener: (source: IAnimation, changeEvent: AnimationStateChangeEvent) => void ) {
            this._animationChangeListeners.push(listener);
        }

        public removeAnimationListener(listener: (source: IAnimation, changeEvent: AnimationStateChangeEvent) => void ) {
            templa.util.Arrays.removeElement(this._animationChangeListeners, listener);
        }


    }

}