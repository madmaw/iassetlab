///<reference path="AnimationStateChangeEvent.ts"/>

// Module
module templa.animation {

    export var animationStateCreated = "created";
    export var animationStateInitialized = "initialized";
    export var animationStateStopped = "stopped";
    export var animationStateStarted = "started";
    export var animationStateFinished = "finished";


    // Class
    export interface IAnimation {

        getState(): string;

        init();

        start();

        destroy();

        addAnimationListener(listener: (source: IAnimation, changeEvent: AnimationStateChangeEvent) => void );

        removeAnimationListener(listener: (source: IAnimation, changeEvent: AnimationStateChangeEvent) => void );
    }

}