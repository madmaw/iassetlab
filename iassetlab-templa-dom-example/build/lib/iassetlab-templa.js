var templa;
(function (templa) {
    // Module
    (function (animation) {
        // Class
        var AnimationStateChangeEvent = (function () {
            // Constructor
            function AnimationStateChangeEvent(_animationState) {
                this._animationState = _animationState;
            }
            AnimationStateChangeEvent.prototype.getAnimationState = function () {
                return this._animationState;
            };
            return AnimationStateChangeEvent;
        })();
        animation.AnimationStateChangeEvent = AnimationStateChangeEvent;
    })(templa.animation || (templa.animation = {}));
    var animation = templa.animation;
})(templa || (templa = {}));
///<reference path="AnimationStateChangeEvent.ts"/>
var templa;
(function (templa) {
    // Module
    (function (animation) {
        animation.animationStateCreated = "created";
        animation.animationStateInitialized = "initialized";
        animation.animationStateStopped = "stopped";
        animation.animationStateStarted = "started";
        animation.animationStateFinished = "finished";

        
    })(templa.animation || (templa.animation = {}));
    var animation = templa.animation;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (util) {
        // Module
        (function (Arrays) {
            function removeElement(array, element) {
                var result = false;
                var index = array.length;
                while (index > 0) {
                    index--;
                    var found = array[index];
                    if (found == element) {
                        result = true;
                        array.splice(index, 1);
                        break;
                    }
                }
                return result;
            }
            Arrays.removeElement = removeElement;

            function pushAll(into, elements) {
                for (var i in elements) {
                    var element = elements[i];
                    into.push(element);
                }
            }
            Arrays.pushAll = pushAll;

            function copy(array) {
                return [].concat(array);
            }
            Arrays.copy = copy;

            function create2DArray(width, height) {
                var array = new Array(width);
                for (var i = 0; i < width; i++) {
                    array[i] = new Array(height);
                }
                return array;
            }
            Arrays.create2DArray = create2DArray;
        })(util.Arrays || (util.Arrays = {}));
        var Arrays = util.Arrays;
    })(templa.util || (templa.util = {}));
    var util = templa.util;
})(templa || (templa = {}));
///<reference path="IAnimation.ts"/>
///<reference path="AnimationStateChangeEvent.ts"/>
///<reference path="../util/Arrays.ts"/>
var templa;
(function (templa) {
    // Module
    (function (animation) {
        // Class
        var AbstractAnimation = (function () {
            // Constructor
            function AbstractAnimation() {
                this._state = templa.animation.animationStateCreated;
                this._animationChangeListeners = [];
            }
            AbstractAnimation.prototype.getState = function () {
                return this._state;
            };

            AbstractAnimation.prototype.init = function () {
                if (this._doInit()) {
                    this._state = templa.animation.animationStateInitialized;
                    this._fireAnimationStateChangeEvent(new templa.animation.AnimationStateChangeEvent(this._state));
                }
            };

            AbstractAnimation.prototype._doInit = function () {
                return true;
            };

            AbstractAnimation.prototype.start = function () {
                if (this._doStart()) {
                    this._state = templa.animation.animationStateStarted;
                    this._fireAnimationStateChangeEvent(new templa.animation.AnimationStateChangeEvent(this._state));
                }
            };

            AbstractAnimation.prototype._doStart = function () {
                return true;
            };

            AbstractAnimation.prototype.destroy = function () {
                if (this._doDestroy()) {
                    this._state = templa.animation.animationStateFinished;
                    this._fireAnimationStateChangeEvent(new templa.animation.AnimationStateChangeEvent(this._state));
                }
            };

            AbstractAnimation.prototype._doDestroy = function () {
                return true;
            };

            AbstractAnimation.prototype._fireAnimationStateChangeEvent = function (changeEvent) {
                for (var i in this._animationChangeListeners) {
                    var animationChangeListener = this._animationChangeListeners[i];
                    animationChangeListener(this, changeEvent);
                }
            };

            AbstractAnimation.prototype.addAnimationListener = function (listener) {
                this._animationChangeListeners.push(listener);
            };

            AbstractAnimation.prototype.removeAnimationListener = function (listener) {
                templa.util.Arrays.removeElement(this._animationChangeListeners, listener);
            };
            return AbstractAnimation;
        })();
        animation.AbstractAnimation = AbstractAnimation;
    })(templa.animation || (templa.animation = {}));
    var animation = templa.animation;
})(templa || (templa = {}));
///<reference path="ILoadable.ts"/>
var templa;
(function (templa) {
    // Module
    (function (loading) {
        // Class
        var AbstractLoadable = (function () {
            function AbstractLoadable(_maximumProgress, _synchronous) {
                this._maximumProgress = _maximumProgress;
                this._synchronous = _synchronous;
                this._loadingProgress = 0;
                this._errors = [];
            }
            AbstractLoadable.prototype.getLoadingProgress = function () {
                return this._loadingProgress;
            };

            AbstractLoadable.prototype.getMaximumProgress = function () {
                return this._maximumProgress;
            };

            AbstractLoadable.prototype.getErrors = function () {
                return this._errors;
            };

            AbstractLoadable.prototype.isComplete = function () {
                return this._loadingProgress == this._maximumProgress;
            };

            AbstractLoadable.prototype.update = function () {
                return false;
            };

            AbstractLoadable.prototype.requestStartLoading = function (callback) {
                this._callback = callback;
                this._doStartLoading();
                return this._synchronous;
            };

            AbstractLoadable.prototype._doStartLoading = function () {
                // override
            };

            AbstractLoadable.prototype._pushError = function (error) {
                this._errors.push(error);
                this._fireLoadingEvent(error);
            };

            AbstractLoadable.prototype._setLoadingProgress = function (loadingProgress, message, maximumProgress) {
                this._loadingProgress = loadingProgress;
                if (maximumProgress != null) {
                    this._maximumProgress = maximumProgress;
                }
                this._fireLoadingEvent(message);
            };

            AbstractLoadable.prototype._fireLoadingEvent = function (message) {
                if (this._callback != null) {
                    this._callback(this, message);
                }
            };
            return AbstractLoadable;
        })();
        loading.AbstractLoadable = AbstractLoadable;
    })(templa.loading || (templa.loading = {}));
    var loading = templa.loading;
})(templa || (templa = {}));
///<reference path="ILoadable.ts"/>
///<reference path="../util/Arrays.ts"/>
var templa;
(function (templa) {
    // Module
    (function (loading) {
        // Class
        var CompositeLoadable = (function () {
            function CompositeLoadable(loadables) {
                if (loadables == null) {
                    this._loadables = [];
                } else {
                    this._loadables = loadables;
                }

                this._synchronousLoadables = [];
            }
            CompositeLoadable.prototype.getLoadingProgress = function () {
                var result = 0;

                for (var i in this._loadables) {
                    var loadable = this._loadables[i];
                    result += loadable.getLoadingProgress();
                }
                return result;
            };

            CompositeLoadable.prototype.getMaximumProgress = function () {
                var result = 0;
                for (var i in this._loadables) {
                    var loadable = this._loadables[i];
                    result += loadable.getMaximumProgress();
                }
                return result;
            };

            CompositeLoadable.prototype.getErrors = function () {
                var result = [];
                for (var i in this._loadables) {
                    var loadable = this._loadables[i];
                    var errors = loadable.getErrors();
                    templa.util.Arrays.pushAll(result, errors);
                }
                return result;
            };

            CompositeLoadable.prototype.isComplete = function () {
                var result = true;
                for (var i in this._loadables) {
                    var loadable = this._loadables[i];
                    var complete = loadable.isComplete();
                    if (!complete) {
                        result = false;
                        break;
                    }
                }
                return result;
            };

            CompositeLoadable.prototype.update = function () {
                var result;
                if (this._synchronousLoadables.length > 0) {
                    var synchronousLoader = this._synchronousLoadables[0];
                    var synchronousLoaderResult = synchronousLoader.update();
                    if (!synchronousLoaderResult) {
                        this._synchronousLoadables.splice(0, 1);
                        result = this._synchronousLoadables.length > 0;
                    } else {
                        result = true;
                    }
                } else {
                    result = false;
                }
                return result;
            };

            CompositeLoadable.prototype.requestStartLoading = function (callback) {
                var _this = this;
                var result = false;
                var internalCallback;
                if (callback != null) {
                    internalCallback = function (loadable, message) {
                        callback(_this, message);
                    };
                } else {
                    internalCallback = null;
                }
                for (var i in this._loadables) {
                    var loadable = this._loadables[i];
                    var loadableResult = loadable.requestStartLoading(internalCallback);
                    if (loadableResult) {
                        this._synchronousLoadables.push(loadable);
                    }
                    result = loadableResult || result;
                }
                return result;
            };
            return CompositeLoadable;
        })();
        loading.CompositeLoadable = CompositeLoadable;
    })(templa.loading || (templa.loading = {}));
    var loading = templa.loading;
})(templa || (templa = {}));
var templa;
(function (templa) {
    // Module
    (function (mvc) {
        // Class
        var ModelChangeDescription = (function () {
            // Constructor
            function ModelChangeDescription(_changeType) {
                this._changeType = _changeType;
            }
            ModelChangeDescription.prototype.getChangeType = function () {
                return this._changeType;
            };
            return ModelChangeDescription;
        })();
        mvc.ModelChangeDescription = ModelChangeDescription;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="ModelChangeDescription.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        var ModelChangeEvent = (function () {
            function ModelChangeEvent(data) {
                if (data == null) {
                    this._descriptions = [];
                } else {
                    if (data instanceof templa.mvc.ModelChangeDescription) {
                        this._descriptions = [data];
                    } else if (data instanceof Array) {
                        this._descriptions = data;
                    } else {
                        this._descriptions = [new templa.mvc.ModelChangeDescription(data)];
                    }
                }
            }
            ModelChangeEvent.prototype.lookup = function (changeType) {
                var result = null;
                for (var i in this._descriptions) {
                    var description = this._descriptions[i];
                    if (description.getChangeType() == changeType) {
                        result = description;
                        break;
                    }
                }
                return result;
            };
            return ModelChangeEvent;
        })();
        mvc.ModelChangeEvent = ModelChangeEvent;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="ModelChangeEvent.ts"/>
///<reference path="IModelStateChange.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        mvc.CommandTypeScreen = 0;
        mvc.CommandTypeBack = 1;
        mvc.CommandTypeForward = 2;

        // Class
        var Command = (function () {
            // Constructor
            function Command(_id, _commandType, _priority, _action) {
                this._id = _id;
                this._commandType = _commandType;
                this._priority = _priority;
                this._action = _action;
                this._enabled = true;
            }
            Command.prototype.getPriority = function () {
                return this._priority;
            };

            Command.prototype.getCommandType = function () {
                return this._commandType;
            };

            Command.prototype.setEnabled = function (_enabled) {
                this._enabled = _enabled;
            };

            Command.prototype.getEnabled = function () {
                return this._enabled;
            };

            Command.prototype.getId = function () {
                return this._id;
            };

            Command.prototype.getAction = function () {
                return this._action;
            };
            return Command;
        })();
        mvc.Command = Command;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    // Module
    (function (mvc) {
        // Class
        var ControllerChangeEvent = (function () {
            // Constructor
            function ControllerChangeEvent(_commandsChanged, _titleChanged, _modelChanged, _previousModel) {
                this._commandsChanged = _commandsChanged;
                this._titleChanged = _titleChanged;
                this._modelChanged = _modelChanged;
                this._previousModel = _previousModel;
                if (this._modelChanged == null) {
                    this._modelChanged = false;
                }
            }
            ControllerChangeEvent.prototype.getCommandsChanged = function () {
                return this._commandsChanged;
            };

            ControllerChangeEvent.prototype.getTitleChanged = function () {
                return this._titleChanged;
            };

            ControllerChangeEvent.prototype.getModelChanged = function () {
                return this._modelChanged;
            };

            ControllerChangeEvent.prototype.getPreviousModel = function () {
                return this._previousModel;
            };
            return ControllerChangeEvent;
        })();
        mvc.ControllerChangeEvent = ControllerChangeEvent;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="IModel.ts"/>
///<reference path="Command.ts"/>
///<reference path="ControllerChangeEvent.ts"/>
///<reference path="IView.ts"/>
///<reference path="../animation/IAnimation.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        mvc.ControllerStateUninitialized = 0;
        mvc.ControllerStateInitialized = 1;
        mvc.ControllerStateStarted = 2;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="IModel.ts"/>
///<reference path="IController.ts"/>
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
var templa;
(function (templa) {
    // Module
    (function (mvc) {
        // Class
        var AbstractController = (function () {
            // Constructor
            function AbstractController() {
                this._state = templa.mvc.ControllerStateUninitialized;
            }
            AbstractController.prototype.getModel = function () {
                return this._model;
            };

            AbstractController.prototype.setModel = function (model) {
                if (this._state >= templa.mvc.ControllerStateStarted && this._model != null) {
                    this._model.removeOnChangeListener(this._modelOnChangeListener);
                }
                var previousModel = this._model;
                this._model = model;
                if (this._state >= templa.mvc.ControllerStateStarted && this._model != null) {
                    this._doLoad(model);
                    this._model.addOnChangeListener(this._modelOnChangeListener);
                }

                // assume that everything has changed!
                this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, true, true, previousModel));
            };

            AbstractController.prototype._init = function () {
                var result;
                if (this._state == templa.mvc.ControllerStateUninitialized) {
                    result = this._doInit();
                    if (result) {
                        this._state = templa.mvc.ControllerStateInitialized;

                        // kick off any pending animations
                        if (this._animations != null) {
                            for (var i in this._animations) {
                                var animation = this._animations[i];
                                animation.init();
                                animation.start();
                            }
                        }
                    }
                } else {
                    result = false;
                }
                return result;
            };

            AbstractController.prototype._doInit = function () {
                return true;
            };

            AbstractController.prototype.load = function () {
                this._doLoad(this._model);
            };

            AbstractController.prototype._doLoad = function (model) {
            };

            AbstractController.prototype.getView = function () {
                throw new Error("this should be overriden");
            };

            AbstractController.prototype._handleModelChangeEvent = function (event) {
                // override to get more fine-grained updates
                this._doLoad(this._model);
            };

            AbstractController.prototype.start = function () {
                var _this = this;
                var result;
                if (this._state == templa.mvc.ControllerStateInitialized) {
                    result = this._doStart();
                    if (result) {
                        this._state = templa.mvc.ControllerStateStarted;

                        // start listening on the model
                        this._modelOnChangeListener = function (model, event) {
                            _this._handleModelChangeEvent(event);
                        };
                        this._model.addOnChangeListener(this._modelOnChangeListener);

                        // then load (sometimes the models will initialise/refresh themselves upon having a listener added, so it has to be done first)
                        this.load();
                    }
                } else {
                    result = false;
                }
                return result;
            };

            AbstractController.prototype._doStart = function () {
                return true;
            };

            AbstractController.prototype.stop = function () {
                var result;
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
            };

            AbstractController.prototype._doStop = function () {
                return true;
            };

            AbstractController.prototype.destroy = function (detachView) {
                // destroy any animations
                var result;
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
            };

            AbstractController.prototype._doDestroy = function (detachView) {
                return true;
            };

            AbstractController.prototype.getState = function () {
                return this._state;
            };

            AbstractController.prototype.getCommands = function () {
                return this._commands;
            };

            AbstractController.prototype.setCommands = function (commands) {
                this._commands = commands;
                this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, false));
            };

            AbstractController.prototype.getTitle = function () {
                return null;
            };

            AbstractController.prototype.addOnChangeListener = function (listener) {
                if (this._controllerOnChangeListeners == null) {
                    this._controllerOnChangeListeners = [];
                }
                this._controllerOnChangeListeners.push(listener);
            };

            AbstractController.prototype.removeOnChangeListener = function (listener) {
                if (this._controllerOnChangeListeners != null) {
                    templa.util.Arrays.removeElement(this._controllerOnChangeListeners, listener);
                    if (this._controllerOnChangeListeners.length == 0) {
                        this._controllerOnChangeListeners = null;
                    }
                }
            };

            AbstractController.prototype._fireControllerChangeEvent = function (controllerChangeEvent) {
                if (this._controllerOnChangeListeners != null) {
                    for (var i in this._controllerOnChangeListeners) {
                        var controllerOnChangeListener = this._controllerOnChangeListeners[i];
                        controllerOnChangeListener(this, controllerChangeEvent);
                    }
                }
            };

            AbstractController.prototype.addAnimation = function (animation) {
                this._addAnimation(animation, false);
            };

            AbstractController.prototype.layout = function () {
                var view = this.getView();
                if (view != null) {
                    var recreate = view.layout();
                    var state = this.getState();

                    // just loading isn't enough, need to re-create
                    if (recreate) {
                        if (state >= templa.mvc.ControllerStateStarted) {
                            this.stop();
                        }
                        if (state >= templa.mvc.ControllerStateInitialized) {
                            this.destroy();
                            this._reinitialize();
                        }
                        if (state >= templa.mvc.ControllerStateStarted) {
                            this.start();
                        }
                    }
                }
            };

            AbstractController.prototype._reinitialize = function () {
                this._init();
            };

            AbstractController.prototype._isAnimating = function () {
                return this._animations != null && this._animations.length > 0;
            };

            AbstractController.prototype._clearAnimations = function () {
                if (this._animations != null) {
                    for (var i in this._animations) {
                        var animation = this._animations[i];
                        animation.destroy();
                    }
                    this._animations = null;
                }
            };

            AbstractController.prototype._addAnimation = function (animation, doNotStart) {
                var _this = this;
                if (this._animations == null) {
                    this._animations = [];
                    this._animationListener = function (source, event) {
                        if (event.getAnimationState() == templa.animation.animationStateFinished) {
                            // remove the animation
                            _this._removeAnimation(source, true);
                            _this.layout();
                        }
                    };
                }
                this._animations.push(animation);
                animation.addAnimationListener(this._animationListener);
                if (doNotStart != true && this._state >= templa.mvc.ControllerStateInitialized) {
                    // start the animation
                    animation.init();
                    animation.start();
                }
            };

            AbstractController.prototype._removeAnimation = function (animation, doNotDestroy) {
                if (this._animations != null) {
                    if (templa.util.Arrays.removeElement(this._animations, animation)) {
                        animation.removeAnimationListener(this._animationListener);
                    }
                }
                if (doNotDestroy != true) {
                    animation.destroy();
                }
            };

            AbstractController.prototype._safeTimeout = function (f, millis) {
                var _this = this;
                window.setTimeout(function () {
                    if (_this.getState() == templa.mvc.ControllerStateStarted) {
                        f();
                    }
                }, millis);
            };
            return AbstractController;
        })();
        mvc.AbstractController = AbstractController;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        var AbstractModel = (function () {
            function AbstractModel() {
                this._modelOnChangeListeners = [];
                this._stateDescriptionChangeListeners = [];
            }
            AbstractModel.prototype.addOnChangeListener = function (listener) {
                if (this._modelOnChangeListeners.length == 0) {
                    // do this first as we don't want to fire events to all the just added listeners as they're (probably) about to do a load anyway
                    this._startedListening();
                }
                this._modelOnChangeListeners.push(listener);
            };

            AbstractModel.prototype.removeOnChangeListener = function (listener) {
                var removed = templa.util.Arrays.removeElement(this._modelOnChangeListeners, listener);
                if (removed && this._modelOnChangeListeners.length == 0) {
                    this._stoppedListening();
                }
            };

            AbstractModel.prototype._startedListening = function () {
            };

            AbstractModel.prototype._stoppedListening = function () {
            };

            AbstractModel.prototype._fireModelChangeEvent = function (changeEvent, suppressFireStateTokenChange) {
                if (changeEvent == null) {
                    changeEvent = new templa.mvc.ModelChangeEvent();
                } else if (!(changeEvent instanceof templa.mvc.ModelChangeEvent)) {
                    changeEvent = new templa.mvc.ModelChangeEvent(changeEvent);
                }
                for (var i in this._modelOnChangeListeners) {
                    var modelOnChangeListener = this._modelOnChangeListeners[i];
                    modelOnChangeListener(this, changeEvent);
                }
                if (suppressFireStateTokenChange != true) {
                    // fire state token change event
                    this._fireStateDescriptionChangeEvent(this);
                }
            };

            AbstractModel.prototype.addStateDescriptionChangeListener = function (listener) {
                this._stateDescriptionChangeListeners.push(listener);
                if (this._stateDescriptionChangeListeners.length == 1) {
                    this._startedListeningForStateDescriptionChanges();
                }
            };

            AbstractModel.prototype.removeStateDescriptionChangeListener = function (listener) {
                templa.util.Arrays.removeElement(this._stateDescriptionChangeListeners, listener);
                if (this._stateDescriptionChangeListeners.length == 0) {
                    this._stoppedListeningForStateDescriptionChanges();
                }
            };

            AbstractModel.prototype._startedListeningForStateDescriptionChanges = function () {
            };

            AbstractModel.prototype._stoppedListeningForStateDescriptionChanges = function () {
            };

            AbstractModel.prototype._fireStateDescriptionChangeEvent = function (source, change) {
                var fired = [];
                for (var i in this._stateDescriptionChangeListeners) {
                    var stateTokenChangeListener = this._stateDescriptionChangeListeners[i];
                    if (fired.indexOf(stateTokenChangeListener) < 0) {
                        stateTokenChangeListener(source, change);

                        // can end up with legitimate duplicates, don't want to fire them multiple times though
                        fired.push(stateTokenChangeListener);
                    }
                }
            };

            AbstractModel.prototype.createStateDescription = function (models) {
                this._checkModels(models);
                return null;
            };

            AbstractModel.prototype.loadStateDescription = function (description) {
                // ignore
            };

            AbstractModel.prototype._checkModels = function (models) {
                if (models == null) {
                    models = [this];
                } else {
                    if (models.indexOf(this) >= 0) {
                        throw new Error("this model " + this + " has already been added");
                    } else {
                        models.push(this);
                    }
                }
                return models;
            };
            return AbstractModel;
        })();
        mvc.AbstractModel = AbstractModel;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="IModel.ts"/>
///<reference path="AbstractModel.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var templa;
(function (templa) {
    ///<reference path="../util/Arrays.ts"/>
    // Module
    (function (mvc) {
        // Class
        var AbstractModelProxy = (function (_super) {
            __extends(AbstractModelProxy, _super);
            // Constructor
            function AbstractModelProxy(_model) {
                var _this = this;
                _super.call(this);
                this._model = _model;

                this._onChangeListener = function (source, event) {
                    _this._fireModelChangeEvent(event, true);
                };

                this._onStateChangeListener = function (source, event) {
                    _this._fireStateDescriptionChangeEvent(source, event);
                };
            }
            AbstractModelProxy.prototype._startedListening = function () {
                this._model.addOnChangeListener(this._onChangeListener);
            };

            AbstractModelProxy.prototype._stoppedListening = function () {
                this._model.removeOnChangeListener(this._onChangeListener);
            };

            AbstractModelProxy.prototype._startedListeningForStateDescriptionChanges = function () {
                this._model.addStateDescriptionChangeListener(this._onStateChangeListener);
            };

            AbstractModelProxy.prototype._stoppedListeningForStateDescriptionChanges = function () {
                this._model.removeStateDescriptionChangeListener(this._onStateChangeListener);
            };

            AbstractModelProxy.prototype.createStateDescription = function (models) {
                this._checkModels(models);
                return this._model.createStateDescription(models);
            };

            AbstractModelProxy.prototype.loadStateDescription = function (description) {
                this._model.loadStateDescription(description);
            };
            return AbstractModelProxy;
        })(templa.mvc.AbstractModel);
        mvc.AbstractModelProxy = AbstractModelProxy;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="../IModel.ts"/>
///<reference path="../Command.ts"/>
///<reference path="ICommandControllerModel.ts"/>
///<reference path="../AbstractModel.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../IModel.ts"/>
///<reference path="../ModelChangeEvent.ts"/>
///<reference path="../ControllerChangeEvent.ts"/>
///<reference path="../Command.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        // Module
        (function (command) {
            // Class
            var CommandControllerModelAdapter = (function (_super) {
                __extends(CommandControllerModelAdapter, _super);
                function CommandControllerModelAdapter(_controller) {
                    var _this = this;
                    _super.call(this);
                    this._controller = _controller;
                    this._listener = function (source, changeEvent) {
                        if (changeEvent.getCommandsChanged()) {
                            _this._fireModelChangeEvent(new templa.mvc.ModelChangeEvent("commands"));
                        }
                    };
                }
                CommandControllerModelAdapter.prototype.getCommands = function () {
                    return this._controller.getCommands();
                };

                CommandControllerModelAdapter.prototype._startedListening = function () {
                    this._controller.addOnChangeListener(this._listener);
                };

                CommandControllerModelAdapter.prototype._stoppedListening = function () {
                    this._controller.removeOnChangeListener(this._listener);
                };
                return CommandControllerModelAdapter;
            })(templa.mvc.AbstractModel);
            command.CommandControllerModelAdapter = CommandControllerModelAdapter;
        })(mvc.command || (mvc.command = {}));
        var command = mvc.command;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="../IModel.ts"/>
///<reference path="../IController.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        (function (composite) {
            composite.compositeControllerModelEventControllersChanged = "controllersChanged";
        })(mvc.composite || (mvc.composite = {}));
        var composite = mvc.composite;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="ICompositeControllerModel.ts"/>
///<reference path="../AbstractModel.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../IModel.ts"/>
///<reference path="../IModelStateChange.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        ///<reference path="../../util/Arrays.ts"/>
        // Module
        (function (composite) {
            // Class
            var AbstractCompositeControllerModel = (function (_super) {
                __extends(AbstractCompositeControllerModel, _super);
                function AbstractCompositeControllerModel() {
                    var _this = this;
                    _super.call(this);
                    this._stateDescriptionChangeListener = function (source, change) {
                        if (source != _this) {
                            // models can be shared between controllers so we need to be careful we don't propogate our own events
                            _this._fireStateDescriptionChangeEvent(source, change);
                        }
                    };
                    this._controllerChangeListener = function (source, change) {
                        if (change.getModelChanged()) {
                            var previousModel = change.getPreviousModel();
                            if (previousModel != null) {
                                previousModel.removeStateDescriptionChangeListener(_this._stateDescriptionChangeListener);
                            }

                            // listen on the new modle
                            var currentModel = source.getModel();
                            if (currentModel != null) {
                                currentModel.addStateDescriptionChangeListener(_this._stateDescriptionChangeListener);
                            }
                        }
                    };
                }
                AbstractCompositeControllerModel.prototype._getDescribedControllers = function () {
                    var controllers = this.getControllers();
                    var result = [];

                    for (var i in controllers) {
                        var controller = controllers[i];
                        if (controller.getModel() != this) {
                            result.push(controller);
                        }
                    }
                    return result;
                };

                AbstractCompositeControllerModel.prototype.getControllers = function () {
                    return [];
                };

                AbstractCompositeControllerModel.prototype._startedListeningForStateDescriptionChanges = function () {
                    _super.prototype._startedListeningForStateDescriptionChanges.call(this);
                    this._startListeningForStateDescriptionChanges();
                };

                AbstractCompositeControllerModel.prototype._startListeningForStateDescriptionChanges = function () {
                    var controllers = this._getDescribedControllers();
                    this._previouslyDescribedControllers = [];
                    if (controllers != null) {
                        for (var i in controllers) {
                            var controller = controllers[i];
                            controller.addOnChangeListener(this._controllerChangeListener);
                            this._previouslyDescribedControllers.push(controller);
                            var model = controller.getModel();
                            if (model != null) {
                                model.addStateDescriptionChangeListener(this._stateDescriptionChangeListener);
                            }
                        }
                    }
                };

                AbstractCompositeControllerModel.prototype._stoppedListeningForStateDescriptionChanges = function () {
                    _super.prototype._stoppedListeningForStateDescriptionChanges.call(this);
                    this._stopListeningForStateDescriptionChanges();
                    this._previouslyDescribedControllers = null;
                };

                AbstractCompositeControllerModel.prototype._stopListeningForStateDescriptionChanges = function () {
                    var controllers = this._previouslyDescribedControllers;
                    if (controllers != null) {
                        for (var i in controllers) {
                            var controller = controllers[i];
                            controller.removeOnChangeListener(this._controllerChangeListener);
                            var model = controller.getModel();
                            if (model != null) {
                                model.removeStateDescriptionChangeListener(this._stateDescriptionChangeListener);
                            }
                        }
                    }
                };

                AbstractCompositeControllerModel.prototype._updateListeningForStateDescriptionChanges = function () {
                    this._stopListeningForStateDescriptionChanges();
                    this._startListeningForStateDescriptionChanges();
                };

                AbstractCompositeControllerModel.prototype.createStateDescription = function (models) {
                    models = this._checkModels(models);
                    var controllers = this._getDescribedControllers();
                    var result = [];
                    if (controllers != null) {
                        for (var i in controllers) {
                            var controller = controllers[i];
                            var model = controller.getModel();
                            var entry;
                            if (model != null) {
                                entry = model.createStateDescription(models);
                            } else {
                                entry = null;
                            }
                            result.push(entry);
                        }
                    }
                    return result;
                };

                AbstractCompositeControllerModel.prototype.loadStateDescription = function (description) {
                    var controllers = this._getDescribedControllers();
                    var descriptions = description;
                    for (var i in descriptions) {
                        var entry = descriptions[i];
                        var controller = controllers[i];
                        var model = controller.getModel();
                        if (model != null) {
                            model.loadStateDescription(entry);
                        }
                    }
                };
                return AbstractCompositeControllerModel;
            })(templa.mvc.AbstractModel);
            composite.AbstractCompositeControllerModel = AbstractCompositeControllerModel;
        })(mvc.composite || (mvc.composite = {}));
        var composite = mvc.composite;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="ICompositeControllerModel.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        (function (composite) {
            composite.stackControllerModelEventPushed = "pushed";
            composite.stackControllerModelEventPopped = "popped";
        })(mvc.composite || (mvc.composite = {}));
        var composite = mvc.composite;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="../IController.ts"/>
///<reference path="../ModelChangeDescription.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        // Module
        (function (composite) {
            // Class
            var StackControllerModelChangeDescription = (function (_super) {
                __extends(StackControllerModelChangeDescription, _super);
                // Constructor
                function StackControllerModelChangeDescription(changeType, _removedController, _addedController, _silentRemovedControllers, _silentAddedControllers) {
                    _super.call(this, changeType);
                    this._removedController = _removedController;
                    this._addedController = _addedController;
                    this._silentRemovedControllers = _silentRemovedControllers;
                    this._silentAddedControllers = _silentAddedControllers;
                }
                StackControllerModelChangeDescription.prototype.getRemovedController = function () {
                    return this._removedController;
                };

                StackControllerModelChangeDescription.prototype.getAddedController = function () {
                    return this._addedController;
                };

                StackControllerModelChangeDescription.prototype.getSilentRemovedControllers = function () {
                    return this._silentRemovedControllers;
                };

                StackControllerModelChangeDescription.prototype.getSilentAddedControllers = function () {
                    return this._silentAddedControllers;
                };
                return StackControllerModelChangeDescription;
            })(templa.mvc.ModelChangeDescription);
            composite.StackControllerModelChangeDescription = StackControllerModelChangeDescription;
        })(mvc.composite || (mvc.composite = {}));
        var composite = mvc.composite;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="AbstractCompositeControllerModel.ts"/>
///<reference path="IStackControllerModel.ts"/>
///<reference path="StackControllerModelChangeDescription.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../IModel.ts"/>
///<reference path="../IModelStateChange.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        // Module
        (function (composite) {
            var AbstractStackControllerModelPushChange = (function () {
                function AbstractStackControllerModelPushChange(_model, _entry) {
                    this._model = _model;
                    this._entry = _entry;
                }
                AbstractStackControllerModelPushChange.prototype.undo = function () {
                    if (this._model.canPop()) {
                        this._model._deStack(this._entry.controller, false, true);
                    }
                };

                AbstractStackControllerModelPushChange.prototype.redo = function () {
                    if (!this._model._contains(this._entry.controller)) {
                        this._model._pushEntry(this._entry, false, true);
                    }
                };
                return AbstractStackControllerModelPushChange;
            })();
            composite.AbstractStackControllerModelPushChange = AbstractStackControllerModelPushChange;

            var AbstractStackControllerModelPopChange = (function () {
                function AbstractStackControllerModelPopChange(_model, _entry) {
                    this._model = _model;
                    this._entry = _entry;
                }
                AbstractStackControllerModelPopChange.prototype.undo = function () {
                    if (!this._model._contains(this._entry.controller)) {
                        this._model._pushEntry(this._entry, false, true);
                    }
                };

                AbstractStackControllerModelPopChange.prototype.redo = function () {
                    if (this._model.canPop()) {
                        this._model._deStack(this._entry.controller, false, true);
                    }
                };
                return AbstractStackControllerModelPopChange;
            })();
            composite.AbstractStackControllerModelPopChange = AbstractStackControllerModelPopChange;

            // Class
            var AbstractStackControllerModel = (function (_super) {
                __extends(AbstractStackControllerModel, _super);
                // Constructor
                function AbstractStackControllerModel(_allowEmptyStack, _controllersToDisplay) {
                    _super.call(this);
                    this._allowEmptyStack = _allowEmptyStack;
                    this._controllersToDisplay = _controllersToDisplay;
                    this._stack = [];
                    if (this._controllersToDisplay == null) {
                        this._controllersToDisplay = 1;
                    }
                }
                AbstractStackControllerModel.prototype._setControllersToDisplay = function (_controllersToDisplay) {
                    if (this._controllersToDisplay != _controllersToDisplay) {
                        this._controllersToDisplay = _controllersToDisplay;

                        // assume everything changed
                        this._fireModelChangeEvent();
                    }
                };

                AbstractStackControllerModel.prototype.getControllers = function () {
                    var result = [];
                    var remainingControllers = this._controllersToDisplay;
                    var index = Math.max(0, this._stack.length - this._controllersToDisplay);
                    while (remainingControllers > 0 && index < this._stack.length) {
                        result.push(this._stack[index].controller);
                        remainingControllers--;
                        index++;
                    }
                    return result;
                };

                AbstractStackControllerModel.prototype._getDescribedControllers = function () {
                    return this.getControllers();
                };

                AbstractStackControllerModel.prototype.isStackEmpty = function () {
                    return this._stack.length == 0;
                };

                AbstractStackControllerModel.prototype.canPop = function () {
                    return !this.isStackEmpty() && this._allowEmptyStack || this._stack.length > this._controllersToDisplay;
                };

                AbstractStackControllerModel.prototype.requestPop = function () {
                    if (this.canPop()) {
                        this._pop();
                    }
                };

                AbstractStackControllerModel.prototype._ensureVisible = function (controller, suppressFireDescriptionChangeEvent) {
                    // pop back to this controller
                    var result;
                    var index = this._indexOf(controller);
                    if (index != null) {
                        result = true;
                        while (index < this._stack.length - this._controllersToDisplay) {
                            this._pop(false, suppressFireDescriptionChangeEvent);
                        }
                    } else {
                        result = false;
                    }
                    return result;
                };

                AbstractStackControllerModel.prototype._popTo = function (controller, suppressFireDescriptionChangeEvent) {
                    while (true) {
                        var peeked = this.peek();
                        if (peeked == null || peeked == controller) {
                            break;
                        } else {
                            this._pop(false, suppressFireDescriptionChangeEvent);
                        }
                    }
                };

                AbstractStackControllerModel.prototype._deStack = function (controller, suppressFireModelChangeEvent, suppressFireDescriptionChangeEvent) {
                    // pop or just silently remove as required
                    if (this.peek() == controller) {
                        this._pop(suppressFireModelChangeEvent, suppressFireDescriptionChangeEvent);
                    } else {
                        for (var i in this._stack) {
                            var entry = this._stack[i];
                            if (entry.controller == controller) {
                                this._stack.splice(i, 1);
                                this._updateListeningForStateDescriptionChanges();

                                break;
                            }
                        }
                    }
                };

                AbstractStackControllerModel.prototype._pop = function (suppressFireModelChangeEvent, suppressFireDescriptionChangeEvent) {
                    var result;
                    if (this._stack.length > 0) {
                        var previousEntry = this._stack[this._stack.length - 1];
                        var entries = this._stack.splice(this._stack.length - 1, 1);
                        if (suppressFireModelChangeEvent != true) {
                            var changeDescription = new templa.mvc.composite.StackControllerModelChangeDescription(templa.mvc.composite.stackControllerModelEventPopped, previousEntry.controller, this.peek());

                            // TODO need a popchange (reverse of push change)
                            this._fireModelChangeEvent(changeDescription, true);
                        }
                        if (suppressFireDescriptionChangeEvent != true) {
                            this._fireStateDescriptionChangeEvent(this, new AbstractStackControllerModelPopChange(this, entries[0]));
                        }
                        result = previousEntry;
                        this._updateListeningForStateDescriptionChanges();
                    } else {
                        result = null;
                    }
                    return result;
                };

                AbstractStackControllerModel.prototype._push = function (controller, data, suppressFireModelChangeEvent, suppressFireDescriptionChangeEvent) {
                    this._pushEntry({
                        controller: controller,
                        data: data
                    }, suppressFireModelChangeEvent, suppressFireDescriptionChangeEvent);
                };

                AbstractStackControllerModel.prototype._contains = function (controller) {
                    return this._indexOf(controller) != null;
                };

                AbstractStackControllerModel.prototype._indexOf = function (controller) {
                    var result = null;
                    for (var i in this._stack) {
                        var c = this._stack[i].controller;
                        if (c == controller) {
                            result = parseInt(i);
                            break;
                        }
                    }
                    return result;
                };

                AbstractStackControllerModel.prototype._pushEntryGetChange = function (entry, suppressFireModelChangeEvent) {
                    var previousController = this.peek();
                    this._stack.push(entry);
                    if (suppressFireModelChangeEvent != true) {
                        var description = new templa.mvc.composite.StackControllerModelChangeDescription(templa.mvc.composite.stackControllerModelEventPushed, previousController, entry.controller);
                        this._fireModelChangeEvent(description, true);
                    }
                    this._updateListeningForStateDescriptionChanges();
                    return new AbstractStackControllerModelPushChange(this, entry);
                };

                AbstractStackControllerModel.prototype._pushEntry = function (entry, suppressFireModelChangeEvent, suppressFireDescriptionChangeEvent) {
                    var change = this._pushEntryGetChange(entry, suppressFireModelChangeEvent);
                    if (suppressFireDescriptionChangeEvent != true) {
                        this._fireStateDescriptionChangeEvent(this, change);
                    }
                };

                AbstractStackControllerModel.prototype.peek = function () {
                    var result;
                    if (this._stack.length > 0) {
                        result = this._stack[this._stack.length - 1].controller;
                    } else {
                        result = null;
                    }
                    return result;
                };

                AbstractStackControllerModel.prototype.createStateDescription = function (models) {
                    models = this._checkModels(models);
                    var result = [];
                    for (var i in this._stack) {
                        var entry = this._stack[i];
                        var description = this._entryToDescription(entry, models);
                        result.push(description);
                    }
                    return result;
                };

                AbstractStackControllerModel.prototype.loadStateDescription = function (description) {
                    var descriptions = description;

                    while (!this.isStackEmpty()) {
                        this._pop(true);
                    }
                    for (var i in descriptions) {
                        var controllerDescription = descriptions[i];
                        var entry = this._createEntryFromDescription(controllerDescription);
                        if (entry != null) {
                            this._pushEntry(entry, true);
                        }
                    }
                };

                AbstractStackControllerModel.prototype._entryToDescription = function (entry, models) {
                    return null;
                };

                AbstractStackControllerModel.prototype._createEntryFromDescription = function (description) {
                    return null;
                };
                return AbstractStackControllerModel;
            })(templa.mvc.composite.AbstractCompositeControllerModel);
            composite.AbstractStackControllerModel = AbstractStackControllerModel;
        })(mvc.composite || (mvc.composite = {}));
        var composite = mvc.composite;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="AbstractStackControllerModel.ts"/>
///<reference path="../IModel.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        // Module
        (function (composite) {
            // Class
            var AbstractDescriptiveStackControllerModel = (function (_super) {
                __extends(AbstractDescriptiveStackControllerModel, _super);
                // Constructor
                function AbstractDescriptiveStackControllerModel(allowEmptyStack, controllersToDisplay) {
                    _super.call(this, allowEmptyStack, controllersToDisplay);
                    this._controllerFactories = {};
                }
                AbstractDescriptiveStackControllerModel.prototype.setControllerFactory = function (key, factory) {
                    this._controllerFactories[key] = factory;
                };

                AbstractDescriptiveStackControllerModel.prototype._entryToDescription = function (entry, models) {
                    var controllerFactoryKey = entry.data;
                    var modelData = entry.controller.getModel().createStateDescription(models);
                    return {
                        controllerFactoryKey: controllerFactoryKey,
                        modelData: modelData
                    };
                };

                AbstractDescriptiveStackControllerModel.prototype._createEntryFromDescription = function (description) {
                    var controllerFactoryKey = description["controllerFactoryKey"];
                    var modelData = description["modelData"];
                    var controllerFactory = this._controllerFactories[controllerFactoryKey];
                    var result;
                    if (controllerFactoryKey != null) {
                        var controller = controllerFactory(modelData);
                        result = {
                            controller: controller,
                            data: controllerFactoryKey
                        };
                    } else {
                        result = null;
                    }
                    return result;
                };
                return AbstractDescriptiveStackControllerModel;
            })(templa.mvc.composite.AbstractStackControllerModel);
            composite.AbstractDescriptiveStackControllerModel = AbstractDescriptiveStackControllerModel;
        })(mvc.composite || (mvc.composite = {}));
        var composite = mvc.composite;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="ICompositeControllerModel.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../IModel.ts"/>
///<reference path="AbstractCompositeControllerModel.ts"/>
///<reference path="IKeyedControllerModel.ts"/>
///<reference path="../IModel.ts"/>
///<reference path="../IController.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        // Module
        (function (composite) {
            // Class
            /**
            * basic implementation of a generic mapped controller
            */
            var MappedKeyedControllerModel = (function (_super) {
                __extends(MappedKeyedControllerModel, _super);
                // TODO remove this alternate constructor once compiler gets fixed
                function MappedKeyedControllerModel(_controllerMap) {
                    _super.call(this);
                    this._controllerMap = _controllerMap;
                    this._listeningForTokenChanges = false;
                    if (this._controllerMap == null) {
                        this._controllerMap = {};
                    }
                }
                MappedKeyedControllerModel.prototype.getControllerKey = function (controller) {
                    var result = null;
                    for (var key in this._controllerMap) {
                        var found = this._controllerMap[key];
                        if (found == controller) {
                            result = key;
                            break;
                        }
                    }
                    return result;
                };

                MappedKeyedControllerModel.prototype.getControllers = function () {
                    var result = [];
                    for (var key in this._controllerMap) {
                        var controller = this._controllerMap[key];
                        result.push(controller);
                    }
                    return result;
                };

                MappedKeyedControllerModel.prototype.setController = function (key, controller, doNotFireEvent) {
                    if (this._listeningForTokenChanges) {
                        var oldController = this._controllerMap[key];
                        if (oldController != null) {
                            var oldModel = oldController.getModel();
                            if (oldModel != null) {
                                oldModel.removeStateDescriptionChangeListener(this._stateDescriptionChangeListener);
                            }
                        }
                    }
                    this._controllerMap[key] = controller;
                    if (controller != null) {
                        var model = controller.getModel();
                        if (model != null) {
                            model.addStateDescriptionChangeListener(this._stateDescriptionChangeListener);
                        }
                    }
                    if (doNotFireEvent != true) {
                        this._fireModelChangeEvent(templa.mvc.composite.compositeControllerModelEventControllersChanged);
                    }
                };

                MappedKeyedControllerModel.prototype._getDescribedControllerKey = function (controller) {
                    return this.getControllerKey(controller);
                };

                MappedKeyedControllerModel.prototype._getDescribedController = function (key) {
                    return this._controllerMap[key];
                };

                MappedKeyedControllerModel.prototype.createStateDescription = function (models) {
                    models = this._checkModels(models);

                    var result = {};
                    var controllers = this._getDescribedControllers();
                    for (var i in controllers) {
                        var controller = controllers[i];
                        var model = controller.getModel();

                        if (model != null && models.indexOf(model) < 0) {
                            var key = this._getDescribedControllerKey(controller);
                            var description = model.createStateDescription(models);
                            if (description != null) {
                                result[key] = description;
                            }
                        }
                    }
                    return result;
                };

                MappedKeyedControllerModel.prototype.loadStateDescription = function (description) {
                    var result = {};
                    for (var key in description) {
                        var controller = this._getDescribedController(key);
                        if (controller != null) {
                            var model = controller.getModel();
                            if (model != null) {
                                var modelDescription = description[key];
                                model.loadStateDescription(modelDescription);
                            }
                        }
                    }
                };
                return MappedKeyedControllerModel;
            })(templa.mvc.composite.AbstractCompositeControllerModel);
            composite.MappedKeyedControllerModel = MappedKeyedControllerModel;
        })(mvc.composite || (mvc.composite = {}));
        var composite = mvc.composite;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="../IModel.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        // Module
        (function (tab) {
            tab.tabBarModelEventSelectedTabChange = "selectedTabId";
            tab.tabBarModelEventAvailableTabChange = "availableTabIds";

            
        })(mvc.tab || (mvc.tab = {}));
        var tab = mvc.tab;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="MappedKeyedControllerModel.ts"/>
///<reference path="ICompositeControllerModel.ts"/>
///<reference path="../AbstractModel.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../IModel.ts"/>
///<reference path="../ModelChangeEvent.ts"/>
///<reference path="../ModelChangeDescription.ts"/>
///<reference path="../tab/ITabBarModel.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        // Module
        (function (composite) {
            // Class
            /**
            * combined tab bar and composite model for common tab-bar behavior
            */
            var MappedTabControllerModel = (function (_super) {
                __extends(MappedTabControllerModel, _super);
                // Constructor
                function MappedTabControllerModel(selectedTabId, _tabIdsToControllers, _tabControllerKey, _controllerMap) {
                    _super.call(this, _controllerMap);
                    this._tabIdsToControllers = _tabIdsToControllers;
                    this._tabControllerKey = _tabControllerKey;
                    this._setSelectedTabId(selectedTabId);
                }
                MappedTabControllerModel.prototype.getSelectedTabId = function () {
                    return this._selectedTabId;
                };

                MappedTabControllerModel.prototype.getAvailableTabIds = function () {
                    // TODO sort this (platform dependent otherwise)
                    var result = [];
                    for (var tabId in this._tabIdsToControllers) {
                        result.push(tabId);
                    }
                    return result;
                };

                MappedTabControllerModel.prototype.requestSelectTabId = function (tabId) {
                    this._setSelectedTabId(tabId);
                };

                MappedTabControllerModel.prototype._setSelectedTabId = function (tabId, suppressModelChangeEvent) {
                    if (this._selectedTabId != tabId) {
                        this._selectedTabId = tabId;
                        var selectedTabController = this._tabIdsToControllers[tabId];
                        this.setController(this._tabControllerKey, selectedTabController, true);
                        if (suppressModelChangeEvent != true) {
                            this._fireModelChangeEvent(new templa.mvc.ModelChangeEvent([
                                new templa.mvc.ModelChangeDescription(templa.mvc.tab.tabBarModelEventSelectedTabChange),
                                new templa.mvc.ModelChangeDescription(templa.mvc.composite.compositeControllerModelEventControllersChanged)
                            ]));
                        }
                    }
                };

                MappedTabControllerModel.prototype.createStateDescription = function (models) {
                    var result = _super.prototype.createStateDescription.call(this, models);

                    result["_selectedTabId"] = this._selectedTabId;

                    return result;
                };

                MappedTabControllerModel.prototype.loadStateDescription = function (description) {
                    _super.prototype.loadStateDescription.call(this, description);
                    this._setSelectedTabId(description["_selectedTabId"], true);
                };

                MappedTabControllerModel.prototype._getDescribedControllers = function () {
                    var result = _super.prototype._getDescribedControllers.call(this);
                    for (var tabId in this._tabIdsToControllers) {
                        var controller = this._tabIdsToControllers[tabId];
                        if (result.indexOf(controller) < 0) {
                            result.push(controller);
                        }
                    }
                    return result;
                };

                MappedTabControllerModel.prototype._getDescribedControllerKey = function (controller) {
                    var result = _super.prototype._getDescribedControllerKey.call(this, controller);
                    if (result == this._tabControllerKey || result == null) {
                        for (var key in this._tabIdsToControllers) {
                            var tabController = this._tabIdsToControllers[key];
                            if (tabController == controller) {
                                result = key;
                                break;
                            }
                        }
                    }
                    return result;
                };

                MappedTabControllerModel.prototype._getDescribedController = function (key) {
                    var result = _super.prototype._getDescribedController.call(this, key);
                    if (result == null) {
                        result = this._tabIdsToControllers[key];
                    }
                    return result;
                };
                return MappedTabControllerModel;
            })(templa.mvc.composite.MappedKeyedControllerModel);
            composite.MappedTabControllerModel = MappedTabControllerModel;
        })(mvc.composite || (mvc.composite = {}));
        var composite = mvc.composite;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="../IModel.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../IModelStateChange.ts"/>
///<reference path="../../../d.ts/rison.d.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        // Module
        (function (history) {
            // Class
            var WebHistoryManager = (function () {
                // Constructor
                function WebHistoryManager(_controller) {
                    var _this = this;
                    this._controller = _controller;
                    this._modelStateChanges = [];
                    this._modelStateChangeIndex = null;
                    this._lastKnownData = null;

                    // TODO listen for changes to the model
                    this._model = this._controller.getModel();

                    this._stateDescriptionChangeListener = function (model, modelStateChange) {
                        _this.push(modelStateChange);
                    };

                    this._historyChangeListener = function (event) {
                        var state = event.state;
                        var description;
                        var sequenceNumber;
                        var parsedChangeIndex;
                        var dataString;
                        var hash = window.location.hash;
                        if (hash != null && hash.length > 0) {
                            if (hash.charAt(0) == '#') {
                                hash = hash.substring(1);
                            }
                            var index = hash.indexOf("!");
                            if (index >= 0) {
                                parsedChangeIndex = parseInt(hash.substring(0, index));
                                dataString = hash.substring(index + 1);
                            } else {
                                parsedChangeIndex = parseInt(hash);
                                dataString = null;
                            }
                        } else {
                            parsedChangeIndex = null;
                            dataString = null;
                        }

                        if (state == null && dataString != null) {
                            // TOOD parse out the state from the URL required
                            description = rison.decode(dataString);
                        } else {
                            description = state;
                        }
                        var back;
                        var change;
                        if (parsedChangeIndex != null && _this._modelStateChangeIndex != null && _this._modelStateChanges.length > parsedChangeIndex) {
                            if (parsedChangeIndex > _this._modelStateChangeIndex) {
                                back = false;
                                change = _this._modelStateChanges[parsedChangeIndex];
                            } else {
                                change = _this._modelStateChanges[_this._modelStateChangeIndex];
                                back = true;
                            }
                        } else {
                            change = null;
                        }
                        if (change != null) {
                            if (back) {
                                change.undo();
                            } else {
                                change.redo();
                            }
                        } else {
                            _this._controller.stop();
                            _this._model.loadStateDescription(description);
                            _this._controller.start();
                        }
                        _this._modelStateChangeIndex = parsedChangeIndex;
                    };
                }
                WebHistoryManager.prototype.push = function (modelStateChange, replace) {
                    var stateDescription = this._model.createStateDescription();
                    var s = rison.encode(stateDescription);
                    var before = window.location.protocol + "//" + window.location.host + window.location.pathname;
                    if (s != this._lastKnownData) {
                        if (this._modelStateChangeIndex == null) {
                            this._modelStateChangeIndex = 0;
                        } else {
                            this._modelStateChangeIndex++;
                        }
                        var url = before + "#" + this._modelStateChangeIndex + "!" + s;
                        if (replace) {
                            window.history.replaceState(stateDescription, this._controller.getTitle(), url);
                        } else {
                            window.history.pushState(stateDescription, this._controller.getTitle(), url);
                        }

                        // TODO maintain state changes alongside the shit (you know what I mean)
                        if (this._modelStateChanges.length < this._modelStateChangeIndex) {
                            this._modelStateChanges.push(modelStateChange);
                        } else {
                            this._modelStateChanges[this._modelStateChangeIndex] = modelStateChange;
                        }
                        this._lastKnownData = s;
                    }
                };

                WebHistoryManager.prototype.start = function () {
                    // force a hash on the URL
                    var hash = window.location.hash;
                    if (hash == null || hash.length == 0) {
                        this.push(null, true);
                    }
                    this._model.addStateDescriptionChangeListener(this._stateDescriptionChangeListener);
                    window.addEventListener('popstate', this._historyChangeListener);
                };

                WebHistoryManager.prototype.stop = function () {
                    this._model.removeStateDescriptionChangeListener(this._stateDescriptionChangeListener);
                    window.removeEventListener('popstate', this._historyChangeListener);
                };
                return WebHistoryManager;
            })();
            history.WebHistoryManager = WebHistoryManager;
        })(mvc.history || (mvc.history = {}));
        var history = mvc.history;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="../IController.ts"/>
///<reference path="../IModel.ts"/>
///<reference path="../IModel.ts"/>
///<reference path="../../loading/ILoadable.ts"/>
///<reference path="ILoadingControllerModel.ts"/>
///<reference path="../AbstractModel.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        // Module
        (function (loading) {
            // Class
            var LoadableProxyingLoadingControllerModel = (function (_super) {
                __extends(LoadableProxyingLoadingControllerModel, _super);
                // Constructor
                function LoadableProxyingLoadingControllerModel(_loadable) {
                    _super.call(this);
                    this._loadable = _loadable;
                }
                LoadableProxyingLoadingControllerModel.prototype.getLoadingProgress = function () {
                    return this._loadable.getLoadingProgress();
                };

                LoadableProxyingLoadingControllerModel.prototype.getMaximumProgress = function () {
                    return this._loadable.getMaximumProgress();
                };

                LoadableProxyingLoadingControllerModel.prototype.getErrors = function () {
                    return this._loadable.getErrors();
                };

                LoadableProxyingLoadingControllerModel.prototype.isComplete = function () {
                    return this._loadable.isComplete();
                };

                LoadableProxyingLoadingControllerModel.prototype.update = function () {
                    return this._loadable.update();
                };

                LoadableProxyingLoadingControllerModel.prototype.requestStartLoading = function (callback) {
                    var _this = this;
                    return this._loadable.requestStartLoading(function (loadable, message) {
                        if (callback) {
                            return callback(_this, message);
                        }
                        _this._fireModelChangeEvent();
                    });
                };
                return LoadableProxyingLoadingControllerModel;
            })(templa.mvc.AbstractModel);
            loading.LoadableProxyingLoadingControllerModel = LoadableProxyingLoadingControllerModel;
        })(mvc.loading || (mvc.loading = {}));
        var loading = mvc.loading;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="ILoadingControllerModel.ts"/>
///<reference path="../IModel.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../ModelChangeEvent.ts"/>
///<reference path="../composite/AbstractCompositeControllerModel.ts"/>
///<reference path="../composite/ICompositeControllerModel.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        // Module
        (function (loading) {
            // Class
            var SwitchOnLoadingCompositeControllerModel = (function (_super) {
                __extends(SwitchOnLoadingCompositeControllerModel, _super);
                // Constructor
                function SwitchOnLoadingCompositeControllerModel(_loadingController, _contentController, _loadingModel) {
                    var _this = this;
                    _super.call(this);
                    this._loadingController = _loadingController;
                    this._contentController = _contentController;
                    this._loadingModel = _loadingModel;
                    this._currentControllers = [];
                    this._onChangeListener = function (source, event) {
                        _this._checkCurrentController();
                    };
                }
                SwitchOnLoadingCompositeControllerModel.prototype._startedListening = function () {
                    this._checkCurrentController();
                    this._loadingModel.addOnChangeListener(this._onChangeListener);
                };

                SwitchOnLoadingCompositeControllerModel.prototype._stoppedListening = function () {
                    this._loadingModel.removeOnChangeListener(this._onChangeListener);
                };

                SwitchOnLoadingCompositeControllerModel.prototype.getControllers = function () {
                    return this._currentControllers;
                };

                SwitchOnLoadingCompositeControllerModel.prototype._getDescribedControllers = function () {
                    return [this._contentController];
                };

                SwitchOnLoadingCompositeControllerModel.prototype.createStateDescription = function (models) {
                    return this._contentController.getModel().createStateDescription();
                };

                SwitchOnLoadingCompositeControllerModel.prototype.loadStateDescription = function (description) {
                    return this._contentController.getModel().loadStateDescription(description);
                };

                SwitchOnLoadingCompositeControllerModel.prototype._checkCurrentController = function () {
                    var currentController;
                    if (this._loadingModel.isComplete()) {
                        currentController = this._contentController;
                    } else {
                        currentController = this._loadingController;
                    }
                    var changed;
                    if (this._currentControllers.length == 0) {
                        this._currentControllers.push(currentController);
                        changed = true;
                    } else {
                        if (this._currentControllers[0] != currentController) {
                            this._currentControllers[0] = currentController;
                            changed = true;
                        } else {
                            changed = false;
                        }
                    }
                    if (changed) {
                        this._fireModelChangeEvent(templa.mvc.composite.compositeControllerModelEventControllersChanged, true);
                    }
                };
                return SwitchOnLoadingCompositeControllerModel;
            })(templa.mvc.composite.AbstractCompositeControllerModel);
            loading.SwitchOnLoadingCompositeControllerModel = SwitchOnLoadingCompositeControllerModel;
        })(mvc.loading || (mvc.loading = {}));
        var loading = mvc.loading;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="../IController.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        (function (table) {
            var TableHeader = (function () {
                function TableHeader(_controller, _fromIndex, _span) {
                    this._controller = _controller;
                    this._fromIndex = _fromIndex;
                    this._span = _span;
                }
                TableHeader.prototype.getController = function () {
                    return this._controller;
                };

                TableHeader.prototype.getFromIndex = function () {
                    return this._fromIndex;
                };

                TableHeader.prototype.getSpan = function () {
                    return this._span;
                };
                return TableHeader;
            })();
            table.TableHeader = TableHeader;
        })(mvc.table || (mvc.table = {}));
        var table = mvc.table;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="TableHeader.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../IModel.ts"/>
///<reference path="ITableControllerModel.ts"/>
///<reference path="TableHeader.ts"/>
///<reference path="../AbstractModel.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../../util/Arrays.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        (function (table) {
            var AbstractTableControllerModel = (function (_super) {
                __extends(AbstractTableControllerModel, _super);
                function AbstractTableControllerModel(_rowCount, _columnCount, _rowHeaderDepth, _columnHeaderDepth) {
                    _super.call(this);
                    this._rowCount = _rowCount;
                    this._columnCount = _columnCount;
                    this._rowHeaderDepth = _rowHeaderDepth;
                    this._columnHeaderDepth = _columnHeaderDepth;

                    // create the cell array
                    this._cells = templa.util.Arrays.create2DArray(this._rowCount, this._columnCount);

                    // create the header arrays
                    this._rowHeaders = templa.util.Arrays.create2DArray(this._rowCount, this._rowHeaderDepth);
                    this._columnHeaders = templa.util.Arrays.create2DArray(this._columnCount, this._columnHeaderDepth);
                }
                AbstractTableControllerModel.prototype.getRowCount = function () {
                    return this._rowCount;
                };

                AbstractTableControllerModel.prototype.getColumnCount = function () {
                    return this._columnCount;
                };

                AbstractTableControllerModel.prototype.getRowHeaderDepth = function () {
                    return this._rowHeaderDepth;
                };

                AbstractTableControllerModel.prototype.getColumnHeaderDepth = function () {
                    return this._columnHeaderDepth;
                };

                AbstractTableControllerModel.prototype.getRowHeaders = function () {
                    return this._rowHeaders;
                };

                AbstractTableControllerModel.prototype.getRowHeader = function (row, depth) {
                    return this._rowHeaders[row][depth];
                };

                AbstractTableControllerModel.prototype.setRowHeader = function (header, depth) {
                    for (var i = 0; i < header.getSpan(); i++) {
                        this._rowHeaders[i + header.getFromIndex()][depth] = header;
                    }
                    this._fireModelChangeEvent();
                };

                AbstractTableControllerModel.prototype.getColumnHeaders = function () {
                    return this._columnHeaders;
                };

                AbstractTableControllerModel.prototype.getColumnHeader = function (column, depth) {
                    return this._columnHeaders[column][depth];
                };

                AbstractTableControllerModel.prototype.setColumnHeader = function (header, depth) {
                    for (var i = 0; i < header.getSpan(); i++) {
                        this._columnHeaders[i + header.getFromIndex()][depth] = header;
                    }
                    this._fireModelChangeEvent();
                };

                AbstractTableControllerModel.prototype.getCell = function (row, column) {
                    return this._cells[row][column];
                };

                AbstractTableControllerModel.prototype.setCell = function (row, column, cell) {
                    this._cells[row][column] = cell;

                    // TODO should probably be more specific about what has changed
                    this._fireModelChangeEvent();
                };
                return AbstractTableControllerModel;
            })(templa.mvc.AbstractModel);
            table.AbstractTableControllerModel = AbstractTableControllerModel;
        })(mvc.table || (mvc.table = {}));
        var table = mvc.table;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="TableHeader.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../../util/Arrays.ts"/>
