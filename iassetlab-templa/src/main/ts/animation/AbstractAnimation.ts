///<reference path="IAnimation.ts"/>
///<reference path="../util/Arrays.ts"/>

// Module
module templa.animation {

    // Class
    export class AbstractAnimation implements IAnimation {

        private _state: string;
        private _aniationChangeListeners: { (source: IAnimation, changeEvent: AnimationStateChangeEvent): void; }[];


        // Constructor
        constructor() {
            this._state = animationStateCreated;
            this._aniationChangeListeners = [];
        }

        public getState(): string {
            return this._state;
        }

        public init() {
            this._state = animationStateInitialized;
            this._fireAnimationStateChangeEvent(new AnimationStateChangeEvent(this._state));
        }

        public start() {
            this._state = animationStateStarted;
            this._fireAnimationStateChangeEvent(new AnimationStateChangeEvent(this._state));
        }

        public destroy() {
            this._state = animationStateFinished;
            this._fireAnimationStateChangeEvent(new AnimationStateChangeEvent(this._state));
        }

        public _fireAnimationStateChangeEvent(changeEvent: AnimationStateChangeEvent) {
            for (var i in this._aniationChangeListeners) {
                var animationChangeListener: (source: IAnimation, changeEvent: AnimationStateChangeEvent) => void = this._aniationChangeListeners[i];
                animationChangeListener(this, changeEvent);
            }
        }

        public addAnimationListener(listener: (source: IAnimation, changeEvent: AnimationStateChangeEvent) => void ) {
            this._aniationChangeListeners.push(listener);
        }

        public removeAnimationListener(listener: (source: IAnimation, changeEvent: AnimationStateChangeEvent) => void ) {
            templa.util.Arrays.removeElement(this._aniationChangeListeners, listener);
        }


    }

}