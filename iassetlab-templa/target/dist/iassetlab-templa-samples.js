var templa;
(function (templa) {
    (function (mvc) {
        var ModelChangeDescription = (function () {
            function ModelChangeDescription(_changeType) {
                this._changeType = _changeType;
            }
            Object.defineProperty(ModelChangeDescription.prototype, "changeType", {
                get: function () {
                    return this._changeType;
                },
                enumerable: true,
                configurable: true
            });
            return ModelChangeDescription;
        })();
        mvc.ModelChangeDescription = ModelChangeDescription;        
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        var ModelChangeEvent = (function () {
            function ModelChangeEvent(data) {
                if(data == null) {
                    this._descriptions = [];
                } else {
                    if(data instanceof mvc.ModelChangeDescription) {
                        this._descriptions = [
                            data
                        ];
                    } else if(data instanceof Array) {
                        this._descriptions = data;
                    } else {
                        this._descriptions = [
                            new mvc.ModelChangeDescription(data)
                        ];
                    }
                }
            }
            ModelChangeEvent.prototype.lookup = function (changeType) {
                var result = null;
                for(var i in this._descriptions) {
                    var description = this._descriptions[i];
                    if(description.changeType == changeType) {
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
var templa;
(function (templa) {
    })(templa || (templa = {}));
var templa;
(function (templa) {
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
                if(this._modelOnChangeListeners.length == 0) {
                    this._startedListening();
                }
                this._modelOnChangeListeners.push(listener);
            };
            AbstractModel.prototype.removeOnChangeListener = function (listener) {
                var removed = templa.util.Arrays.removeElement(this._modelOnChangeListeners, listener);
                if(removed && this._modelOnChangeListeners.length == 0) {
                    this._stoppedListening();
                }
            };
            AbstractModel.prototype._startedListening = function () {
            };
            AbstractModel.prototype._stoppedListening = function () {
            };
            AbstractModel.prototype._fireModelChangeEvent = function (changeEvent, suppressFireStateTokenChange) {
                if(changeEvent == null) {
                    changeEvent = new mvc.ModelChangeEvent();
                } else if(!(changeEvent instanceof mvc.ModelChangeEvent)) {
                    changeEvent = new mvc.ModelChangeEvent(changeEvent);
                }
                for(var i in this._modelOnChangeListeners) {
                    var modelOnChangeListener = this._modelOnChangeListeners[i];
                    modelOnChangeListener(this, changeEvent);
                }
                if(suppressFireStateTokenChange != true) {
                    this._fireStateDescriptionChangeEvent(this);
                }
            };
            AbstractModel.prototype.addStateDescriptionChangeListener = function (listener) {
                this._stateDescriptionChangeListeners.push(listener);
                if(this._stateDescriptionChangeListeners.length == 1) {
                    this._startedListeningForStateDescriptionChanges();
                }
            };
            AbstractModel.prototype.removeStateDescriptionChangeListener = function (listener) {
                templa.util.Arrays.removeElement(this._stateDescriptionChangeListeners, listener);
                if(this._stateDescriptionChangeListeners.length == 0) {
                    this._stoppedListeningForStateDescriptionChanges();
                }
            };
            AbstractModel.prototype._startedListeningForStateDescriptionChanges = function () {
            };
            AbstractModel.prototype._stoppedListeningForStateDescriptionChanges = function () {
            };
            AbstractModel.prototype._fireStateDescriptionChangeEvent = function (source, change) {
                var fired = [];
                for(var i in this._stateDescriptionChangeListeners) {
                    var stateTokenChangeListener = this._stateDescriptionChangeListeners[i];
                    if(fired.indexOf(stateTokenChangeListener) < 0) {
                        stateTokenChangeListener(source, change);
                        fired.push(stateTokenChangeListener);
                    }
                }
            };
            AbstractModel.prototype.createStateDescription = function (models) {
                this._checkModels(models);
                return null;
            };
            AbstractModel.prototype.loadStateDescription = function (description) {
            };
            AbstractModel.prototype._checkModels = function (models) {
                if(models == null) {
                    models = [
                        this
                    ];
                } else {
                    if(models.indexOf(this) >= 0) {
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
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var templa;
(function (templa) {
    (function (mvc) {
        (function (composite) {
            var AbstractCompositeControllerModel = (function (_super) {
                __extends(AbstractCompositeControllerModel, _super);
                function AbstractCompositeControllerModel() {
                    var _this = this;
                                _super.call(this);
                    this._stateDescriptionChangeListener = function (source, change) {
                        if(source != _this) {
                            _this._fireStateDescriptionChangeEvent(source, change);
                        }
                    };
                }
                AbstractCompositeControllerModel.prototype._getDescribedControllers = function () {
                    var controllers = this.getControllers();
                    var result = [];
                    for(var i in controllers) {
                        var controller = controllers[i];
                        if(controller.getModel() != this) {
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
                    var controllers = this._getDescribedControllers();
                    if(controllers != null) {
                        for(var i in controllers) {
                            var controller = controllers[i];
                            var model = controller.getModel();
                            if(model != null) {
                                model.addStateDescriptionChangeListener(this._stateDescriptionChangeListener);
                            }
                        }
                    }
                };
                AbstractCompositeControllerModel.prototype._stoppedListeningForStateDescriptionChanges = function () {
                    _super.prototype._startedListeningForStateDescriptionChanges.call(this);
                    var controllers = this._getDescribedControllers();
                    if(controllers != null) {
                        for(var i in controllers) {
                            var controller = controllers[i];
                            var model = controller.getModel();
                            if(model != null) {
                                model.removeStateDescriptionChangeListener(this._stateDescriptionChangeListener);
                            }
                        }
                    }
                };
                AbstractCompositeControllerModel.prototype.createStateDescription = function (models) {
                    models = this._checkModels(models);
                    var controllers = this._getDescribedControllers();
                    var result = [];
                    if(controllers != null) {
                        for(var i in controllers) {
                            var controller = controllers[i];
                            var model = controller.getModel();
                            var entry;
                            if(model != null) {
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
                    for(var i in descriptions) {
                        var entry = descriptions[i];
                        var controller = controllers[i];
                        var model = controller.getModel();
                        if(model != null) {
                            model.loadStateDescription(entry);
                        }
                    }
                };
                return AbstractCompositeControllerModel;
            })(mvc.AbstractModel);
            composite.AbstractCompositeControllerModel = AbstractCompositeControllerModel;            
        })(mvc.composite || (mvc.composite = {}));
        var composite = mvc.composite;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        mvc.CommandTypeScreen = 0;
        mvc.CommandTypeBack = 1;
        mvc.CommandTypeForward = 2;
        var Command = (function () {
            function Command(_id, _commandType, _priority, _action) {
                this._id = _id;
                this._commandType = _commandType;
                this._priority = _priority;
                this._action = _action;
                this._enabled = true;
            }
            Object.defineProperty(Command.prototype, "priority", {
                get: function () {
                    return this._priority;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Command.prototype, "commandType", {
                get: function () {
                    return this._commandType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Command.prototype, "enabled", {
                get: function () {
                    return this._enabled;
                },
                set: function (_enabled) {
                    this._enabled = _enabled;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Command.prototype, "id", {
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Command.prototype, "action", {
                get: function () {
                    return this._action;
                },
                enumerable: true,
                configurable: true
            });
            return Command;
        })();
        mvc.Command = Command;        
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        var ControllerChangeEvent = (function () {
            function ControllerChangeEvent(_commandsChanged, _titleChanged) {
                this._commandsChanged = _commandsChanged;
                this._titleChanged = _titleChanged;
            }
            Object.defineProperty(ControllerChangeEvent.prototype, "commandsChanged", {
                get: function () {
                    return this._commandsChanged;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ControllerChangeEvent.prototype, "titleChanged", {
                get: function () {
                    return this._titleChanged;
                },
                enumerable: true,
                configurable: true
            });
            return ControllerChangeEvent;
        })();
        mvc.ControllerChangeEvent = ControllerChangeEvent;        
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    })(templa || (templa = {}));
var templa;
(function (templa) {
    })(templa || (templa = {}));
var templa;
(function (templa) {
    (function (animation) {
        var AnimationStateChangeEvent = (function () {
            function AnimationStateChangeEvent(_animationState) {
                this._animationState = _animationState;
            }
            Object.defineProperty(AnimationStateChangeEvent.prototype, "animationState", {
                get: function () {
                    return this._animationState;
                },
                enumerable: true,
                configurable: true
            });
            return AnimationStateChangeEvent;
        })();
        animation.AnimationStateChangeEvent = AnimationStateChangeEvent;        
    })(templa.animation || (templa.animation = {}));
    var animation = templa.animation;
})(templa || (templa = {}));
var templa;
(function (templa) {
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
    (function (mvc) {
        mvc.ControllerStateUninitialized = 0;
        mvc.ControllerStateInitialized = 1;
        mvc.ControllerStateStarted = 2;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
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
var templa;
(function (templa) {
    (function (mvc) {
            })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (composite) {
            var MappedKeyedControllerModel = (function (_super) {
                __extends(MappedKeyedControllerModel, _super);
                function MappedKeyedControllerModel(_controllerMap) {
                                _super.call(this);
                    this._controllerMap = _controllerMap;
                    this._listeningForTokenChanges = false;
                    if(this._controllerMap == null) {
                        this._controllerMap = {
                        };
                    }
                }
                MappedKeyedControllerModel.prototype.getControllerKey = function (controller) {
                    var result = null;
                    for(var key in this._controllerMap) {
                        var found = this._controllerMap[key];
                        if(found == controller) {
                            result = key;
                            break;
                        }
                    }
                    return result;
                };
                MappedKeyedControllerModel.prototype.getControllers = function () {
                    var result = [];
                    for(var key in this._controllerMap) {
                        var controller = this._controllerMap[key];
                        result.push(controller);
                    }
                    return result;
                };
                MappedKeyedControllerModel.prototype.setController = function (key, controller, doNotFireEvent) {
                    if(this._listeningForTokenChanges) {
                        var oldController = this._controllerMap[key];
                        if(oldController != null) {
                            var oldModel = oldController.getModel();
                            if(oldModel != null) {
                                oldModel.removeStateDescriptionChangeListener(this._stateDescriptionChangeListener);
                            }
                        }
                    }
                    this._controllerMap[key] = controller;
                    if(controller != null) {
                        var model = controller.getModel();
                        if(model != null) {
                            model.addStateDescriptionChangeListener(this._stateDescriptionChangeListener);
                        }
                    }
                    if(doNotFireEvent != true) {
                        this._fireModelChangeEvent(composite.compositeControllerModelEventControllersChanged);
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
                    var result = {
                    };
                    var controllers = this._getDescribedControllers();
                    for(var i in controllers) {
                        var controller = controllers[i];
                        var model = controller.getModel();
                        if(model != null && models.indexOf(model) < 0) {
                            var key = this._getDescribedControllerKey(controller);
                            var description = model.createStateDescription(models);
                            if(description != null) {
                                result[key] = description;
                            }
                        }
                    }
                    return result;
                };
                MappedKeyedControllerModel.prototype.loadStateDescription = function (description) {
                    var result = {
                    };
                    for(var key in description) {
                        var controller = this._getDescribedController(key);
                        if(controller != null) {
                            var model = controller.getModel();
                            if(model != null) {
                                var modelDescription = description[key];
                                model.loadStateDescription(modelDescription);
                            }
                        }
                    }
                };
                return MappedKeyedControllerModel;
            })(composite.AbstractCompositeControllerModel);
            composite.MappedKeyedControllerModel = MappedKeyedControllerModel;            
        })(mvc.composite || (mvc.composite = {}));
        var composite = mvc.composite;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
                    })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                var JQueryElementReference = (function () {
                    function JQueryElementReference(_selectorHandler, _selector) {
                        this._selectorHandler = _selectorHandler;
                        this._selector = _selector;
                    }
                    JQueryElementReference.prototype.resolve = function () {
                        var query = this._selectorHandler.$(this._selector);
                        var result;
                        if(query.length > 0) {
                            result = query.get()[0];
                        } else {
                            result = null;
                        }
                        return result;
                    };
                    return JQueryElementReference;
                })();
                jquery.JQueryElementReference = JQueryElementReference;                
            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
            })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
            })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (util) {
        (function (Elements) {
            function find(attribute, value, nodes, filter) {
                var result = null;
                for(var i in nodes) {
                    var node = nodes[i];
                    if(node instanceof HTMLElement) {
                        var element = node;
                        var attributeValue = element.getAttribute(attribute);
                        if(attributeValue == value) {
                            result = node;
                            break;
                        } else {
                            var children = getChildren(element, filter);
                            result = find(attribute, value, children, filter);
                            if(result != null) {
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
                while(i < collection.length) {
                    var node = collection.item(i);
                    if(filter == null || filter(node)) {
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
    (function (mvc) {
        (function (element) {
            var AttributeElementReference = (function () {
                function AttributeElementReference(_view, _attributeName, _attributeValue, _filter) {
                    this._view = _view;
                    this._attributeName = _attributeName;
                    this._attributeValue = _attributeValue;
                    this._filter = _filter;
                }
                AttributeElementReference.prototype.resolve = function () {
                    return templa.util.Elements.find(this._attributeName, this._attributeValue, this._view.getRoots(), this._filter);
                };
                return AttributeElementReference;
            })();
            element.AttributeElementReference = AttributeElementReference;            
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (util) {
        (function (Arrays) {
            function removeElement(array, element) {
                var result = false;
                var index = array.length;
                while(index > 0) {
                    index--;
                    var found = array[index];
                    if(found == element) {
                        result = true;
                        array.splice(index, 1);
                        break;
                    }
                }
                return result;
            }
            Arrays.removeElement = removeElement;
            function pushAll(into, elements) {
                for(var i in elements) {
                    var element = elements[i];
                    into.push(element);
                }
            }
            Arrays.pushAll = pushAll;
        })(util.Arrays || (util.Arrays = {}));
        var Arrays = util.Arrays;
    })(templa.util || (templa.util = {}));
    var util = templa.util;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        var AbstractController = (function () {
            function AbstractController() {
                this._state = templa.mvc.ControllerStateUninitialized;
            }
            AbstractController.prototype.getModel = function () {
                return this._model;
            };
            AbstractController.prototype.setModel = function (model) {
                if(this._state >= mvc.ControllerStateStarted && this._model != null) {
                    this._model.removeOnChangeListener(this._modelOnChangeListener);
                }
                this._model = model;
                if(this._state >= mvc.ControllerStateStarted && this._model != null) {
                    this._doLoad(model);
                    this._model.addOnChangeListener(this._modelOnChangeListener);
                }
            };
            AbstractController.prototype.init = function (container, prepend) {
                if(container == null) {
                    throw "no container!";
                }
                var result;
                this._viewContainer = container;
                this._viewPrepend = prepend;
                if(this._state == templa.mvc.ControllerStateUninitialized) {
                    result = this._doInit(container, prepend);
                    if(result) {
                        this._state = templa.mvc.ControllerStateInitialized;
                        if(this._animations != null) {
                            for(var i in this._animations) {
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
            AbstractController.prototype._doInit = function (container, prepend) {
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
                this._doLoad(this._model);
            };
            AbstractController.prototype.start = function () {
                var _this = this;
                var result;
                if(this._state == templa.mvc.ControllerStateInitialized) {
                    result = this._doStart();
                    if(result) {
                        this._state = templa.mvc.ControllerStateStarted;
                        this._modelOnChangeListener = function (model, event) {
                            _this._handleModelChangeEvent(event);
                        };
                        this._model.addOnChangeListener(this._modelOnChangeListener);
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
                if(this._state == templa.mvc.ControllerStateStarted) {
                    result = this._doStop();
                    if(result) {
                        this._state = templa.mvc.ControllerStateInitialized;
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
                var result;
                if(this._state == templa.mvc.ControllerStateInitialized) {
                    this._clearAnimations();
                    result = this._doDestroy(detachView);
                    if(result) {
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
                if(this._controllerOnChangeListeners == null) {
                    this._controllerOnChangeListeners = [];
                }
                this._controllerOnChangeListeners.push(listener);
            };
            AbstractController.prototype.removeOnChangeListener = function (listener) {
                if(this._controllerOnChangeListeners != null) {
                    templa.util.Arrays.removeElement(this._controllerOnChangeListeners, listener);
                    if(this._controllerOnChangeListeners.length == 0) {
                        this._controllerOnChangeListeners = null;
                    }
                }
            };
            AbstractController.prototype._fireControllerChangeEvent = function (controllerChangeEvent) {
                if(this._controllerOnChangeListeners != null) {
                    for(var i in this._controllerOnChangeListeners) {
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
                if(view != null) {
                    var recreate = view.layout();
                    var state = this.getState();
                    if(recreate) {
                        if(state >= mvc.ControllerStateStarted) {
                            this.stop();
                        }
                        if(state >= mvc.ControllerStateInitialized) {
                            this.destroy();
                            this.init(this._viewContainer, this._viewPrepend);
                        }
                        if(state >= mvc.ControllerStateStarted) {
                            this.start();
                        }
                    }
                }
            };
            AbstractController.prototype._isAnimating = function () {
                return this._animations != null && this._animations.length > 0;
            };
            AbstractController.prototype._clearAnimations = function () {
                if(this._animations != null) {
                    for(var i in this._animations) {
                        var animation = this._animations[i];
                        animation.destroy();
                    }
                    this._animations = null;
                }
            };
            AbstractController.prototype._addAnimation = function (animation, doNotStart) {
                var _this = this;
                if(this._animations == null) {
                    this._animations = [];
                    this._animationListener = function (source, event) {
                        if(event.animationState == templa.animation.animationStateFinished) {
                            _this._removeAnimation(source, true);
                            _this.layout();
                        }
                    };
                }
                this._animations.push(animation);
                animation.addAnimationListener(this._animationListener);
                if(doNotStart != true && this._state >= mvc.ControllerStateInitialized) {
                    animation.init();
                    animation.start();
                }
            };
            AbstractController.prototype._removeAnimation = function (animation, doNotDestroy) {
                if(this._animations != null) {
                    if(templa.util.Arrays.removeElement(this._animations, animation)) {
                        animation.removeAnimationListener(this._animationListener);
                    }
                }
                if(doNotDestroy != true) {
                    animation.destroy();
                }
            };
            AbstractController.prototype._safeTimeout = function (f, millis) {
                var _this = this;
                window.setTimeout(function () {
                    if(_this.getState() == mvc.ControllerStateStarted) {
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
        (function (element) {
            var AbstractElementController = (function (_super) {
                __extends(AbstractElementController, _super);
                function AbstractElementController(_viewFactory) {
                                _super.call(this);
                    this._viewFactory = _viewFactory;
                }
                AbstractElementController.prototype.getView = function () {
                    return this._view;
                };
                AbstractElementController.prototype._doInit = function (container, prepend) {
                    this._view = this._viewFactory.create(container, prepend);
                    this._view.attach();
                    return true;
                };
                AbstractElementController.prototype._doDestroy = function (detachView) {
                    if(detachView != false) {
                        this._view.detach();
                    }
                    this._view = null;
                    return true;
                };
                return AbstractElementController;
            })(mvc.AbstractController);
            element.AbstractElementController = AbstractElementController;            
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            var DirectElementReference = (function () {
                function DirectElementReference(_element) {
                    this._element = _element;
                }
                DirectElementReference.prototype.resolve = function () {
                    return this._element;
                };
                return DirectElementReference;
            })();
            element.DirectElementReference = DirectElementReference;            
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                var AbstractJQueryController = (function (_super) {
                    __extends(AbstractJQueryController, _super);
                    function AbstractJQueryController(_viewFactory) {
                                        _super.call(this, _viewFactory);
                    }
                    AbstractJQueryController.prototype.$ = function (selector, roots) {
                        if(roots == null) {
                            roots = this._view.getRoots();
                        }
                        if(selector) {
                            var self = $(roots).filter(selector);
                            return $(roots).find(selector).add(self);
                        } else {
                            return $(roots);
                        }
                    };
                    AbstractJQueryController.prototype.$reference = function (selector) {
                        var query = this.$(selector);
                        var result;
                        if(query.length > 0) {
                            result = new templa.mvc.element.DirectElementReference(query.get(0));
                        } else {
                            result = null;
                        }
                        return result;
                    };
                    return AbstractJQueryController;
                })(element.AbstractElementController);
                jquery.AbstractJQueryController = AbstractJQueryController;                
            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            var ViewRootElementReference = (function () {
                function ViewRootElementReference(_view) {
                    this._view = _view;
                }
                ViewRootElementReference.prototype.resolve = function () {
                    return this._view.getRoots()[0];
                };
                return ViewRootElementReference;
            })();
            element.ViewRootElementReference = ViewRootElementReference;            
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (composite) {
                var AbstractCompositeElementController = (function (_super) {
                    __extends(AbstractCompositeElementController, _super);
                    function AbstractCompositeElementController(viewFactory) {
                        var _this = this;
                                        _super.call(this, viewFactory);
                        this._controllers = [];
                        this._controllerOnChangeListener = function (controller, event) {
                            _this._fireControllerChangeEvent(event);
                        };
                    }
                    AbstractCompositeElementController.prototype._doLoad = function (model) {
                        this.clear(false);
                        var compositeControllerModel = model;
                        var controllers = compositeControllerModel.getControllers();
                        for(var i in controllers) {
                            var controller = controllers[i];
                            this._add(controller, false, false);
                        }
                        this._fireControllerChangeEvent(new mvc.ControllerChangeEvent(true, true));
                        this.layout();
                    };
                    AbstractCompositeElementController.prototype.clear = function (fireEvent) {
                        if(this._controllers.length > 0) {
                            var state = this.getState();
                            for(var i in this._controllers) {
                                var controller = this._controllers[i];
                                if(state >= templa.mvc.ControllerStateInitialized) {
                                    if(state >= templa.mvc.ControllerStateStarted) {
                                        controller.removeOnChangeListener(this._controllerOnChangeListener);
                                        controller.stop();
                                    }
                                    controller.destroy();
                                }
                            }
                            if(fireEvent) {
                                this._fireControllerChangeEvent(new mvc.ControllerChangeEvent(true, true));
                            }
                            this._controllers = [];
                        }
                    };
                    AbstractCompositeElementController.prototype._doStart = function () {
                        var result = _super.prototype._doStart.call(this);
                        for(var i in this._controllers) {
                            var controller = this._controllers[i];
                            result = result && controller.start();
                        }
                        return result;
                    };
                    AbstractCompositeElementController.prototype._doStop = function () {
                        var result = _super.prototype._doStop.call(this);
                        for(var i in this._controllers) {
                            var controller = this._controllers[i];
                            result = result && controller.stop();
                        }
                        return result;
                    };
                    AbstractCompositeElementController.prototype._doInit = function (container, prepend) {
                        var result = _super.prototype._doInit.call(this, container, prepend);
                        for(var i in this._controllers) {
                            var controller = this._controllers[i];
                            var controllerContainer = this.getControllerContainer(controller);
                            result = result && controller.init(controllerContainer, false);
                        }
                        return result;
                    };
                    AbstractCompositeElementController.prototype._doDestroy = function (detachView) {
                        var result = true;
                        for(var i in this._controllers) {
                            var controller = this._controllers[i];
                            result = controller.destroy(false) && result;
                        }
                        result = _super.prototype._doDestroy.call(this, detachView) && result;
                        return result;
                    };
                    AbstractCompositeElementController.prototype._add = function (controller, fireEvent, layout, prepend) {
                        this._controllers.push(controller);
                        var container = this.getControllerContainer(controller);
                        if(container == null) {
                            throw "no container!";
                        }
                        var state = this.getState();
                        if(state >= mvc.ControllerStateInitialized) {
                            controller.init(container, prepend);
                            if(state >= mvc.ControllerStateStarted) {
                                controller.addOnChangeListener(this._controllerOnChangeListener);
                                controller.start();
                            }
                        }
                        if(fireEvent != false) {
                            this._fireControllerChangeEvent(new mvc.ControllerChangeEvent(true, true));
                        }
                        if(layout != false) {
                            this.layout();
                        }
                    };
                    AbstractCompositeElementController.prototype._remove = function (controller, detachView, layout) {
                        var removed = templa.util.Arrays.removeElement(this._controllers, controller);
                        if(removed) {
                            var state = this.getState();
                            if(state >= mvc.ControllerStateInitialized) {
                                if(state >= mvc.ControllerStateStarted) {
                                    controller.stop();
                                    controller.removeOnChangeListener(this._controllerOnChangeListener);
                                }
                                controller.destroy(detachView);
                            }
                            this._fireControllerChangeEvent(new mvc.ControllerChangeEvent(true, true));
                            if(layout != false) {
                                this.layout();
                            }
                        }
                    };
                    AbstractCompositeElementController.prototype._handleModelChangeEvent = function (event) {
                        _super.prototype._handleModelChangeEvent.call(this, event);
                        this._fireControllerChangeEvent(new mvc.ControllerChangeEvent(true, true));
                    };
                    AbstractCompositeElementController.prototype.getControllerContainer = function (controller) {
                        return new element.ViewRootElementReference(this._view);
                        ;
                    };
                    AbstractCompositeElementController.prototype.getCommands = function () {
                        var commands = [];
                        for(var i in this._controllers) {
                            var controller = this._controllers[i];
                            var controllerCommands = controller.getCommands();
                            if(controllerCommands != null) {
                                templa.util.Arrays.pushAll(commands, controllerCommands);
                            }
                        }
                        return commands;
                    };
                    AbstractCompositeElementController.prototype.getTitle = function () {
                        var title = null;
                        for(var i in this._controllers) {
                            var controller = this._controllers[i];
                            title = controller.getTitle();
                            if(title != null) {
                                break;
                            }
                        }
                        return title;
                    };
                    AbstractCompositeElementController.prototype.layout = function () {
                        _super.prototype.layout.call(this);
                        for(var i in this._controllers) {
                            var controller = this._controllers[i];
                            controller.layout();
                        }
                    };
                    return AbstractCompositeElementController;
                })(templa.mvc.element.AbstractElementController);
                composite.AbstractCompositeElementController = AbstractCompositeElementController;                
            })(element.composite || (element.composite = {}));
            var composite = element.composite;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                (function (composite) {
                    var AbstractCompositeJQueryController = (function (_super) {
                        __extends(AbstractCompositeJQueryController, _super);
                        function AbstractCompositeJQueryController(viewFactory) {
                                                _super.call(this, viewFactory);
                        }
                        AbstractCompositeJQueryController.prototype.$ = function (selector) {
                            var roots = this._view.getRoots();
                            var allChildRoots = [];
                            for(var i in this._controllers) {
                                var controller = this._controllers[i];
                                var view = controller.getView();
                                if(view != null) {
                                    var childRoots = view.getRoots();
                                    if(childRoots != null) {
                                        templa.util.Arrays.pushAll(allChildRoots, childRoots);
                                    }
                                }
                            }
                            var query = $(roots).find(selector).filter(function (index) {
                                var valid = true;
                                var e = this;
                                while(e != null) {
                                    if(roots.indexOf(e) >= 0) {
                                        break;
                                    } else if(allChildRoots.indexOf(e) >= 0) {
                                        valid = false;
                                        break;
                                    } else {
                                        e = e.parentNode;
                                    }
                                }
                                return valid;
                            });
                            var self = $(roots).filter(selector);
                            query = query.add(self);
                            return query;
                        };
                        AbstractCompositeJQueryController.prototype.$reference = function (selector) {
                            var query = this.$(selector);
                            var result;
                            if(query.length > 0) {
                                result = new element.DirectElementReference(query.get(0));
                            } else {
                                result = null;
                            }
                            return result;
                        };
                        AbstractCompositeJQueryController.prototype.getControllerContainer = function (controller) {
                            var selector = this.getControllerContainerSelector(controller);
                            var result;
                            if(selector == null) {
                                result = _super.prototype.getControllerContainer.call(this, controller);
                            } else {
                                result = this.$reference(selector);
                            }
                            if(result == null) {
                                throw "no container for selector " + selector;
                            }
                            return result;
                        };
                        AbstractCompositeJQueryController.prototype.getControllerContainerSelector = function (controller) {
                            return null;
                        };
                        return AbstractCompositeJQueryController;
                    })(templa.mvc.element.composite.AbstractCompositeElementController);
                    composite.AbstractCompositeJQueryController = AbstractCompositeJQueryController;                    
                })(jquery.composite || (jquery.composite = {}));
                var composite = jquery.composite;
            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                (function (composite) {
                    var KeyedJQueryController = (function (_super) {
                        __extends(KeyedJQueryController, _super);
                        function KeyedJQueryController(_viewFactory, _keysToSelectors) {
                                                _super.call(this, _viewFactory);
                            this._keysToSelectors = _keysToSelectors;
                            if(this._keysToSelectors == null) {
                                this._keysToSelectors = {
                                };
                            }
                        }
                        KeyedJQueryController.prototype.setKeyAndSelector = function (key, selector) {
                            this._keysToSelectors[key] = selector;
                        };
                        KeyedJQueryController.prototype.getControllerContainerSelector = function (controller) {
                            var model = this._model;
                            var key = model.getControllerKey(controller);
                            var selector = this._keysToSelectors[key];
                            if(selector == null && key != null) {
                                selector = key;
                            }
                            return selector;
                        };
                        return KeyedJQueryController;
                    })(composite.AbstractCompositeJQueryController);
                    composite.KeyedJQueryController = KeyedJQueryController;                    
                })(jquery.composite || (jquery.composite = {}));
                var composite = jquery.composite;
            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
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
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            var DocumentFragmentElementView = (function () {
                function DocumentFragmentElementView(_fragment, _container, _prepend, _id) {
                    this._fragment = _fragment;
                    this._container = _container;
                    this._prepend = _prepend;
                    this._id = _id;
                    this._attached = false;
                    if(this._container == null) {
                        throw new Error("no container!");
                    }
                }
                DocumentFragmentElementView.createFromHTML = function createFromHTML(html, container, prepend, id) {
                    var fragment = document.createDocumentFragment();
                    var element = document.createElement("div");
                    if(html != null) {
                        element.innerHTML = html;
                    }
                    var childNodes = element.childNodes;
                    for(var i in childNodes) {
                        var childNode = childNodes[i];
                        if(childNode instanceof Element) {
                            var clone = childNode.cloneNode(true);
                            clone.setAttribute("view_id", id);
                            fragment.appendChild(clone);
                        }
                    }
                    return new DocumentFragmentElementView(fragment, container, prepend, id);
                };
                DocumentFragmentElementView.prototype.attach = function () {
                    var containerElement = this._container.resolve();
                    if(this._prepend) {
                        containerElement.insertBefore(this._fragment, containerElement.firstChild);
                    } else {
                        containerElement.appendChild(this._fragment);
                    }
                    this._attached = true;
                };
                DocumentFragmentElementView.prototype.detach = function () {
                    var elements = this.getRoots();
                    var container = this._container.resolve();
                    for(var i in elements) {
                        var element = elements[i];
                        container.removeChild(element);
                    }
                    this._attached = false;
                };
                DocumentFragmentElementView.prototype.layout = function () {
                    return false;
                };
                DocumentFragmentElementView.prototype.getRoots = function () {
                    var roots = [];
                    var childNodes;
                    if(this._attached) {
                        var container = this._container.resolve();
                        childNodes = container.childNodes;
                    } else {
                        childNodes = this._fragment.childNodes;
                    }
                    for(var i in childNodes) {
                        var childNode = childNodes[i];
                        if(childNode instanceof Element && childNode.getAttribute("view_id") == this._id) {
                            roots.push(childNode);
                        }
                    }
                    return roots;
                };
                return DocumentFragmentElementView;
            })();
            element.DocumentFragmentElementView = DocumentFragmentElementView;            
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            var divElementCount = 0;
            var DocumentFragmentElementViewFactory = (function () {
                function DocumentFragmentElementViewFactory(_html) {
                    this._html = _html;
                    if(this._html == null) {
                        this._html = "<div></div>";
                    }
                }
                DocumentFragmentElementViewFactory.prototype.create = function (container, prepend) {
                    return this._createDiv(container, prepend, this._html);
                };
                DocumentFragmentElementViewFactory.prototype._createDiv = function (container, prepend, html) {
                    var count = divElementCount;
                    var id = "__div_ele_" + count;
                    divElementCount++;
                    return element.DocumentFragmentElementView.createFromHTML(html, container, prepend, id);
                };
                return DocumentFragmentElementViewFactory;
            })();
            element.DocumentFragmentElementViewFactory = DocumentFragmentElementViewFactory;            
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (composite) {
            var StackControllerModelChangeDescription = (function (_super) {
                __extends(StackControllerModelChangeDescription, _super);
                function StackControllerModelChangeDescription(changeType, _removedController, _addedController, _silentRemovedControllers, _silentAddedControllers) {
                                _super.call(this, changeType);
                    this._removedController = _removedController;
                    this._addedController = _addedController;
                    this._silentRemovedControllers = _silentRemovedControllers;
                    this._silentAddedControllers = _silentAddedControllers;
                }
                Object.defineProperty(StackControllerModelChangeDescription.prototype, "removedController", {
                    get: function () {
                        return this._removedController;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(StackControllerModelChangeDescription.prototype, "addedController", {
                    get: function () {
                        return this._addedController;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(StackControllerModelChangeDescription.prototype, "silentRemovedControllers", {
                    get: function () {
                        return this._silentRemovedControllers;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(StackControllerModelChangeDescription.prototype, "silentAddedControllers", {
                    get: function () {
                        return this._silentAddedControllers;
                    },
                    enumerable: true,
                    configurable: true
                });
                return StackControllerModelChangeDescription;
            })(mvc.ModelChangeDescription);
            composite.StackControllerModelChangeDescription = StackControllerModelChangeDescription;            
        })(mvc.composite || (mvc.composite = {}));
        var composite = mvc.composite;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (animation) {
            })(templa.animation || (templa.animation = {}));
    var animation = templa.animation;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                (function (composite) {
                    var StackJQueryController = (function (_super) {
                        __extends(StackJQueryController, _super);
                        function StackJQueryController(viewFactory, _animationFactoryBundles) {
                            var _this = this;
                                                _super.call(this, viewFactory);
                            this._animationFactoryBundles = _animationFactoryBundles;
                            this.removedAnimatedChildren = [];
                            this._backCommand = new mvc.Command("back", mvc.CommandTypeBack, 1, function () {
                                _this._back();
                            });
                        }
                        Object.defineProperty(StackJQueryController.prototype, "animationFactoryBundles", {
                            set: function (_animationFactoryBundles) {
                                this._animationFactoryBundles = _animationFactoryBundles;
                            },
                            enumerable: true,
                            configurable: true
                        });
                        StackJQueryController.prototype._handleModelChangeEvent = function (event) {
                            var pushed;
                            var stackChangeDescription = event.lookup(templa.mvc.composite.stackControllerModelEventPushed);
                            if(stackChangeDescription == null) {
                                stackChangeDescription = event.lookup(templa.mvc.composite.stackControllerModelEventPopped);
                                pushed = false;
                            } else {
                                pushed = true;
                            }
                            if(stackChangeDescription != null) {
                                var stackDescription = stackChangeDescription;
                                var silentRemovedControllers = stackDescription.silentRemovedControllers;
                                if(silentRemovedControllers != null) {
                                    for(var i in silentRemovedControllers) {
                                        var silentRemovedController = silentRemovedControllers[i];
                                        this._remove(silentRemovedController, true, false);
                                    }
                                }
                                var silentAddedControllers = stackDescription.silentAddedControllers;
                                if(silentAddedControllers != null) {
                                    for(var i in silentAddedControllers) {
                                        var silentAddedController = silentAddedControllers[i];
                                        this._add(silentAddedController, false, false, false);
                                    }
                                }
                                var animationFactoryName;
                                if(pushed) {
                                    animationFactoryName = "pushAnimationFactory";
                                } else {
                                    animationFactoryName = "popAnimationFactory";
                                }
                                var hiddenController = stackDescription.removedController;
                                var hiddenView;
                                if(hiddenController != null) {
                                    var maxState;
                                    if(this.getState() >= mvc.ControllerStateInitialized) {
                                        maxState = mvc.ControllerStateInitialized;
                                        hiddenView = hiddenController.getView();
                                    } else {
                                        maxState = null;
                                        hiddenView = null;
                                    }
                                    this._remove(hiddenController, hiddenView == null);
                                }
                                var addedController = stackDescription.addedController;
                                if(addedController != null) {
                                    this._add(addedController, true, true, !pushed);
                                    var pushedView = addedController.getView();
                                }
                                var animated;
                                if(addedController != null || hiddenController != null) {
                                    var animationListener;
                                    if(hiddenView != null) {
                                        animationListener = function (source, event) {
                                            if(event.animationState == templa.animation.animationStateFinished) {
                                                hiddenView.detach();
                                            }
                                        };
                                    } else {
                                        animationListener = null;
                                    }
                                    animated = this._animate(animationFactoryName, animationListener);
                                } else {
                                    animated = false;
                                }
                                if(!animated && hiddenView != null) {
                                    hiddenView.detach();
                                }
                                this.layout();
                                this._fireControllerChangeEvent(new mvc.ControllerChangeEvent(true, true));
                            } else {
                                _super.prototype._handleModelChangeEvent.call(this, event);
                            }
                            this._fireControllerChangeEvent(new mvc.ControllerChangeEvent(true, true));
                        };
                        StackJQueryController.prototype._back = function () {
                            var stackControllerModel = this._model;
                            stackControllerModel.requestPop();
                        };
                        StackJQueryController.prototype.getCommands = function () {
                            var commands = _super.prototype.getCommands.call(this);
                            var stackControllerModel = this._model;
                            if(stackControllerModel != null && stackControllerModel.canPop()) {
                                if(commands == null) {
                                    commands = [];
                                }
                                commands.push(this._backCommand);
                            }
                            return commands;
                        };
                        StackJQueryController.prototype._animate = function (animationFactoryName, animationCompletionListener) {
                            var result = false;
                            var count = 0;
                            var completionCount = 0;
                            var roots = this._view.getRoots();
                            for(var i in this._animationFactoryBundles) {
                                var animationFactoryBundle = this._animationFactoryBundles[i];
                                var animationFactory = animationFactoryBundle[animationFactoryName];
                                if(animationFactory != null) {
                                    var selector = animationFactoryBundle.selector;
                                    var jquery = $(roots);
                                    if(selector != null) {
                                        var self = $(roots).filter(selector);
                                        jquery = jquery.find(selector).add(self);
                                    }
                                    var containerElement = this._view.getRoots()[0];
                                    for(var j = 0; j < jquery.length; j++) {
                                        var toAnimate = jquery.get(j);
                                        var animation = animationFactory.create(containerElement, toAnimate);
                                        count++;
                                        result = true;
                                        if(animationCompletionListener != null) {
                                            animation.addAnimationListener(function (source, event) {
                                                if(event.animationState == templa.animation.animationStateFinished) {
                                                    completionCount++;
                                                    if(completionCount == count) {
                                                        animationCompletionListener(source, event);
                                                    }
                                                }
                                            });
                                        }
                                        this._addAnimation(animation, false);
                                    }
                                }
                            }
                            if(count == 0 && animationCompletionListener != null) {
                                animationCompletionListener(null, new templa.animation.AnimationStateChangeEvent(templa.animation.animationStateFinished));
                            }
                            return result;
                        };
                        return StackJQueryController;
                    })(composite.AbstractCompositeJQueryController);
                    composite.StackJQueryController = StackJQueryController;                    
                })(jquery.composite || (jquery.composite = {}));
                var composite = jquery.composite;
            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (composite) {
            var AbstractStackControllerModelPushChange = (function () {
                function AbstractStackControllerModelPushChange(_model, _entry) {
                    this._model = _model;
                    this._entry = _entry;
                }
                AbstractStackControllerModelPushChange.prototype.undo = function () {
                    if(this._model.canPop()) {
                        this._model._deStack(this._entry.controller, false, true);
                    }
                };
                AbstractStackControllerModelPushChange.prototype.redo = function () {
                    if(!this._model._contains(this._entry.controller)) {
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
                    if(!this._model._contains(this._entry.controller)) {
                        this._model._pushEntry(this._entry, false, true);
                    }
                };
                AbstractStackControllerModelPopChange.prototype.redo = function () {
                    if(this._model.canPop()) {
                        this._model._deStack(this._entry.controller, false, true);
                    }
                };
                return AbstractStackControllerModelPopChange;
            })();
            composite.AbstractStackControllerModelPopChange = AbstractStackControllerModelPopChange;            
            var AbstractStackControllerModel = (function (_super) {
                __extends(AbstractStackControllerModel, _super);
                function AbstractStackControllerModel(_allowEmptyStack, _controllersToDisplay) {
                                _super.call(this);
                    this._allowEmptyStack = _allowEmptyStack;
                    this._controllersToDisplay = _controllersToDisplay;
                    this._stack = [];
                    if(this._controllersToDisplay == null) {
                        this._controllersToDisplay = 1;
                    }
                }
                AbstractStackControllerModel.prototype._setControllersToDisplay = function (_controllersToDisplay) {
                    if(this._controllersToDisplay != _controllersToDisplay) {
                        this._controllersToDisplay = _controllersToDisplay;
                        this._fireModelChangeEvent();
                    }
                };
                AbstractStackControllerModel.prototype.getControllers = function () {
                    var result = [];
                    var remainingControllers = this._controllersToDisplay;
                    var index = Math.max(0, this._stack.length - this._controllersToDisplay);
                    while(remainingControllers > 0 && index < this._stack.length) {
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
                    if(this.canPop()) {
                        this._pop();
                    }
                };
                AbstractStackControllerModel.prototype._ensureVisible = function (controller, suppressFireDescriptionChangeEvent) {
                    var result;
                    var index = this._indexOf(controller);
                    if(index != null) {
                        result = true;
                        while(index < this._stack.length - this._controllersToDisplay) {
                            this._pop(false, suppressFireDescriptionChangeEvent);
                        }
                    } else {
                        result = false;
                    }
                    return result;
                };
                AbstractStackControllerModel.prototype._deStack = function (controller, suppressFireModelChangeEvent, suppressFireDescriptionChangeEvent) {
                    if(this.peek == controller) {
                        this._pop(suppressFireModelChangeEvent, suppressFireDescriptionChangeEvent);
                    } else {
                        for(var i in this._stack) {
                            var entry = this._stack[i];
                            if(entry.controller == controller) {
                                this._stack.splice(i, 1);
                                break;
                            }
                        }
                    }
                };
                AbstractStackControllerModel.prototype._pop = function (suppressFireModelChangeEvent, suppressFireDescriptionChangeEvent) {
                    var result;
                    if(this._stack.length > 0) {
                        var previousEntry = this._stack[this._stack.length - 1];
                        var entries = this._stack.splice(this._stack.length - 1, 1);
                        if(suppressFireModelChangeEvent != true) {
                            var changeDescription = new composite.StackControllerModelChangeDescription(composite.stackControllerModelEventPopped, previousEntry.controller, this.peek);
                            this._fireModelChangeEvent(changeDescription, true);
                        }
                        if(suppressFireDescriptionChangeEvent != true) {
                            this._fireStateDescriptionChangeEvent(this, new AbstractStackControllerModelPopChange(this, entries[0]));
                        }
                        result = previousEntry;
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
                    for(var i in this._stack) {
                        var c = this._stack[i].controller;
                        if(c == controller) {
                            result = i;
                            break;
                        }
                    }
                    return result;
                };
                AbstractStackControllerModel.prototype._pushEntryGetChange = function (entry, suppressFireModelChangeEvent) {
                    var previousController = this.peek;
                    this._stack.push(entry);
                    if(suppressFireModelChangeEvent != true) {
                        var description = new composite.StackControllerModelChangeDescription(composite.stackControllerModelEventPushed, previousController, entry.controller);
                        this._fireModelChangeEvent(description, true);
                    }
                    return new AbstractStackControllerModelPushChange(this, entry);
                };
                AbstractStackControllerModel.prototype._pushEntry = function (entry, suppressFireModelChangeEvent, suppressFireDescriptionChangeEvent) {
                    var change = this._pushEntryGetChange(entry, suppressFireModelChangeEvent);
                    if(suppressFireDescriptionChangeEvent != true) {
                        this._fireStateDescriptionChangeEvent(this, change);
                    }
                };
                Object.defineProperty(AbstractStackControllerModel.prototype, "peek", {
                    get: function () {
                        var result;
                        if(this._stack.length > 0) {
                            result = this._stack[this._stack.length - 1].controller;
                        } else {
                            result = null;
                        }
                        return result;
                    },
                    enumerable: true,
                    configurable: true
                });
                AbstractStackControllerModel.prototype.createStateDescription = function (models) {
                    models = this._checkModels(models);
                    var result = [];
                    for(var i in this._stack) {
                        var entry = this._stack[i];
                        var description = this._entryToDescription(entry, models);
                        result.push(description);
                    }
                    return result;
                };
                AbstractStackControllerModel.prototype.loadStateDescription = function (description) {
                    var descriptions = description;
                    while(!this.isStackEmpty()) {
                        this._pop(true);
                    }
                    for(var i in descriptions) {
                        var controllerDescription = descriptions[i];
                        var entry = this._createEntryFromDescription(controllerDescription);
                        if(entry != null) {
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
            })(composite.AbstractCompositeControllerModel);
            composite.AbstractStackControllerModel = AbstractStackControllerModel;            
        })(mvc.composite || (mvc.composite = {}));
        var composite = mvc.composite;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (samples) {
        (function (mvc) {
            (function (controller) {
                            })(mvc.controller || (mvc.controller = {}));
            var controller = mvc.controller;
        })(samples.mvc || (samples.mvc = {}));
        var mvc = samples.mvc;
    })(templa.samples || (templa.samples = {}));
    var samples = templa.samples;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (samples) {
        (function (mvc) {
            (function (controller) {
                (function (text_input) {
                    var TextInputController = (function (_super) {
                        __extends(TextInputController, _super);
                        function TextInputController(_viewFactory, _inputElementSelector, _buttonElementSelector) {
                                                _super.call(this, _viewFactory);
                            this._inputElementSelector = _inputElementSelector;
                            this._buttonElementSelector = _buttonElementSelector;
                        }
                        TextInputController.prototype._doStart = function () {
                            var _this = this;
                            this.$(this._buttonElementSelector).click(function () {
                                _this._requestSubmit();
                            });
                            this.$(this._inputElementSelector).keypress(function (e) {
                                if(e.which == 13) {
                                    _this._requestSubmit();
                                    e.preventDefault();
                                }
                            });
                            return true;
                        };
                        TextInputController.prototype._requestSubmit = function () {
                            var value = this.getValue();
                            var textInputModel = this._model;
                            textInputModel.requestSubmit(value);
                        };
                        TextInputController.prototype.getValue = function () {
                            return this.$(this._inputElementSelector).val();
                        };
                        TextInputController.prototype._doLoad = function (model) {
                            var inputModel = model;
                            var value = inputModel.getValue();
                            this.$(this._inputElementSelector).val(value);
                        };
                        return TextInputController;
                    })(templa.mvc.element.jquery.AbstractJQueryController);
                    text_input.TextInputController = TextInputController;                    
                })(controller.text_input || (controller.text_input = {}));
                var text_input = controller.text_input;
            })(mvc.controller || (mvc.controller = {}));
            var controller = mvc.controller;
        })(samples.mvc || (samples.mvc = {}));
        var mvc = samples.mvc;
    })(templa.samples || (templa.samples = {}));
    var samples = templa.samples;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (samples) {
        (function (mvc) {
            (function (controller) {
                            })(mvc.controller || (mvc.controller = {}));
            var controller = mvc.controller;
        })(samples.mvc || (samples.mvc = {}));
        var mvc = samples.mvc;
    })(templa.samples || (templa.samples = {}));
    var samples = templa.samples;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (samples) {
        (function (mvc) {
            (function (controller) {
                (function (label) {
                    var LabelController = (function (_super) {
                        __extends(LabelController, _super);
                        function LabelController(_viewFactory, _labelElementSelector) {
                                                _super.call(this, _viewFactory);
                            this._labelElementSelector = _labelElementSelector;
                        }
                        LabelController.prototype._doLoad = function (model) {
                            var labelModel = model;
                            var label = labelModel.getLabel();
                            this.$(this._labelElementSelector).text(label);
                        };
                        LabelController.prototype.getTitle = function () {
                            var labelModel = this.getModel();
                            return labelModel.getLabel();
                        };
                        LabelController.prototype._handleModelChangeEvent = function (event) {
                            _super.prototype._handleModelChangeEvent.call(this, event);
                            this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(false, true));
                        };
                        return LabelController;
                    })(templa.mvc.element.jquery.AbstractJQueryController);
                    label.LabelController = LabelController;                    
                })(controller.label || (controller.label = {}));
                var label = controller.label;
            })(mvc.controller || (mvc.controller = {}));
            var controller = mvc.controller;
        })(samples.mvc || (samples.mvc = {}));
        var mvc = samples.mvc;
    })(templa.samples || (templa.samples = {}));
    var samples = templa.samples;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (samples) {
        (function (mvc) {
            (function (controller) {
                (function (label) {
                    var ImmutableLabelModel = (function (_super) {
                        __extends(ImmutableLabelModel, _super);
                        function ImmutableLabelModel(_label) {
                                                _super.call(this);
                            this._label = _label;
                        }
                        ImmutableLabelModel.prototype.getLabel = function () {
                            return this._label;
                        };
                        return ImmutableLabelModel;
                    })(templa.mvc.AbstractModel);
                    label.ImmutableLabelModel = ImmutableLabelModel;                    
                })(controller.label || (controller.label = {}));
                var label = controller.label;
            })(mvc.controller || (mvc.controller = {}));
            var controller = mvc.controller;
        })(samples.mvc || (samples.mvc = {}));
        var mvc = samples.mvc;
    })(templa.samples || (templa.samples = {}));
    var samples = templa.samples;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (samples) {
        (function (mvc) {
            (function (basic_stack) {
                var BasicStackModel = (function (_super) {
                    __extends(BasicStackModel, _super);
                    function BasicStackModel() {
                                        _super.call(this);
                        this.labelViewKey = "label";
                        this.labelViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory("<span key='" + this.labelViewKey + "'></span>");
                    }
                    BasicStackModel.prototype.getValue = function () {
                        return "";
                    };
                    BasicStackModel.prototype.requestSubmit = function (value) {
                        var labelController = this._createController(value);
                        this._push(labelController);
                    };
                    BasicStackModel.prototype._createController = function (value) {
                        var labelController = new templa.samples.mvc.controller.label.LabelController(this.labelViewFactory, "[key='" + this.labelViewKey + "']");
                        labelController.setModel(new templa.samples.mvc.controller.label.ImmutableLabelModel(value));
                        return labelController;
                    };
                    BasicStackModel.prototype._entryToDescription = function (entry) {
                        var model = entry.controller.getModel();
                        return model.getLabel();
                    };
                    BasicStackModel.prototype._createEntryFromDescription = function (description) {
                        var controller = this._createController(description);
                        return {
                            controller: controller
                        };
                    };
                    return BasicStackModel;
                })(templa.mvc.composite.AbstractStackControllerModel);
                basic_stack.BasicStackModel = BasicStackModel;                
            })(mvc.basic_stack || (mvc.basic_stack = {}));
            var basic_stack = mvc.basic_stack;
        })(samples.mvc || (samples.mvc = {}));
        var mvc = samples.mvc;
    })(templa.samples || (templa.samples = {}));
    var samples = templa.samples;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (samples) {
        (function (mvc) {
            (function (basic_stack) {
                var BasicStackControllerFactory = (function () {
                    function BasicStackControllerFactory() {
                        this._model = new basic_stack.BasicStackModel();
                    }
                    BasicStackControllerFactory.prototype.createStackController = function () {
                        var stackViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory("<div key='stack'></div>");
                        var stackController = new templa.mvc.element.jquery.composite.StackJQueryController(stackViewFactory, []);
                        stackController.setModel(this._model);
                        return stackController;
                    };
                    BasicStackControllerFactory.prototype.createInputController = function () {
                        var inputElementKey = "input_element";
                        var inputButtonKey = "input_button";
                        var inputViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory("<input key='" + inputElementKey + "'></input><br/><input type='button' key='" + inputButtonKey + "' value='Submit'></input>");
                        var inputController = new templa.samples.mvc.controller.text_input.TextInputController(inputViewFactory, "[key='" + inputElementKey + "']", "[key='" + inputButtonKey + "']");
                        inputController.setModel(this._model);
                        return inputController;
                    };
                    BasicStackControllerFactory.prototype.create = function () {
                        var idInput = "basic_input";
                        var idStack = "basic_stack";
                        var controllers = {
                        };
                        controllers["." + idInput] = this.createInputController();
                        controllers["." + idStack] = this.createStackController();
                        var model = new templa.mvc.composite.MappedKeyedControllerModel(controllers);
                        var viewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory("<div class = '" + idInput + "' > </div><div class = '" + idStack + "' > </div>");
                        var controller = new templa.mvc.element.jquery.composite.KeyedJQueryController(viewFactory);
                        controller.setModel(model);
                        return controller;
                    };
                    return BasicStackControllerFactory;
                })();
                basic_stack.BasicStackControllerFactory = BasicStackControllerFactory;                
            })(mvc.basic_stack || (mvc.basic_stack = {}));
            var basic_stack = mvc.basic_stack;
        })(samples.mvc || (samples.mvc = {}));
        var mvc = samples.mvc;
    })(templa.samples || (templa.samples = {}));
    var samples = templa.samples;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
            })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (command) {
            var CommandControllerModelAdapter = (function (_super) {
                __extends(CommandControllerModelAdapter, _super);
                function CommandControllerModelAdapter(_controller) {
                    var _this = this;
                                _super.call(this);
                    this._controller = _controller;
                    this._listener = function (source, changeEvent) {
                        if(changeEvent.commandsChanged) {
                            _this._fireModelChangeEvent(new mvc.ModelChangeEvent("commands"));
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
            })(mvc.AbstractModel);
            command.CommandControllerModelAdapter = CommandControllerModelAdapter;            
        })(mvc.command || (mvc.command = {}));
        var command = mvc.command;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                (function (command) {
                    var CommandJQueryViewDescription = (function () {
                        function CommandJQueryViewDescription(_view, _actionElementSelector) {
                            this._view = _view;
                            this._actionElementSelector = _actionElementSelector;
                        }
                        Object.defineProperty(CommandJQueryViewDescription.prototype, "view", {
                            get: function () {
                                return this._view;
                            },
                            enumerable: true,
                            configurable: true
                        });
                        Object.defineProperty(CommandJQueryViewDescription.prototype, "actionElementSelector", {
                            get: function () {
                                return this._actionElementSelector;
                            },
                            enumerable: true,
                            configurable: true
                        });
                        return CommandJQueryViewDescription;
                    })();
                    command.CommandJQueryViewDescription = CommandJQueryViewDescription;                    
                })(jquery.command || (jquery.command = {}));
                var command = jquery.command;
            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                (function (command) {
                    var ToolbarCommandJQueryController = (function (_super) {
                        __extends(ToolbarCommandJQueryController, _super);
                        function ToolbarCommandJQueryController(_viewFactory, _commandViewDescriptionFactory, _backContainerSelector, _generalContainerSelector) {
                                                _super.call(this, _viewFactory);
                            this._commandViewDescriptionFactory = _commandViewDescriptionFactory;
                            this._backContainerSelector = _backContainerSelector;
                            this._generalContainerSelector = _generalContainerSelector;
                            this._backViews = [];
                            this._generalViews = [];
                        }
                        ToolbarCommandJQueryController.prototype._doDestroy = function (detachView) {
                            if(detachView == false) {
                                this._backViews = [];
                                this._generalViews = [];
                            } else {
                                this._clear();
                            }
                            var result = _super.prototype._doDestroy.call(this, detachView);
                            return result;
                        };
                        ToolbarCommandJQueryController.prototype._detachViews = function () {
                            for(var i in this._backViews) {
                                var backView = this._backViews[i];
                                backView.detach();
                            }
                            for(var i in this._generalViews) {
                                var generalView = this._generalViews[i];
                                generalView.detach();
                            }
                        };
                        ToolbarCommandJQueryController.prototype._clear = function () {
                            this._detachViews();
                            this._backViews = [];
                            this._generalViews = [];
                        };
                        ToolbarCommandJQueryController.prototype._doLoad = function (model) {
                            var commandControllerModel = model;
                            var commands = commandControllerModel.getCommands();
                            this._clear();
                            for(var i in commands) {
                                var command = commands[i];
                                var container;
                                var selector;
                                var views;
                                if(command.commandType == mvc.CommandTypeBack) {
                                    selector = this._backContainerSelector;
                                    views = this._backViews;
                                } else {
                                    selector = this._generalContainerSelector;
                                    views = this._generalViews;
                                }
                                container = this.$reference(selector);
                                if(container == null) {
                                    throw "no container for selector " + selector;
                                }
                                var actionElementView = this._commandViewDescriptionFactory.create(container, command);
                                var actionElementSelector = actionElementView.actionElementSelector;
                                var view = actionElementView.view;
                                view.attach();
                                var actionElements = this.$(actionElementSelector, view.getRoots());
                                actionElements.click(function () {
                                    command.action();
                                });
                                views.push(view);
                            }
                        };
                        return ToolbarCommandJQueryController;
                    })(jquery.AbstractJQueryController);
                    command.ToolbarCommandJQueryController = ToolbarCommandJQueryController;                    
                })(jquery.command || (jquery.command = {}));
                var command = jquery.command;
            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    })(templa || (templa = {}));
var templa;
(function (templa) {
    })(templa || (templa = {}));
var templa;
(function (templa) {
    (function (loading) {
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
            };
            AbstractLoadable.prototype._pushError = function (error) {
                this._errors.push(error);
                this._fireLoadingEvent(error);
            };
            AbstractLoadable.prototype._setLoadingProgress = function (loadingProgress, message, maximumProgress) {
                this._loadingProgress = loadingProgress;
                if(maximumProgress != null) {
                    this._maximumProgress = maximumProgress;
                }
                this._fireLoadingEvent(message);
            };
            AbstractLoadable.prototype._fireLoadingEvent = function (message) {
                if(this._callback != null) {
                    this._callback(this, message);
                }
            };
            return AbstractLoadable;
        })();
        loading.AbstractLoadable = AbstractLoadable;        
    })(templa.loading || (templa.loading = {}));
    var loading = templa.loading;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (template) {
        var StringHandlebarsTemplateSource = (function (_super) {
            __extends(StringHandlebarsTemplateSource, _super);
            function StringHandlebarsTemplateSource(_inputTemplate) {
                        _super.call(this, 1, true);
                this._inputTemplate = _inputTemplate;
            }
            StringHandlebarsTemplateSource.prototype.resolve = function () {
                if(this._template == null) {
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
    (function (template) {
        var ExternalHandlebarsTemplateSource = (function (_super) {
            __extends(ExternalHandlebarsTemplateSource, _super);
            function ExternalHandlebarsTemplateSource(_url) {
                        _super.call(this, 2, false);
                this._url = _url;
            }
            ExternalHandlebarsTemplateSource.prototype.resolve = function () {
                if(this._template == null) {
                    var raw = $.ajax(this._url, {
                        async: false
                    }).responseText;
                    this._template = Handlebars.compile(raw);
                    this._setLoadingProgress(2, this._url);
                }
                return this._template;
            };
            ExternalHandlebarsTemplateSource.prototype._doStartLoading = function () {
                var _this = this;
                var jqxhr = $.get(this._url, null, function (raw) {
                    _this._setLoadingProgress(1, _this._url);
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
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            var TemplateElementViewFactory = (function (_super) {
                __extends(TemplateElementViewFactory, _super);
                function TemplateElementViewFactory(_templateSource, _options) {
                                _super.call(this, null);
                    this._templateSource = _templateSource;
                    this._options = _options;
                }
                TemplateElementViewFactory.createFromString = function createFromString(templateString, loadables, options) {
                    var templateSource = new templa.template.StringHandlebarsTemplateSource(templateString);
                    if(loadables != null) {
                        loadables.push(templateSource);
                    }
                    return new TemplateElementViewFactory(templateSource, options);
                };
                TemplateElementViewFactory.createFromURL = function createFromURL(templateURL, loadables, options) {
                    var templateSource = new templa.template.ExternalHandlebarsTemplateSource(templateURL);
                    if(loadables != null) {
                        loadables.push(templateSource);
                    }
                    return new TemplateElementViewFactory(templateSource, options);
                };
                TemplateElementViewFactory.prototype.create = function (container, prepend) {
                    var options = {
                    };
                    if(this._options != null) {
                        for(var key in this._options) {
                            var value = this._options[key];
                            options[key] = value;
                        }
                    }
                    var template = this._templateSource.resolve();
                    var html = template(options);
                    return this._createDiv(container, prepend, html);
                };
                return TemplateElementViewFactory;
            })(element.DocumentFragmentElementViewFactory);
            element.TemplateElementViewFactory = TemplateElementViewFactory;            
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (animation) {
        var AbstractAnimation = (function () {
            function AbstractAnimation() {
                this._state = animation.animationStateCreated;
                this._animationChangeListeners = [];
            }
            AbstractAnimation.prototype.getState = function () {
                return this._state;
            };
            AbstractAnimation.prototype.init = function () {
                if(this._doInit()) {
                    this._state = animation.animationStateInitialized;
                    this._fireAnimationStateChangeEvent(new animation.AnimationStateChangeEvent(this._state));
                }
            };
            AbstractAnimation.prototype._doInit = function () {
                return true;
            };
            AbstractAnimation.prototype.start = function () {
                if(this._doStart()) {
                    this._state = animation.animationStateStarted;
                    this._fireAnimationStateChangeEvent(new animation.AnimationStateChangeEvent(this._state));
                }
            };
            AbstractAnimation.prototype._doStart = function () {
                return true;
            };
            AbstractAnimation.prototype.destroy = function () {
                if(this._doDestroy()) {
                    this._state = animation.animationStateFinished;
                    this._fireAnimationStateChangeEvent(new animation.AnimationStateChangeEvent(this._state));
                }
            };
            AbstractAnimation.prototype._doDestroy = function () {
                return true;
            };
            AbstractAnimation.prototype._fireAnimationStateChangeEvent = function (changeEvent) {
                for(var i in this._animationChangeListeners) {
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
var templa;
(function (templa) {
    (function (animation) {
        (function (element) {
            element.cssAnimationEndEventNames = [
                "animationend", 
                "webkitAnimationEnd", 
                "oanimationend", 
                "MSAnimationEnd"
            ];
            var CSSElementClassAnimation = (function (_super) {
                __extends(CSSElementClassAnimation, _super);
                function CSSElementClassAnimation(_view, _class, _maxTimeMillis, _lifecycleFunction) {
                    var _this = this;
                                _super.call(this);
                    this._view = _view;
                    this._class = _class;
                    this._maxTimeMillis = _maxTimeMillis;
                    this._lifecycleFunction = _lifecycleFunction;
                    this._animationListener = function (e) {
                        _this.destroy();
                    };
                }
                CSSElementClassAnimation.prototype._doInit = function () {
                    for(var i in element.cssAnimationEndEventNames) {
                        var cssAnimationEndEventName = element.cssAnimationEndEventNames[i];
                        this._view.addEventListener(cssAnimationEndEventName, this._animationListener, false);
                    }
                    if(this._lifecycleFunction != null) {
                        this._lifecycleFunction(templa.animation.animationStateInitialized, this._view);
                    }
                    return true;
                };
                CSSElementClassAnimation.prototype._doStart = function () {
                    var clazz = this._view.getAttribute("class");
                    if(clazz == null || clazz.length == 0) {
                        clazz = this._class;
                    } else {
                        clazz += " " + this._class;
                    }
                    this._view.setAttribute("class", clazz);
                    if(this._maxTimeMillis != null) {
                        setTimeout(this._animationListener, this._maxTimeMillis);
                    }
                    if(this._lifecycleFunction != null) {
                        this._lifecycleFunction(templa.animation.animationStateStarted, this._view);
                    }
                    return true;
                };
                CSSElementClassAnimation.prototype._doDestroy = function () {
                    var _this = this;
                    for(var i in element.cssAnimationEndEventNames) {
                        var cssAnimationEndEventName = element.cssAnimationEndEventNames[i];
                        this._view.removeEventListener(cssAnimationEndEventName, this._animationListener, false);
                    }
                    var clazz = this._view.getAttribute("class");
                    var result;
                    if(clazz != null) {
                        var index = clazz.indexOf(this._class);
                        if(index >= 0) {
                            clazz = clazz.substring(0, index) + clazz.substring(index + this._class.length);
                            this._view.setAttribute("class", clazz);
                            result = true;
                            if(this._lifecycleFunction != null) {
                                var delay;
                                if(this._maxTimeMillis != null) {
                                    delay = this._maxTimeMillis / 2;
                                } else {
                                    delay = 100;
                                }
                                window.setTimeout(function () {
                                    _this._lifecycleFunction(templa.animation.animationStateFinished, _this._view);
                                }, delay);
                            }
                        } else {
                            result = false;
                        }
                    } else {
                        result = false;
                    }
                    return result;
                };
                return CSSElementClassAnimation;
            })(animation.AbstractAnimation);
            element.CSSElementClassAnimation = CSSElementClassAnimation;            
        })(animation.element || (animation.element = {}));
        var element = animation.element;
    })(templa.animation || (templa.animation = {}));
    var animation = templa.animation;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (animation) {
        (function (element) {
            var CSSElementClassAnimationFactory = (function () {
                function CSSElementClassAnimationFactory(_class, _maxTimeMillis, _lifecycleFunction) {
                    this._class = _class;
                    this._maxTimeMillis = _maxTimeMillis;
                    this._lifecycleFunction = _lifecycleFunction;
                }
                CSSElementClassAnimationFactory.prototype.create = function (container, view) {
                    return new element.CSSElementClassAnimation(view, this._class, this._maxTimeMillis, this._lifecycleFunction);
                };
                return CSSElementClassAnimationFactory;
            })();
            element.CSSElementClassAnimationFactory = CSSElementClassAnimationFactory;            
        })(animation.element || (animation.element = {}));
        var element = animation.element;
    })(templa.animation || (templa.animation = {}));
    var animation = templa.animation;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (samples) {
        (function (mvc) {
            (function (controller) {
                var ToolbarDecoratorModel = (function (_super) {
                    __extends(ToolbarDecoratorModel, _super);
                    function ToolbarDecoratorModel(_toolbarController, _toolbarControllerKey, _otherControllers, _otherControllerKey) {
                                        _super.call(this);
                        this._toolbarController = _toolbarController;
                        this._toolbarControllerKey = _toolbarControllerKey;
                        this._otherControllers = _otherControllers;
                        this._otherControllerKey = _otherControllerKey;
                    }
                    ToolbarDecoratorModel.prototype.getControllerKey = function (controller) {
                        var result;
                        if(controller == this._toolbarController) {
                            result = this._toolbarControllerKey;
                        } else {
                            result = this._otherControllerKey;
                        }
                        return result;
                    };
                    ToolbarDecoratorModel.prototype._getDescribedControllers = function () {
                        return this._otherControllers;
                    };
                    ToolbarDecoratorModel.prototype.getControllers = function () {
                        var result = [
                            this._toolbarController
                        ];
                        templa.util.Arrays.pushAll(result, this._otherControllers);
                        return result;
                    };
                    return ToolbarDecoratorModel;
                })(templa.mvc.composite.AbstractCompositeControllerModel);
                controller.ToolbarDecoratorModel = ToolbarDecoratorModel;                
            })(mvc.controller || (mvc.controller = {}));
            var controller = mvc.controller;
        })(samples.mvc || (samples.mvc = {}));
        var mvc = samples.mvc;
    })(templa.samples || (templa.samples = {}));
    var samples = templa.samples;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                var DimensionSettingElementViewProxy = (function () {
                    function DimensionSettingElementViewProxy(_proxied, _variableDimensionSelector, _fixedWidthSelectors, _fixedHeightSelectors, _widthAttribute, _heightAttribute, _maxHeightSelectors) {
                        this._proxied = _proxied;
                        this._variableDimensionSelector = _variableDimensionSelector;
                        this._fixedWidthSelectors = _fixedWidthSelectors;
                        this._fixedHeightSelectors = _fixedHeightSelectors;
                        this._widthAttribute = _widthAttribute;
                        this._heightAttribute = _heightAttribute;
                        this._maxHeightSelectors = _maxHeightSelectors;
                        if(this._widthAttribute == null) {
                            this._widthAttribute = "width";
                        }
                        if(this._heightAttribute == null) {
                            this._heightAttribute = "height";
                        }
                    }
                    DimensionSettingElementViewProxy.prototype.getRoots = function () {
                        return this._proxied.getRoots();
                    };
                    DimensionSettingElementViewProxy.prototype.attach = function () {
                        this._proxied.attach();
                        this.layout();
                    };
                    DimensionSettingElementViewProxy.prototype.detach = function () {
                        this._proxied.detach();
                    };
                    DimensionSettingElementViewProxy.prototype.layout = function () {
                        var result = this._proxied.layout();
                        var variableDimensionElement = $(this.getRoots());
                        if(this._variableDimensionSelector != null) {
                            variableDimensionElement = variableDimensionElement.find(this._variableDimensionSelector);
                        }
                        if(this._fixedHeightSelectors != null) {
                            var fixedHeight = 0;
                            for(var i in this._fixedHeightSelectors) {
                                var fixedHeightSelector = this._fixedHeightSelectors[i];
                                var fixedHeightElement = $(fixedHeightSelector);
                                fixedHeight += fixedHeightElement.outerHeight(true);
                            }
                            var windowHeight = window.innerHeight;
                            var height = windowHeight - fixedHeight;
                            if(this._maxHeightSelectors != null) {
                                var maxHeight = height;
                                for(var i in this._maxHeightSelectors) {
                                    var maxHeightSelector = this._maxHeightSelectors[i];
                                    var allVariableDimensionElements = $(maxHeightSelector);
                                    var newHeight = Math.max.apply(null, allVariableDimensionElements.map(function () {
                                        return $(this).height();
                                    }).get());
                                    if(newHeight > maxHeight) {
                                        maxHeight = newHeight;
                                    }
                                }
                                if(height < maxHeight) {
                                    height = maxHeight;
                                }
                            }
                            variableDimensionElement.css(this._heightAttribute, height + "px");
                        }
                        if(this._fixedWidthSelectors != null) {
                            var fixedWidth = 0;
                            for(var i in this._fixedWidthSelectors) {
                                var fixedWidthSelector = this._fixedWidthSelectors[i];
                                var fixedWidthElement = $(fixedWidthSelector);
                                fixedWidth += fixedWidthElement.outerHeight();
                            }
                            var windowWidth = window.innerWidth;
                            var width = windowWidth - fixedWidth;
                            variableDimensionElement.css(this._widthAttribute, width + "px");
                        }
                        return result;
                    };
                    return DimensionSettingElementViewProxy;
                })();
                jquery.DimensionSettingElementViewProxy = DimensionSettingElementViewProxy;                
            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                var DimensionSettingElementViewProxyFactory = (function () {
                    function DimensionSettingElementViewProxyFactory(_proxied, _variableDimensionSelector, _fixedWidthSelectors, _fixedHeightSelectors, _widthAttribute, _heightAttribute, _maxHeightSelectors) {
                        this._proxied = _proxied;
                        this._variableDimensionSelector = _variableDimensionSelector;
                        this._fixedWidthSelectors = _fixedWidthSelectors;
                        this._fixedHeightSelectors = _fixedHeightSelectors;
                        this._widthAttribute = _widthAttribute;
                        this._heightAttribute = _heightAttribute;
                        this._maxHeightSelectors = _maxHeightSelectors;
                    }
                    DimensionSettingElementViewProxyFactory.prototype.create = function (container, prepend) {
                        var proxied = this._proxied.create(container, prepend);
                        return new jquery.DimensionSettingElementViewProxy(proxied, this._variableDimensionSelector, this._fixedWidthSelectors, this._fixedHeightSelectors, this._widthAttribute, this._heightAttribute, this._maxHeightSelectors);
                    };
                    return DimensionSettingElementViewProxyFactory;
                })();
                jquery.DimensionSettingElementViewProxyFactory = DimensionSettingElementViewProxyFactory;                
            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                (function (command) {
                    var templateCommandElementCount = 0;
                    var TemplateCommandJQueryViewDescriptionFactory = (function () {
                        function TemplateCommandJQueryViewDescriptionFactory(_templateSource, _options) {
                            this._templateSource = _templateSource;
                            this._options = _options;
                        }
                        TemplateCommandJQueryViewDescriptionFactory.createFromString = function createFromString(templateString, loadables, options) {
                            var templateSource = new templa.template.StringHandlebarsTemplateSource(templateString);
                            if(loadables != null) {
                                loadables.push(templateSource);
                            }
                            return new TemplateCommandJQueryViewDescriptionFactory(templateSource, options);
                        };
                        TemplateCommandJQueryViewDescriptionFactory.createFromURL = function createFromURL(templateURL, loadables, options) {
                            var templateSource = new templa.template.ExternalHandlebarsTemplateSource(templateURL);
                            if(loadables != null) {
                                loadables.push(templateSource);
                            }
                            return new TemplateCommandJQueryViewDescriptionFactory(templateSource, options);
                        };
                        TemplateCommandJQueryViewDescriptionFactory.prototype.create = function (_container, _command) {
                            var count = templateCommandElementCount;
                            templateCommandElementCount++;
                            var id = "__command_template_element_id_" + count;
                            var options = {
                                command: _command
                            };
                            if(this._options != null) {
                                for(var key in this._options) {
                                    var value = this._options[key];
                                    options[key] = value;
                                }
                            }
                            var template = this._templateSource.resolve();
                            var html = template(options);
                            var view = element.DocumentFragmentElementView.createFromHTML(html, _container, false, id);
                            return new command.CommandJQueryViewDescription(view, "[view_id='" + id + "']");
                        };
                        return TemplateCommandJQueryViewDescriptionFactory;
                    })();
                    command.TemplateCommandJQueryViewDescriptionFactory = TemplateCommandJQueryViewDescriptionFactory;                    
                })(jquery.command || (jquery.command = {}));
                var command = jquery.command;
            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (samples) {
        (function (mvc) {
            (function (decorated_stack) {
                var DecoratedStackModel = (function (_super) {
                    __extends(DecoratedStackModel, _super);
                    function DecoratedStackModel(_topLevelController, _labelViewFactory, _labelViewSelector, _inputViewFactory, _inputValueSelector, _inputButtonSelector, _toolbarDecoratorFactory) {
                                        _super.call(this, false);
                        this._topLevelController = _topLevelController;
                        this._labelViewFactory = _labelViewFactory;
                        this._labelViewSelector = _labelViewSelector;
                        this._inputViewFactory = _inputViewFactory;
                        this._inputValueSelector = _inputValueSelector;
                        this._inputButtonSelector = _inputButtonSelector;
                        this._toolbarDecoratorFactory = _toolbarDecoratorFactory;
                    }
                    DecoratedStackModel.prototype.getValue = function () {
                        return "";
                    };
                    DecoratedStackModel.prototype.requestSubmit = function (value) {
                        if(value != null && value.length > 0) {
                            var decoratorController = this._createController(value);
                            this._push(decoratorController, value);
                        }
                    };
                    DecoratedStackModel.prototype._createController = function (value) {
                        var labelController = new templa.samples.mvc.controller.label.LabelController(this._labelViewFactory, this._labelViewSelector);
                        labelController.setModel(new templa.samples.mvc.controller.label.ImmutableLabelModel(value));
                        var inputController = new templa.samples.mvc.controller.text_input.TextInputController(this._inputViewFactory, this._inputValueSelector, this._inputButtonSelector);
                        inputController.setModel(this);
                        return this._toolbarDecoratorFactory([
                            labelController, 
                            inputController
                        ]);
                    };
                    DecoratedStackModel.prototype._entryToDescription = function (entry) {
                        return entry.data;
                    };
                    DecoratedStackModel.prototype._createEntryFromDescription = function (description) {
                        var controller = this._createController(description);
                        return {
                            controller: controller,
                            data: description
                        };
                    };
                    return DecoratedStackModel;
                })(templa.mvc.composite.AbstractStackControllerModel);
                decorated_stack.DecoratedStackModel = DecoratedStackModel;                
            })(mvc.decorated_stack || (mvc.decorated_stack = {}));
            var decorated_stack = mvc.decorated_stack;
        })(samples.mvc || (samples.mvc = {}));
        var mvc = samples.mvc;
    })(templa.samples || (templa.samples = {}));
    var samples = templa.samples;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (samples) {
        (function (mvc) {
            (function (decorated_stack) {
                (function (DecoratedStackControllerFactory) {
                    function create(loadables, toolbarDecoratorFactory) {
                        var stackViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory("<div class='content_slider'></div>");
                        var relativePushAddAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-push-add", 1000);
                        var relativePushRemoveAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-push-remove", 1000);
                        var relativePopAddAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-pop-add", 1000);
                        var relativePopRemoveAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-pop-remove", 1000);
                        var absolutePushAddAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-push-add", 1000);
                        var absolutePushRemoveAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-push-remove", 1000);
                        var absolutePopAddAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-pop-add", 1000);
                        var absolutePopRemoveAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-pop-remove", 1000);
                        var stackController = new templa.mvc.element.jquery.composite.StackJQueryController(stackViewFactory, [
                            {
                                popAnimationFactory: relativePopAddAnimationFactory,
                                pushAnimationFactory: relativePushRemoveAnimationFactory,
                                selector: ".content_pane:nth-of-type(2)"
                            }, 
                            {
                                popAnimationFactory: absolutePopAddAnimationFactory,
                                pushAnimationFactory: absolutePushRemoveAnimationFactory,
                                selector: ".decorated_toolbar_container:nth-of-type(1)"
                            }, 
                            {
                                popAnimationFactory: absolutePopRemoveAnimationFactory,
                                pushAnimationFactory: absolutePushAddAnimationFactory,
                                selector: ".decorated_toolbar_container:nth-of-type(3)"
                            }
                        ]);
                        var labelViewKey = "label";
                        var labelViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL("src/samples/handlebars/decorated_stack/label.html", loadables, {
                            label_key: labelViewKey
                        });
                        var inputElementKey = "input_element";
                        var inputButtonKey = "input_button";
                        var inputViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL("src/samples/handlebars/decorated_stack/input.html", loadables, {
                            input_element: inputElementKey,
                            input_button: inputButtonKey
                        });
                        var stackModel = new decorated_stack.DecoratedStackModel(stackController, labelViewFactory, "[key='" + labelViewKey + "']", inputViewFactory, "[key='" + inputElementKey + "']", "[key='" + inputButtonKey + "']", toolbarDecoratorFactory);
                        stackModel.requestSubmit("Hello Decorated Stack!!");
                        stackController.setModel(stackModel);
                        return stackController;
                    }
                    DecoratedStackControllerFactory.create = create;
                })(decorated_stack.DecoratedStackControllerFactory || (decorated_stack.DecoratedStackControllerFactory = {}));
                var DecoratedStackControllerFactory = decorated_stack.DecoratedStackControllerFactory;
            })(mvc.decorated_stack || (mvc.decorated_stack = {}));
            var decorated_stack = mvc.decorated_stack;
        })(samples.mvc || (samples.mvc = {}));
        var mvc = samples.mvc;
    })(templa.samples || (templa.samples = {}));
    var samples = templa.samples;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (samples) {
        (function (mvc) {
            (function (hello_world) {
                var HelloWorldModel = (function (_super) {
                    __extends(HelloWorldModel, _super);
                    function HelloWorldModel(_name) {
                                        _super.call(this);
                        this._name = _name;
                    }
                    HelloWorldModel.prototype.getLabel = function () {
                        return this._name;
                    };
                    return HelloWorldModel;
                })(templa.mvc.AbstractModel);
                hello_world.HelloWorldModel = HelloWorldModel;                
            })(mvc.hello_world || (mvc.hello_world = {}));
            var hello_world = mvc.hello_world;
        })(samples.mvc || (samples.mvc = {}));
        var mvc = samples.mvc;
    })(templa.samples || (templa.samples = {}));
    var samples = templa.samples;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (samples) {
        (function (mvc) {
            (function (hello_world) {
                (function (HelloWorldControllerFactory) {
                    function create() {
                        var labelViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory("<div>Hello <span key='name_element'></span>!</div>");
                        var labelController = new templa.samples.mvc.controller.label.LabelController(labelViewFactory, "[key='name_element']");
                        var labelModel = new templa.samples.mvc.hello_world.HelloWorldModel("World");
                        labelController.setModel(labelModel);
                        return labelController;
                    }
                    HelloWorldControllerFactory.create = create;
                })(hello_world.HelloWorldControllerFactory || (hello_world.HelloWorldControllerFactory = {}));
                var HelloWorldControllerFactory = hello_world.HelloWorldControllerFactory;
            })(mvc.hello_world || (mvc.hello_world = {}));
            var hello_world = mvc.hello_world;
        })(samples.mvc || (samples.mvc = {}));
        var mvc = samples.mvc;
    })(templa.samples || (templa.samples = {}));
    var samples = templa.samples;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (samples) {
        (function (mvc) {
            (function (hello_you) {
                var HelloYouModel = (function (_super) {
                    __extends(HelloYouModel, _super);
                    function HelloYouModel(_name) {
                                        _super.call(this);
                        this._name = _name;
                    }
                    HelloYouModel.prototype.getLabel = function () {
                        return this._name;
                    };
                    HelloYouModel.prototype.getValue = function () {
                        return this._name;
                    };
                    HelloYouModel.prototype.requestSubmit = function (value) {
                        this._name = value;
                        this._fireModelChangeEvent(new templa.mvc.ModelChangeEvent());
                    };
                    HelloYouModel.prototype.createStateDescription = function (models) {
                        models = this._checkModels(models);
                        return this._name;
                    };
                    HelloYouModel.prototype.loadStateDescription = function (description) {
                        this._name = description;
                    };
                    return HelloYouModel;
                })(templa.mvc.AbstractModel);
                hello_you.HelloYouModel = HelloYouModel;                
            })(mvc.hello_you || (mvc.hello_you = {}));
            var hello_you = mvc.hello_you;
        })(samples.mvc || (samples.mvc = {}));
        var mvc = samples.mvc;
    })(templa.samples || (templa.samples = {}));
    var samples = templa.samples;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (samples) {
        (function (mvc) {
            (function (hello_you) {
                var HelloYouControllerFactory = (function () {
                    function HelloYouControllerFactory() {
                        this._model = new hello_you.HelloYouModel("You");
                    }
                    HelloYouControllerFactory.prototype.createLabelController = function () {
                        var labelViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory("<div>Hello <span key='name_element'></span>!</div>");
                        var labelController = new templa.samples.mvc.controller.label.LabelController(labelViewFactory, "[key='name_element']");
                        labelController.setModel(this._model);
                        return labelController;
                    };
                    HelloYouControllerFactory.prototype.createInputController = function () {
                        var textInputViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory("<input key='input_element'></input><br/><input type='button' key='input_button' value='Submit'></input>");
                        var textInputController = new templa.samples.mvc.controller.text_input.TextInputController(textInputViewFactory, "[key='input_element']", "[key='input_button']");
                        textInputController.setModel(this._model);
                        return textInputController;
                    };
                    HelloYouControllerFactory.prototype.create = function () {
                        var idInput = "helloyou_input";
                        var idOutput = "helloyou_output";
                        var controllers = {
                        };
                        controllers["." + idInput] = this.createInputController();
                        controllers["." + idOutput] = this.createLabelController();
                        var model = new templa.mvc.composite.MappedKeyedControllerModel(controllers);
                        var viewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory("<div class = '" + idOutput + "' > </div><div class = '" + idInput + "' > </div>");
                        var controller = new templa.mvc.element.jquery.composite.KeyedJQueryController(viewFactory);
                        controller.setModel(model);
                        return controller;
                    };
                    return HelloYouControllerFactory;
                })();
                hello_you.HelloYouControllerFactory = HelloYouControllerFactory;                
            })(mvc.hello_you || (mvc.hello_you = {}));
            var hello_you = mvc.hello_you;
        })(samples.mvc || (samples.mvc = {}));
        var mvc = samples.mvc;
    })(templa.samples || (templa.samples = {}));
    var samples = templa.samples;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (loading) {
        var CompositeLoadable = (function () {
            function CompositeLoadable(_loadables) {
                this._loadables = _loadables;
                if(this._loadables == null) {
                    this._loadables = [];
                }
                this._synchronousLoadables = [];
            }
            CompositeLoadable.prototype.getLoadingProgress = function () {
                var result = 0;
                for(var i in this._loadables) {
                    var loadable = this._loadables[i];
                    result += loadable.getLoadingProgress();
                }
                return result;
            };
            CompositeLoadable.prototype.getMaximumProgress = function () {
                var result = 0;
                for(var i in this._loadables) {
                    var loadable = this._loadables[i];
                    result += loadable.getMaximumProgress();
                }
                return result;
            };
            CompositeLoadable.prototype.getErrors = function () {
                var result = [];
                for(var i in this._loadables) {
                    var loadable = this._loadables[i];
                    var errors = loadable.getErrors();
                    templa.util.Arrays.pushAll(result, errors);
                }
                return result;
            };
            CompositeLoadable.prototype.isComplete = function () {
                var result = true;
                for(var i in this._loadables) {
                    var loadable = this._loadables[i];
                    var complete = loadable.isComplete();
                    if(!complete) {
                        result = false;
                        break;
                    }
                }
                return result;
            };
            CompositeLoadable.prototype.update = function () {
                var result;
                if(this._synchronousLoadables.length > 0) {
                    var synchronousLoader = this._synchronousLoadables[0];
                    var synchronousLoaderResult = synchronousLoader.update();
                    if(!synchronousLoaderResult) {
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
                if(callback != null) {
                    internalCallback = function (loadable, message) {
                        callback(_this, message);
                    };
                } else {
                    internalCallback = null;
                }
                for(var i in this._loadables) {
                    var loadable = this._loadables[i];
                    var loadableResult = loadable.requestStartLoading(internalCallback);
                    if(loadableResult) {
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
    (function (mvc) {
        (function (tab) {
            tab.tabBarModelEventSelectedTabChange = "selectedTabId";
            tab.tabBarModelEventAvailableTabChange = "availableTabIds";
        })(mvc.tab || (mvc.tab = {}));
        var tab = mvc.tab;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (composite) {
            var MappedTabControllerModel = (function (_super) {
                __extends(MappedTabControllerModel, _super);
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
                    var result = [];
                    for(var tabId in this._tabIdsToControllers) {
                        result.push(tabId);
                    }
                    return result;
                };
                MappedTabControllerModel.prototype.requestSelectTabId = function (tabId) {
                    this._setSelectedTabId(tabId);
                };
                MappedTabControllerModel.prototype._setSelectedTabId = function (tabId, suppressModelChangeEvent) {
                    if(this._selectedTabId != tabId) {
                        this._selectedTabId = tabId;
                        var selectedTabController = this._tabIdsToControllers[tabId];
                        this.setController(this._tabControllerKey, selectedTabController, true);
                        if(suppressModelChangeEvent != true) {
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
                    for(var tabId in this._tabIdsToControllers) {
                        var controller = this._tabIdsToControllers[tabId];
                        if(result.indexOf(controller) < 0) {
                            result.push(controller);
                        }
                    }
                    return result;
                };
                MappedTabControllerModel.prototype._getDescribedControllerKey = function (controller) {
                    var result = _super.prototype._getDescribedControllerKey.call(this, controller);
                    if(result == this._tabControllerKey || result == null) {
                        for(var key in this._tabIdsToControllers) {
                            var tabController = this._tabIdsToControllers[key];
                            if(tabController == controller) {
                                result = key;
                                break;
                            }
                        }
                    }
                    return result;
                };
                MappedTabControllerModel.prototype._getDescribedController = function (key) {
                    var result = _super.prototype._getDescribedController.call(this, key);
                    if(result == null) {
                        result = this._tabIdsToControllers[key];
                    }
                    return result;
                };
                return MappedTabControllerModel;
            })(composite.MappedKeyedControllerModel);
            composite.MappedTabControllerModel = MappedTabControllerModel;            
        })(mvc.composite || (mvc.composite = {}));
        var composite = mvc.composite;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
            })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (loading) {
            var LoadableProxyingLoadingControllerModel = (function (_super) {
                __extends(LoadableProxyingLoadingControllerModel, _super);
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
                        if(callback) {
                            return callback(_this, message);
                        }
                        _this._fireModelChangeEvent();
                    });
                };
                return LoadableProxyingLoadingControllerModel;
            })(mvc.AbstractModel);
            loading.LoadableProxyingLoadingControllerModel = LoadableProxyingLoadingControllerModel;            
        })(mvc.loading || (mvc.loading = {}));
        var loading = mvc.loading;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (loading) {
            var SwitchOnLoadingCompositeControllerModel = (function (_super) {
                __extends(SwitchOnLoadingCompositeControllerModel, _super);
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
                    return [
                        this._contentController
                    ];
                };
                SwitchOnLoadingCompositeControllerModel.prototype._checkCurrentController = function () {
                    var currentController;
                    if(this._loadingModel.isComplete()) {
                        currentController = this._contentController;
                    } else {
                        currentController = this._loadingController;
                    }
                    var changed;
                    if(this._currentControllers.length == 0) {
                        this._currentControllers.push(currentController);
                        changed = true;
                    } else {
                        if(this._currentControllers[0] != currentController) {
                            this._currentControllers[0] = currentController;
                            changed = true;
                        } else {
                            changed = false;
                        }
                    }
                    if(changed) {
                        this._fireModelChangeEvent(templa.mvc.composite.compositeControllerModelEventControllersChanged);
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
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                (function (loading) {
                    var ProgressBarLoadingJQueryUIController = (function (_super) {
                        __extends(ProgressBarLoadingJQueryUIController, _super);
                        function ProgressBarLoadingJQueryUIController(_viewFactory, _progressBarSelector) {
                                                _super.call(this, _viewFactory);
                            this._progressBarSelector = _progressBarSelector;
                        }
                        ProgressBarLoadingJQueryUIController.prototype._doStart = function () {
                            var loadingModel = this._model;
                            var updateRequired = loadingModel.requestStartLoading();
                            if(updateRequired) {
                                this._increment();
                            }
                            return _super.prototype._doStart.call(this);
                        };
                        ProgressBarLoadingJQueryUIController.prototype._increment = function () {
                            var _this = this;
                            this._safeTimeout(function () {
                                var loadingModel = _this._model;
                                var updateRequired = loadingModel.update();
                                if(updateRequired) {
                                    _this._increment();
                                }
                            }, 0);
                        };
                        ProgressBarLoadingJQueryUIController.prototype._doLoad = function (model) {
                            var loadingModel = model;
                            var progress = loadingModel.getLoadingProgress();
                            var maximum = loadingModel.getMaximumProgress();
                            var effectiveProgress = Math.round((progress * 100) / maximum);
                            this.$(this._progressBarSelector).progressbar({
                                value: effectiveProgress
                            });
                        };
                        return ProgressBarLoadingJQueryUIController;
                    })(jquery.AbstractJQueryController);
                    loading.ProgressBarLoadingJQueryUIController = ProgressBarLoadingJQueryUIController;                    
                })(jquery.loading || (jquery.loading = {}));
                var loading = jquery.loading;
            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                (function (command) {
                    var IdDelegatingCommandJQueryViewDescriptionFactory = (function () {
                        function IdDelegatingCommandJQueryViewDescriptionFactory(_defaultDescriptionFactory, _idsToDescriptionFactories) {
                            this._defaultDescriptionFactory = _defaultDescriptionFactory;
                            this._idsToDescriptionFactories = _idsToDescriptionFactories;
                        }
                        IdDelegatingCommandJQueryViewDescriptionFactory.prototype.create = function (container, command) {
                            var factory = this._idsToDescriptionFactories[command.id];
                            if(factory == null) {
                                factory = this._defaultDescriptionFactory;
                            }
                            return factory.create(container, command);
                        };
                        return IdDelegatingCommandJQueryViewDescriptionFactory;
                    })();
                    command.IdDelegatingCommandJQueryViewDescriptionFactory = IdDelegatingCommandJQueryViewDescriptionFactory;                    
                })(jquery.command || (jquery.command = {}));
                var command = jquery.command;
            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                (function (tab) {
                    var TabBarTabJQueryViewDescription = (function () {
                        function TabBarTabJQueryViewDescription(_clickableElementSelector, _styleableElementSelector, _view) {
                            this._clickableElementSelector = _clickableElementSelector;
                            this._styleableElementSelector = _styleableElementSelector;
                            this._view = _view;
                        }
                        Object.defineProperty(TabBarTabJQueryViewDescription.prototype, "clickableElementSelector", {
                            get: function () {
                                return this._clickableElementSelector;
                            },
                            enumerable: true,
                            configurable: true
                        });
                        Object.defineProperty(TabBarTabJQueryViewDescription.prototype, "styleableElementSelector", {
                            get: function () {
                                return this._styleableElementSelector;
                            },
                            enumerable: true,
                            configurable: true
                        });
                        Object.defineProperty(TabBarTabJQueryViewDescription.prototype, "view", {
                            get: function () {
                                return this._view;
                            },
                            enumerable: true,
                            configurable: true
                        });
                        return TabBarTabJQueryViewDescription;
                    })();
                    tab.TabBarTabJQueryViewDescription = TabBarTabJQueryViewDescription;                    
                })(jquery.tab || (jquery.tab = {}));
                var tab = jquery.tab;
            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                (function (tab) {
                    var TabBarJQueryController = (function (_super) {
                        __extends(TabBarJQueryController, _super);
                        function TabBarJQueryController(_viewFactory, _tabBarTabViewDescriptionFactory, _tabButtonContainerSelector, _selectedTabClass) {
                                                _super.call(this, _viewFactory);
                            this._tabBarTabViewDescriptionFactory = _tabBarTabViewDescriptionFactory;
                            this._tabButtonContainerSelector = _tabButtonContainerSelector;
                            this._selectedTabClass = _selectedTabClass;
                            this._tabIdsToDescriptions = {
                            };
                        }
                        TabBarJQueryController.prototype._doLoad = function (model) {
                            var _this = this;
                            this._removeAllTabs();
                            var tabBarModel = model;
                            var tabIds = tabBarModel.getAvailableTabIds();
                            var selectedTabId = tabBarModel.getSelectedTabId();
                            var tabButtonContainer = this.$reference(this._tabButtonContainerSelector);
                            for(var i in tabIds) {
                                var tabId = tabIds[i];
                                var description = this._tabBarTabViewDescriptionFactory.create(tabButtonContainer, tabId);
                                var view = description.view;
                                view.attach();
                                if(tabId == selectedTabId) {
                                    var styleableElements = this.$(description.styleableElementSelector, view.getRoots());
                                    styleableElements.addClass(this._selectedTabClass);
                                }
                                var clickableElements = this.$(description.clickableElementSelector, view.getRoots());
                                clickableElements.click(tabId, function (e) {
                                    _this._requestSelectTabId(e.data);
                                });
                                this._tabIdsToDescriptions[tabId] = description;
                            }
                        };
                        TabBarJQueryController.prototype._removeAllTabs = function () {
                            for(var tabId in this._tabIdsToDescriptions) {
                                var description = this._tabIdsToDescriptions[tabId];
                                description.view.detach();
                            }
                            this._tabIdsToDescriptions = {
                            };
                        };
                        TabBarJQueryController.prototype._requestSelectTabId = function (tabId) {
                            var tabBarModel = this._model;
                            tabBarModel.requestSelectTabId(tabId);
                        };
                        TabBarJQueryController.prototype._selectTab = function (selectedTabId) {
                            for(var tabId in this._tabIdsToDescriptions) {
                                var description = this._tabIdsToDescriptions[tabId];
                                var view = description.view;
                                var styleableElements = this.$(description.styleableElementSelector, view.getRoots());
                                if(tabId == selectedTabId) {
                                    styleableElements.addClass(this._selectedTabClass);
                                } else {
                                    styleableElements.removeClass(this._selectedTabClass);
                                }
                            }
                        };
                        TabBarJQueryController.prototype._handleModelChangeEvent = function (event) {
                            if(event.lookup(templa.mvc.tab.tabBarModelEventSelectedTabChange)) {
                                var tabBarModel = this._model;
                                this._selectTab(tabBarModel.getSelectedTabId());
                            } else {
                                _super.prototype._handleModelChangeEvent.call(this, event);
                            }
                        };
                        return TabBarJQueryController;
                    })(jquery.AbstractJQueryController);
                    tab.TabBarJQueryController = TabBarJQueryController;                    
                })(jquery.tab || (jquery.tab = {}));
                var tab = jquery.tab;
            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            (function (jquery) {
                (function (tab) {
                    var MappedTabBarTabJQueryViewDescriptionFactory = (function () {
                        function MappedTabBarTabJQueryViewDescriptionFactory(_tabBarIdsToViewFactories, _clickableElementSelector, _styleableElementSelector) {
                            this._tabBarIdsToViewFactories = _tabBarIdsToViewFactories;
                            this._clickableElementSelector = _clickableElementSelector;
                            this._styleableElementSelector = _styleableElementSelector;
                        }
                        MappedTabBarTabJQueryViewDescriptionFactory.prototype.create = function (container, tabBarId) {
                            var viewFactory = this._tabBarIdsToViewFactories[tabBarId];
                            var result;
                            if(viewFactory != null) {
                                var view = viewFactory.create(container);
                                result = new tab.TabBarTabJQueryViewDescription(this._clickableElementSelector, this._styleableElementSelector, view);
                            } else {
                                result = null;
                            }
                            return result;
                        };
                        return MappedTabBarTabJQueryViewDescriptionFactory;
                    })();
                    tab.MappedTabBarTabJQueryViewDescriptionFactory = MappedTabBarTabJQueryViewDescriptionFactory;                    
                })(jquery.tab || (jquery.tab = {}));
                var tab = jquery.tab;
            })(element.jquery || (element.jquery = {}));
            var jquery = element.jquery;
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            var ModeElementViewProxy = (function () {
                function ModeElementViewProxy(_container, _proxied, _currentMode, _modeFunction) {
                    this._container = _container;
                    this._proxied = _proxied;
                    this._currentMode = _currentMode;
                    this._modeFunction = _modeFunction;
                }
                ModeElementViewProxy.prototype.getRoots = function () {
                    return this._proxied.getRoots();
                };
                ModeElementViewProxy.prototype.attach = function () {
                    this._proxied.attach();
                };
                ModeElementViewProxy.prototype.detach = function () {
                    this._proxied.detach();
                };
                ModeElementViewProxy.prototype.layout = function () {
                    var ratio = window.innerWidth / window.innerHeight;
                    var needsExternalLayout;
                    var mode = this._modeFunction(this._container);
                    if(mode != this._currentMode) {
                        needsExternalLayout = true;
                    } else {
                        needsExternalLayout = this._proxied.layout();
                    }
                    return needsExternalLayout;
                };
                return ModeElementViewProxy;
            })();
            element.ModeElementViewProxy = ModeElementViewProxy;            
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (mvc) {
        (function (element) {
            var ModeElementViewFactoryProxy = (function () {
                function ModeElementViewFactoryProxy(_modeFunction, _modesToFactories) {
                    this._modeFunction = _modeFunction;
                    this._modesToFactories = _modesToFactories;
                }
                ModeElementViewFactoryProxy.prototype.create = function (container, prepend) {
                    var mode = this._modeFunction(container);
                    var factory = this._modesToFactories[mode];
                    var result;
                    if(factory != null) {
                        var view = factory.create(container, prepend);
                        result = new element.ModeElementViewProxy(container, view, mode, this._modeFunction);
                    } else {
                        result = null;
                    }
                    return result;
                };
                return ModeElementViewFactoryProxy;
            })();
            element.ModeElementViewFactoryProxy = ModeElementViewFactoryProxy;            
        })(mvc.element || (mvc.element = {}));
        var element = mvc.element;
    })(templa.mvc || (templa.mvc = {}));
    var mvc = templa.mvc;
})(templa || (templa = {}));
var templa;
(function (templa) {
    (function (samples) {
        (function (mvc) {
            (function (tab_index) {
                var TabIndexControllerFactory = (function () {
                    function TabIndexControllerFactory() {
                    }
                    TabIndexControllerFactory.prototype.create = function () {
                        var loadingSwitcherViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL("src/samples/handlebars/tab_index/loading_container.html");
                        var loadingSwitcherController = new templa.mvc.element.jquery.composite.AbstractCompositeJQueryController(loadingSwitcherViewFactory);
                        var loadables = [];
                        var tabBarContainerId = "tab_bar_container";
                        var tabBarKey = ".tab_bar";
                        var decoratorToolbarContainerKey = "decorated_toolbar_container";
                        var decoratorToolbarControllerKey = "decorated_toolbar";
                        var decoratorBodyControllerKey = "decorated_body";
                        var decoratorViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL("src/samples/handlebars/decorated_stack/decorator.html", loadables, {
                            toolbar_key: decoratorToolbarControllerKey,
                            view_key: decoratorBodyControllerKey,
                            toolbar_container_key: decoratorToolbarContainerKey
                        });
                        var toolbarBackViewKey = "toolbar_buttons_back";
                        var toolbarGeneralViewKey = "toolbar_buttons_general";
                        var toolbarViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL("src/samples/handlebars/toolbar/toolbar.html", loadables, {
                            toolbar_buttons_back_class: toolbarBackViewKey,
                            toolbar_buttons_general_class: toolbarGeneralViewKey
                        });
                        var toolbarNormalCommandElementViewFactory = templa.mvc.element.jquery.command.TemplateCommandJQueryViewDescriptionFactory.createFromURL("src/samples/handlebars/toolbar/button_normal.html", loadables);
                        var toolbarBackCommandElementViewFactory = templa.mvc.element.jquery.command.TemplateCommandJQueryViewDescriptionFactory.createFromURL("src/samples/handlebars/toolbar/button_back.html", loadables);
                        var toolbarCommandElementViewFactory = new templa.mvc.element.jquery.command.IdDelegatingCommandJQueryViewDescriptionFactory(toolbarNormalCommandElementViewFactory, {
                            back: toolbarBackCommandElementViewFactory
                        });
                        var decoratorFactory = function (controllers) {
                            var toolbarController = new templa.mvc.element.jquery.command.ToolbarCommandJQueryController(toolbarViewFactory, toolbarCommandElementViewFactory, "." + toolbarBackViewKey, "." + toolbarGeneralViewKey);
                            toolbarController.setModel(new templa.mvc.command.CommandControllerModelAdapter(loadingSwitcherController));
                            var decoratorController = new templa.mvc.element.jquery.composite.KeyedJQueryController(decoratorViewFactory);
                            decoratorController.setModel(new templa.samples.mvc.controller.ToolbarDecoratorModel(toolbarController, "." + decoratorToolbarControllerKey, controllers, "." + decoratorBodyControllerKey));
                            return decoratorController;
                        };
                        var helloWorldControllerId = "hello_world";
                        var helloWorldController = templa.samples.mvc.hello_world.HelloWorldControllerFactory.create();
                        helloWorldController = decoratorFactory([
                            helloWorldController
                        ]);
                        var helloYouControllerId = "hello_you";
                        var helloYouControllerFactory = new templa.samples.mvc.hello_you.HelloYouControllerFactory();
                        var helloYouController = helloYouControllerFactory.create();
                        helloYouController = decoratorFactory([
                            helloYouController
                        ]);
                        var basicStackControllerId = "basic_stack";
                        var basicStackControllerFactory = new templa.samples.mvc.basic_stack.BasicStackControllerFactory();
                        var basicStackController = basicStackControllerFactory.create();
                        basicStackController = decoratorFactory([
                            basicStackController
                        ]);
                        var decoratedStackControllerId = "decorated_stack";
                        var decoratedStackController = templa.samples.mvc.decorated_stack.DecoratedStackControllerFactory.create(loadables, decoratorFactory);
                        var tabbedControllers = {
                        };
                        tabbedControllers[helloWorldControllerId] = helloWorldController;
                        tabbedControllers[helloYouControllerId] = helloYouController;
                        tabbedControllers[basicStackControllerId] = basicStackController;
                        tabbedControllers[decoratedStackControllerId] = decoratedStackController;
                        var tabBarIdsToViewFactories = {
                        };
                        tabBarIdsToViewFactories[helloWorldControllerId] = templa.mvc.element.TemplateElementViewFactory.createFromURL("src/samples/handlebars/tab_index/tab_button.html", loadables, {
                            title: "Hello World"
                        });
                        tabBarIdsToViewFactories[helloYouControllerId] = templa.mvc.element.TemplateElementViewFactory.createFromURL("src/samples/handlebars/tab_index/tab_button.html", loadables, {
                            title: "Hello You"
                        });
                        tabBarIdsToViewFactories[basicStackControllerId] = templa.mvc.element.TemplateElementViewFactory.createFromURL("src/samples/handlebars/tab_index/tab_button.html", loadables, {
                            title: "Basic Stack"
                        });
                        tabBarIdsToViewFactories[decoratedStackControllerId] = templa.mvc.element.TemplateElementViewFactory.createFromURL("src/samples/handlebars/tab_index/tab_button.html", loadables, {
                            title: "Decorated Stack"
                        });
                        var tabBarViewDescriptionFactory = new templa.mvc.element.jquery.tab.MappedTabBarTabJQueryViewDescriptionFactory(tabBarIdsToViewFactories, ".tab_bar_button", ".tab_bar_button_root");
                        var tabBarViewFactory = new templa.mvc.element.jquery.BorrowedElementViewFactory(null);
                        var tabBarController = new templa.mvc.element.jquery.tab.TabBarJQueryController(tabBarViewFactory, tabBarViewDescriptionFactory, null, "selected");
                        var tabPaneKey = ".tab_pane";
                        var tabControllers = {
                        };
                        tabControllers[tabBarKey] = tabBarController;
                        var tabModel = new templa.mvc.composite.MappedTabControllerModel(helloWorldControllerId, tabbedControllers, tabPaneKey, tabControllers);
                        var tabViewFactoryHorizontal = templa.mvc.element.TemplateElementViewFactory.createFromURL("src/samples/handlebars/tab_index/tab_container_horizontal.html", loadables);
                        var tabViewFactoryVertical = templa.mvc.element.TemplateElementViewFactory.createFromURL("src/samples/handlebars/tab_index/tab_container_vertical.html", loadables);
                        var tabViewFactory = new templa.mvc.element.ModeElementViewFactoryProxy(function () {
                            var result;
                            if(window.innerWidth > window.innerHeight) {
                                result = "wide";
                            } else {
                                result = "narrow";
                            }
                            return result;
                        }, {
                            wide: tabViewFactoryVertical,
                            narrow: tabViewFactoryHorizontal
                        });
                        var tabController = new templa.mvc.element.jquery.composite.KeyedJQueryController(tabViewFactory);
                        tabBarController.setModel(tabModel);
                        tabController.setModel(tabModel);
                        var loadingViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory();
                        var loadingController = new templa.mvc.element.jquery.loading.ProgressBarLoadingJQueryUIController(loadingViewFactory);
                        var compositeLoadable = new templa.loading.CompositeLoadable(loadables);
                        var loadingModel = new templa.mvc.loading.LoadableProxyingLoadingControllerModel(compositeLoadable);
                        loadingController.setModel(loadingModel);
                        var loadingSwitcherModel = new templa.mvc.loading.SwitchOnLoadingCompositeControllerModel(loadingController, tabController, loadingModel);
                        loadingSwitcherController.setModel(loadingSwitcherModel);
                        return loadingSwitcherController;
                    };
                    return TabIndexControllerFactory;
                })();
                tab_index.TabIndexControllerFactory = TabIndexControllerFactory;                
            })(mvc.tab_index || (mvc.tab_index = {}));
            var tab_index = mvc.tab_index;
        })(samples.mvc || (samples.mvc = {}));
        var mvc = samples.mvc;
    })(templa.samples || (templa.samples = {}));
    var samples = templa.samples;
})(templa || (templa = {}));
