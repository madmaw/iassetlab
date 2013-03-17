// Module
module templa.animation {

    // Class
    export class AnimationStateChangeEvent {
        // Constructor
        constructor(private _animationState:string) {
        }

        public get animationState(): string {
            return this._animationState;
        }
    }
}
