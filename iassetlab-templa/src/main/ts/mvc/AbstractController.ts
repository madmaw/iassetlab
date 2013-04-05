///<reference path="IController.ts"/>
///<reference path="../animation/IAnimation.ts"/>
///<reference path="../util/Arrays.ts"/>
///<reference path="IView.ts"/>

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

        public getModel(): IModel {
            return this._model;
        }

        public setModel(model: templa.mvc.IModel) {
            this._model = model;
        }

        public init(container: IElementReference): bool {
            var result: bool;
            if (this._state == templa.mvc.ControllerStateUninitialized) {
                result = this._doInit(container);
                if (result) {
                    this._state = templa.mvc.ControllerStateInitialized;
                    // kick off any pending animations
                    if (this._animations != null) {
                        for (var i in this._animations) {
                            var animation: templa.animation.IAnimation = this._animations[i];
                            animation.init();
                            animation.start();
                        }
                    }
                }
            } else {
                result = false;
            }
            return result;
        }

        public _doInit(container: IElementReference): bool {
            return true;
        }

        public load() {
            this._doLoad(this._model);
        }

        public _doLoad(model: templa.mvc.IModel) {

        }

        public getView(): templa.mvc.IView {
            throw new Error("this should be overriden");
        }

        public _handleModelChangeEvent(event: templa.mvc.ModelChangeEvent) {
            // override to get more fine-grained updates
            this._doLoad(this._model);
        }

        public start(): bool {
            var result: bool;
            if (this._state == templa.mvc.ControllerStateInitialized) {
                result = this._doStart();
                if (result) {
                    this._state = templa.mvc.ControllerStateStarted;
                    // start listening on the model
                    this._modelOnChangeListener = (model: templa.mvc.IModel, event: templa.mvc.ModelChangeEvent) => {
                        this._handleModelChangeEvent(event);
                    };
                    this._model.addOnChangeListener(this._modelOnChangeListener);
                    // then load (sometimes the models will initialise/refresh themselves upon having a listener added, so it has to be done first)
                    this.load();
                }
            } else {
                result = false;
            }
            return result;
        }

        public _doStart(): bool {
            return true;
        }

        public stop(): bool {
            var result: bool;
            if (this._state == templa.mvc.ControllerStateStarted) {
                result = this._doStop();
                if (result) {
                    this._state = templa.mvc.ControllerStateInitialized;
                    // stop listening on the model
                    this._model.removeOnChangeListener(this._modelOnChangeListener);
                    this._modelOnChangeListener = null;
                }
            } else {
                result = false;
            }
            return result;
        }

        public _doStop(): bool {
            return true;
        }

        public destroy(detachView?: bool): bool {
            // destroy any animations
            var result: bool;
            if (this._state == templa.mvc.ControllerStateInitialized) {
                if (this._animations != null) {
                    for (var i in this._animations) {
                        var animation: templa.animation.IAnimation = this._animations[i];
                        animation.destroy();
                    }
                    this._animations = null;
                }
                result = this._doDestroy(detachView);
                if (result) {
                    // unfortunately the animations are going to cop it if we fail
                    this._state = templa.mvc.ControllerStateUninitialized;
                }
            } else {
                result = false;
            }
            return result;
        }

        public _doDestroy(detachView?: bool): bool {
            return true;
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

        public addAnimation(animation: templa.animation.IAnimation) {
            this._addAnimation(animation, false);
        }

        public layout(): void {
            var view = this.getView();
            if (view != null) {
                var reload = view.layout();
                var state = this.getState();
                if (reload && state == ControllerStateStarted) {
                    this.load();
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
                        this.layout();
                    }
                };
            }
            this._animations.push(animation);
            animation.addAnimationListener(this._animationListener);
            if (doNotStart != true && this._state >= ControllerStateInitialized) {
                // start the animation
                animation.init();
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

        public _safeTimeout(f: () => void , millis: number) {
            window.setTimeout(() => {
                if (this.getState() == ControllerStateStarted) {
                    f();
                }
            }, millis);
        }
    }

}