var templa;
(function (templa) {
    (function (mvc) {
        (function (table) {
            var TableHeaderTree = (function () {
                function TableHeaderTree(_controller, _children) {
                    this._controller = _controller;
                    this._children = _children;
                }
                TableHeaderTree.populate = function (headerTrees, tableHeaders, depthOffset, breadthOffset) {
                    if (tableHeaders == null) {
                        var maxDepth = 0;
                        var totalBreadth = 0;
                        for (var i in headerTrees) {
                            var headerTree = headerTrees[i];
                            var depth = headerTree.getDepth();
                            var breadth = headerTree.getBreadth();
                            if (depth > maxDepth) {
                                maxDepth = depth;
                            }
                            totalBreadth += breadth;
                        }
                        tableHeaders = templa.util.Arrays.create2DArray(totalBreadth, maxDepth);
                    }
                    if (depthOffset == null) {
                        depthOffset = 0;
                    }
                    if (breadthOffset == null) {
                        breadthOffset = 0;
                    }
                    var index = breadthOffset;
                    for (var i in headerTrees) {
                        var headerTree = headerTrees[i];
                        headerTree.populateTableHeaders(tableHeaders, depthOffset, index);
                        var headerTreeBreadth = headerTree.getBreadth();
                        index += headerTreeBreadth;
                    }
                    return tableHeaders;
                };

                TableHeaderTree.prototype.getDepth = function () {
                    var result = 1;
                    if (this._children != null) {
                        // get max depth
                        var maxDepth = 0;
                        for (var i in this._children) {
                            var child = this._children[i];
                            var childDepth = child.getDepth();
                            if (childDepth > maxDepth) {
                                maxDepth = childDepth;
                            }
                        }
                        result += maxDepth;
                    }
                    return result;
                };

                TableHeaderTree.prototype.getBreadth = function () {
                    var result;
                    if (this._children != null) {
                        result = 0;
                        for (var i in this._children) {
                            var child = this._children[i];
                            result += child.getBreadth();
                        }
                    } else {
                        result = 1;
                    }
                    return result;
                };

                TableHeaderTree.prototype.populateTableHeaders = function (tableHeaders, depthOffset, breadthOffset) {
                    var breadth = this.getBreadth();
                    var tableHeader = new templa.mvc.table.TableHeader(this._controller, breadthOffset, breadth);
                    for (var i = 0; i < breadth; i++) {
                        tableHeaders[i + breadthOffset][depthOffset] = tableHeader;
                    }
                    if (this._children != null) {
                        TableHeaderTree.populate(this._children, tableHeaders, depthOffset + 1, breadthOffset);
                    }
                };
                return TableHeaderTree;
            })();
            table.TableHeaderTree = TableHeaderTree;
        })(mvc.table || (mvc.table = {}));
        var table = mvc.table;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
///<reference path="ITemplateSource.ts"/>
///<reference path="../loading/AbstractLoadable.ts"/>
///<reference path="../../d.ts/jquery.d.ts"/>
///<reference path="../../d.ts/handlebars.d.ts"/>
var templa;
(function (templa) {
    // Module
    (function (template) {
        // Class
        var ExternalHandlebarsTemplateSource = (function (_super) {
            __extends(ExternalHandlebarsTemplateSource, _super);
            // Constructor
            function ExternalHandlebarsTemplateSource(_url) {
                _super.call(this, 2, false);
                this._url = _url;
            }
            ExternalHandlebarsTemplateSource.prototype.resolve = function () {
                if (this._template == null) {
                    // synchronously load (not recommended)
                    var raw = $.ajax(this._url, { async: false }).responseText;
                    this._template = Handlebars.compile(raw);
                    this._setLoadingProgress(2, this._url);
                }
                return this._template;
            };

            ExternalHandlebarsTemplateSource.prototype._doStartLoading = function () {
                var _this = this;
                // asynchronously load
                var jqxhr = $.get(this._url, null, function (raw) {
                    _this._setLoadingProgress(1, _this._url);

                    //sleep
                    window.setTimeout(function () {
                        _this._template = Handlebars.compile(raw);
                        _this._setLoadingProgress(2, _this._url);
                    }, 0);
                });
                jqxhr.fail(function (header, status, errorThrown) {
                    _this._pushError("unable to load " + _this._url + " : " + status);
                });
            };
            return ExternalHandlebarsTemplateSource;
        })(templa.loading.AbstractLoadable);
        template.ExternalHandlebarsTemplateSource = ExternalHandlebarsTemplateSource;
    })(templa.template || (templa.template = {}));
    var template = templa.template;
})(templa || (templa = {}));
///<reference path="ITemplateSource.ts"/>
///<reference path="../loading/AbstractLoadable.ts"/>
///<reference path="../../d.ts/handlebars.d.ts"/>
var templa;
(function (templa) {
    // Module
    (function (template) {
        // Class
        var StringHandlebarsTemplateSource = (function (_super) {
            __extends(StringHandlebarsTemplateSource, _super);
            function StringHandlebarsTemplateSource(_inputTemplate) {
                _super.call(this, 1, true);
                this._inputTemplate = _inputTemplate;
            }
            StringHandlebarsTemplateSource.prototype.resolve = function () {
                if (this._template == null) {
                    this.compile();
                }
                return this._template;
            };

            StringHandlebarsTemplateSource.prototype.update = function () {
                this.compile();
                this._setLoadingProgress(1);
                return false;
            };

            StringHandlebarsTemplateSource.prototype.compile = function () {
                this._template = Handlebars.compile(this._inputTemplate);
            };
            return StringHandlebarsTemplateSource;
        })(templa.loading.AbstractLoadable);
        template.StringHandlebarsTemplateSource = StringHandlebarsTemplateSource;
    })(templa.template || (templa.template = {}));
    var template = templa.template;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (util) {
        // Module
        (function (Elements) {
            function find(attribute, value, nodes, filter) {
                var result = null;
                for (var i in nodes) {
                    var node = nodes[i];
                    if (node instanceof HTMLElement) {
                        var element = node;
                        var attributeValue = element.getAttribute(attribute);
                        if (attributeValue == value) {
                            result = node;
                            break;
                        } else {
                            var children = getChildren(element, filter);
                            result = find(attribute, value, children, filter);
                            if (result != null) {
                                break;
                            }
                        }
                    }
                }
                return result;
            }
            Elements.find = find;

            function getChildren(container, filter) {
                var collection = container.childNodes;
                var result = [];
                var i = 0;
                while (i < collection.length) {
                    var node = collection.item(i);
                    if (filter == null || filter(node)) {
                        result.push(node);
                    }
                    i++;
                }
                return result;
            }
            Elements.getChildren = getChildren;
        })(util.Elements || (util.Elements = {}));
        var Elements = util.Elements;
    })(templa.util || (templa.util = {}));
    var util = templa.util;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (util) {
        // Module
        (function (Strings) {
            function format(format, params) {
                var anyFormat = format;
                var result;
                if (anyFormat.format) {
                    // do it natively
                    result = anyFormat.format.apply(anyFormat, params);
                } else {
                    // do it using regex
                    var f = function (match, num) {
                        return typeof params[num] != 'undefined' ? params[num] : match;
                    };
                    result = format.replace((/{(\d+)}/g), f);
                }
                return result;
            }
            Strings.format = format;
        })(util.Strings || (util.Strings = {}));
        var Strings = util.Strings;
    })(templa.util || (templa.util = {}));
    var util = templa.util;
})(templa || (templa = {}));
