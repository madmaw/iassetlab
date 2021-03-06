///<reference path="IController.ts"/>
///<reference path="IControllerWithModel.ts"/>
///<reference path="IView.ts"/>
///<reference path="IModel.ts"/>
///<reference path="ModelChangeEvent.ts"/>
///<reference path="Command.ts"/>
///<reference path="ControllerChangeEvent.ts"/>
///<reference path="../animation/IAnimation.ts"/>
///<reference path="../animation/AnimationStateChangeEvent.ts"/>
///<reference path="../util/Arrays.ts"/>

// Module
module templa.mvc {

    // Class
    export class AbstractController<ModelType extends IModel> implements IControllerWithModel<ModelType> {

        public _model: ModelType;
        private _commands: Command[];
        private _state: number;

        private _animations: templa.animation.IAnimation[];
        private _animationListener: (source: templa.animation.IAnimation, changeEvent: templa.animation.AnimationStateChangeEvent) => void;

        private _modelOnChangeListener: (model: templa.mvc.IModel, event: templa.mvc.ModelChangeEvent) => void;
        private _controllerOnChangeListeners: { (source: IController, changeEvent: ControllerChangeEvent): void; }[];

        // Constructor
        constructor() {
            this._state = templa.mvc.ControllerStateUninitialized;
        }

        public getModel(): ModelType {
            return this._model;
        }

        public setModel(model: ModelType) {
            if (this._state >= ControllerStateStarted && this._model != null) {
                this._model.removeOnChangeListener(this._modelOnChangeListener);
            }
            var previousModel = this._model;
            this._model = model;
            if (this._state >= ControllerStateStarted && this._model != null) {
                this._doLoad(model);
                this._model.addOnChangeListener(this._modelOnChangeListener);
            }
            // assume that everything has changed!
            this._fireControllerChangeEvent(new ControllerChangeEvent(true, true, true, previousModel));
        }

        public _init(): boolean {
            var result: boolean;
            if (this._state == templa.mvc.ControllerStateUninitialized) {
                result = this._doInit();
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

        public _doInit(): boolean {
            return true;
        }

        public load() {
            this._doLoad(this._model);
        }

        public _doLoad(model: ModelType) {

        }

        public getView(): templa.mvc.IView {
            throw new Error("this should be overriden");
        }

        public _handleModelChangeEvent(event: templa.mvc.ModelChangeEvent) {
            // override to get more fine-grained updates
            this._doLoad(this._model);
        }

        public start(): boolean {
            var result: boolean;
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

        public _doStart(): boolean {
            return true;
        }

        public stop(): boolean {
            var result: boolean;
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

        public _doStop(): boolean {
            return true;
        }

        public destroy(detachView?: boolean): boolean {
            // destroy any animations
            var result: boolean;
            if (this._state == templa.mvc.ControllerStateInitialized) {
                this._clearAnimations();
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

        public _doDestroy(detachView?: boolean): boolean {
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
                var recreate = view.layout();
                var state = this.getState();
                // just loading isn't enough, need to re-create
                if (recreate) {
                    if (state >= ControllerStateStarted) {
                        this.stop();
                    }
                    if (state >= ControllerStateInitialized) {
                        this.destroy();
                        this._reinitialize();
                    }
                    if (state >= ControllerStateStarted) {
                        this.start();
                    }
                }
            }
        }

        public _reinitialize() {
            this._init();
        }

        public _isAnimating(): boolean {
            return this._animations != null && this._animations.length > 0;
        }

        public _clearAnimations() {
            if (this._animations != null) {
                for (var i in this._animations) {
                    var animation: templa.animation.IAnimation = this._animations[i];
                    animation.destroy();
                }
                this._animations = null;
            }
        }

        public _addAnimation(animation: templa.animation.IAnimation, doNotStart?: boolean) {
            if (this._animations == null) {
                this._animations = [];
                this._animationListener = (source: templa.animation.IAnimation, event: templa.animation.AnimationStateChangeEvent) => {
                    if (event.getAnimationState() == templa.animation.animationStateFinished) {
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

        public _removeAnimation(animation: templa.animation.IAnimation, doNotDestroy?: boolean) {
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