///<reference path="IController.ts"/>
///<reference path="../animation/IAnimation.ts"/>
///<reference path="../util/Arrays.ts"/>

// Module
module templa.mvc {

    // Class
    export class AbstractController implements IController {

        public _model: templa.mvc.IModel;
        private _commands: templa.mvc.Command[];
        private _state: number;

        private _animations: templa.animation.IAnimation[];
        private _animationListener: (source: templa.animation.IAnimation, changeEvent: templa.animation.AnimationStateChangeEvent) => void;

        private _modelOnChangeListener: (model: templa.mvc.IModel, event: templa.mvc.ModelChangeEvent) => void;
        private _controllerOnChangeListeners: { (source: templa.mvc.IController, changeEvent: templa.mvc.ControllerChangeEvent): void; }[];

        // Constructor
        constructor() {
            this._state = templa.mvc.ControllerStateUninitialized;
        }

        public setModel(model: templa.mvc.IModel) {
            this._model = model;
        }

        public init(container: Element): bool {
            if (this._state == templa.mvc.ControllerStateUninitialized) {
                this._state = templa.mvc.ControllerStateInitialized;
                return true;
            } else {
                return false;
            }
        }

        public load() {
            this._load(this._model);
        }

        public _load(model: templa.mvc.IModel) {

        }

        public handleModelChangeEvent(event: templa.mvc.ModelChangeEvent) {
            // override to get more fine-grained updates
            this._load(this._model);
        }

        public start(): bool {
            if (this._state == templa.mvc.ControllerStateInitialized) {
                this._state = templa.mvc.ControllerStateStarted;
                this.load();
                // start listening on the model
                this._modelOnChangeListener = (model: templa.mvc.IModel, event: templa.mvc.ModelChangeEvent) => {
                    this.handleModelChangeEvent(event);
                };
                this._model.addOnChangeListener(this._modelOnChangeListener);
                return true;
            } else {
                return false;
            }
        }

        public stop(): bool {
            if (this._state == templa.mvc.ControllerStateStarted) {
                this._state = templa.mvc.ControllerStateInitialized;
                // stop listening on the model
                this._model.removeOnChangeListener(this._modelOnChangeListener);
                this._modelOnChangeListener = null;
                return true;
            } else {
                return false;
            }
        }

        public destroy(): bool {
            if (this._state == templa.mvc.ControllerStateInitialized) {
                this._state = templa.mvc.ControllerStateUninitialized;
                return true;
            } else {
                return false;
            }
        }

        public getState(): number {
            return this._state;
        }

        public getCommands(): templa.mvc.Command[] {
            return this._commands;
        }

        public setCommands(commands: templa.mvc.Command[]) {
            this._commands = commands;
            this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, false));
        }

        public getTitle(): string {
            return null;
        }

        public addOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void ) {
            if (this._controllerOnChangeListeners == null) {
                this._controllerOnChangeListeners = [];
            }
            this._controllerOnChangeListeners.push(listener);
        }

        public removeOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void ) {
            if (this._controllerOnChangeListeners != null) {
                templa.util.Arrays.removeElement(this._controllerOnChangeListeners, listener);
                if (this._controllerOnChangeListeners.length == 0) {
                    this._controllerOnChangeListeners = null;
                }
            }
        }

        public _fireControllerChangeEvent(controllerChangeEvent: templa.mvc.ControllerChangeEvent) {
            if (this._controllerOnChangeListeners != null) {
                for (var i in this._controllerOnChangeListeners) {
                    var controllerOnChangeListener = this._controllerOnChangeListeners[i];
                    controllerOnChangeListener(this, controllerChangeEvent);
                }
            }
        }

        public _addAnimation(animation: templa.animation.IAnimation, doNotStart?: bool) {
            if (this._animations == null) {
                this._animations = [];
                this._animationListener = (source: templa.animation.IAnimation, event: templa.animation.AnimationStateChangeEvent) => {
                    if (event.animationState == templa.animation.animationStateFinished) {
                        // remove the animation
                        this._removeAnimation(source, true);
                    }
                };
            }
            this._animations.push(animation);
            animation.addAnimationListener(this._animationListener);
            if (doNotStart != true && this._state >= ControllerStateInitialized) {
                // start the animation
                animation.start();
            }
        }

        public _removeAnimation(animation: templa.animation.IAnimation, doNotDestroy?: bool) {
            if (this._animations != null) {
                if (templa.util.Arrays.removeElement(this._animations, animation)) {
                    animation.removeAnimationListener(this._animationListener);
                }
            }
            if (doNotDestroy != true) {
                animation.destroy();
            }
        }
    }

}