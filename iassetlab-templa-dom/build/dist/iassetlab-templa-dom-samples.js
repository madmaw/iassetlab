///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../../build/dist/iassetlab-templa-dom.d.ts"/>
///<reference path="ITextInputModel.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var templa;
(function (templa) {
    (function (dom) {
        (function (samples) {
            (function (mvc) {
                (function (controller) {
                    ///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
                    ///<reference path="../../../../../../build/dist/iassetlab-templa-dom.d.ts"/>
                    // Module
                    (function (text_input) {
                        // Class
                        var TextInputController = (function (_super) {
                            __extends(TextInputController, _super);
                            // Constructor
                            function TextInputController(_viewFactory, _inputElementSelector, _buttonElementSelector) {
                                _super.call(this, _viewFactory);
                                this._inputElementSelector = _inputElementSelector;
                                this._buttonElementSelector = _buttonElementSelector;
                            }
                            TextInputController.prototype._doStart = function () {
                                var _this = this;
                                // listen upon the button for click events
                                this.$(this._buttonElementSelector).click(function () {
                                    _this._requestSubmit();
                                });
                                this.$(this._inputElementSelector).keypress(function (e) {
                                    if (e.which == 13) {
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
                        })(templa.dom.mvc.jquery.AbstractJQueryController);
                        text_input.TextInputController = TextInputController;
                    })(controller.text_input || (controller.text_input = {}));
                    var text_input = controller.text_input;
                })(mvc.controller || (mvc.controller = {}));
                var controller = mvc.controller;
            })(samples.mvc || (samples.mvc = {}));
            var mvc = samples.mvc;
        })(dom.samples || (dom.samples = {}));
        var samples = dom.samples;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../../build/dist/iassetlab-templa-dom.d.ts"/>
///<reference path="ILabelModel.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (samples) {
            (function (mvc) {
                (function (controller) {
                    ///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
                    ///<reference path="../../../../../../build/dist/iassetlab-templa-dom.d.ts"/>
                    // Module
                    (function (label) {
                        // Class
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
                        })(templa.dom.mvc.jquery.AbstractJQueryController);
                        label.LabelController = LabelController;
                    })(controller.label || (controller.label = {}));
                    var label = controller.label;
                })(mvc.controller || (mvc.controller = {}));
                var controller = mvc.controller;
            })(samples.mvc || (samples.mvc = {}));
            var mvc = samples.mvc;
        })(dom.samples || (dom.samples = {}));
        var samples = dom.samples;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="ILabelModel.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (samples) {
            (function (mvc) {
                (function (controller) {
                    ///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
                    ///<reference path="../../../../../../build/dist/iassetlab-templa-dom.d.ts"/>
                    // Module
                    (function (label) {
                        // Class
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
        })(dom.samples || (dom.samples = {}));
        var samples = dom.samples;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../Controller/text_input/TextInputController.ts"/>
///<reference path="../controller/text_input/ITextInputModel.ts"/>
///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ImmutableLabelModel.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (samples) {
            (function (mvc) {
                ///<reference path="../../../../../build/defs/jquery.d.ts"/>
                ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
                ///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/>
                // Module
                (function (basic_stack) {
                    // Class
                    var BasicStackModel = (function (_super) {
                        __extends(BasicStackModel, _super);
                        // Constructor
                        function BasicStackModel() {
                            _super.call(this);
                            this.labelViewKey = "label";

                            // TODO this should be passed in, not created internally
                            this.labelViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<span key='" + this.labelViewKey + "'></span>");
                        }
                        BasicStackModel.prototype.getValue = function () {
                            return "";
                        };

                        BasicStackModel.prototype.requestSubmit = function (value) {
                            // push a new controller
                            // TODO  this should probably be created via a factory rather than explicitly done here
                            var labelController = this._createController(value);
                            this._push(labelController);
                        };

                        BasicStackModel.prototype._createController = function (value) {
                            var labelController = new templa.dom.samples.mvc.controller.label.LabelController(this.labelViewFactory, "[key='" + this.labelViewKey + "']");
                            labelController.setModel(new templa.dom.samples.mvc.controller.label.ImmutableLabelModel(value));
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
        })(dom.samples || (dom.samples = {}));
        var samples = dom.samples;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="BasicStackModel.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (samples) {
            (function (mvc) {
                ///<reference path="../../../../../build/defs/jquery.d.ts"/>
                ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
                ///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/>
                // Module
                (function (basic_stack) {
                    // Class
                    var BasicStackControllerFactory = (function () {
                        // Constructor
                        function BasicStackControllerFactory() {
                            this._model = new templa.dom.samples.mvc.basic_stack.BasicStackModel();
                        }
                        BasicStackControllerFactory.prototype.createStackController = function () {
                            var stackViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div key='stack'></div>");
                            var stackController = new templa.dom.mvc.jquery.composite.StackJQueryController(stackViewFactory, []);
                            stackController.setModel(this._model);
                            return stackController;
                        };

                        BasicStackControllerFactory.prototype.createInputController = function () {
                            var inputElementKey = "input_element";
                            var inputButtonKey = "input_button";
                            var inputViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<input key='" + inputElementKey + "'></input><br/><input type='button' key='" + inputButtonKey + "' value='Submit'></input>");
                            var inputController = new templa.dom.samples.mvc.controller.text_input.TextInputController(inputViewFactory, "[key='" + inputElementKey + "']", "[key='" + inputButtonKey + "']");
                            inputController.setModel(this._model);
                            return inputController;
                        };

                        BasicStackControllerFactory.prototype.create = function () {
                            var idInput = "basic_input";
                            var idStack = "basic_stack";
                            var controllers = {};
                            controllers["." + idInput] = this.createInputController();
                            controllers["." + idStack] = this.createStackController();
                            var model = new templa.mvc.composite.MappedKeyedControllerModel(controllers);

                            var viewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div class = '" + idInput + "' > </div><div class = '" + idStack + "' > </div>");

                            var controller = new templa.dom.mvc.jquery.composite.KeyedJQueryController(viewFactory);
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
        })(dom.samples || (dom.samples = {}));
        var samples = dom.samples;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>
///<reference path="../controller/text_input/TextInputController.ts"/>
///<reference path="text_input/ITextInputModel.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (samples) {
            (function (mvc) {
                ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
                ///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/>
                // Module
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
                            if (controller == this._toolbarController) {
                                result = this._toolbarControllerKey;
                            } else {
                                result = this._otherControllerKey;
                            }
                            return result;
                        };

                        ToolbarDecoratorModel.prototype._getDescribedControllers = function () {
                            // assume the toolbar is stateless
                            return this._otherControllers;
                        };

                        ToolbarDecoratorModel.prototype.getControllers = function () {
                            var result = [this._toolbarController];
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
        })(dom.samples || (dom.samples = {}));
        var samples = dom.samples;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>
///<reference path="../controller/label/ImmutableLabelModel.ts"/>
///<reference path="../controller/text_input/TextInputController.ts"/>
///<reference path="../controller/text_input/ITextInputModel.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (samples) {
            (function (mvc) {
                ///<reference path="../../../../../build/defs/jquery.d.ts"/>
                ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
                ///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/>
                // Module
                (function (decorated_stack) {
                    // Class
                    var DecoratedStackModel = (function (_super) {
                        __extends(DecoratedStackModel, _super);
                        // Constructor
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
                            // push a new controller
                            if (value != null && value.length > 0) {
                                // create the label
                                var decoratorController = this._createController(value);

                                this._push(decoratorController, value);
                            }
                        };

                        DecoratedStackModel.prototype._createController = function (value) {
                            var labelController = new templa.dom.samples.mvc.controller.label.LabelController(this._labelViewFactory, this._labelViewSelector);
                            labelController.setModel(new templa.dom.samples.mvc.controller.label.ImmutableLabelModel(value));

                            // create an input controller
                            var inputController = new templa.dom.samples.mvc.controller.text_input.TextInputController(this._inputViewFactory, this._inputValueSelector, this._inputButtonSelector);
                            inputController.setModel(this);

                            var controllers = [labelController, inputController];
                            return this._toolbarDecoratorFactory(controllers);
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
        })(dom.samples || (dom.samples = {}));
        var samples = dom.samples;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="DecoratedStackModel.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (samples) {
            (function (mvc) {
                (function (decorated_stack) {
                    ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
                    ///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/>
                    // Module
                    (function (DecoratedStackControllerFactory) {
                        // Class
                        function create(loadables, toolbarDecoratorFactory) {
                            // TODO should probably replace this with a JQuery animation thing, that way it will be (more) cross-platform (but not hardware accelerated)
                            // create the stack controller
                            var stackViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div class='content_slider'></div>");
                            var relativePushAddAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-push-add", 1000);
                            var relativePushRemoveAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-push-remove", 1000);
                            var relativePopAddAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-pop-add", 1000);
                            var relativePopRemoveAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-pop-remove", 1000);

                            var absolutePushAddAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-push-add", 1000);
                            var absolutePushRemoveAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-push-remove", 1000);
                            var absolutePopAddAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-pop-add", 1000);
                            var absolutePopRemoveAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-pop-remove", 1000);

                            var stackController = new templa.dom.mvc.jquery.composite.StackJQueryController(stackViewFactory, [
                                {
                                    popAnimationFactory: relativePopAddAnimationFactory,
                                    pushAnimationFactory: relativePushRemoveAnimationFactory,
                                    selector: ".content_pane:nth-of-type(2)"
                                }, {
                                    popAnimationFactory: absolutePopAddAnimationFactory,
                                    pushAnimationFactory: absolutePushRemoveAnimationFactory,
                                    selector: ".decorated_toolbar_container:nth-of-type(1)"
                                }, {
                                    popAnimationFactory: absolutePopRemoveAnimationFactory,
                                    pushAnimationFactory: absolutePushAddAnimationFactory,
                                    selector: ".decorated_toolbar_container:nth-of-type(3)"
                                }]);

                            var labelViewKey = "label";
                            var labelViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/samples/handlebars/decorated_stack/label.html", loadables, { label_key: labelViewKey });

                            // create the input controller
                            var inputElementKey = "input_element";
                            var inputButtonKey = "input_button";
                            var inputViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/samples/handlebars/decorated_stack/input.html", loadables, { input_element: inputElementKey, input_button: inputButtonKey });

                            var stackModel = new templa.dom.samples.mvc.decorated_stack.DecoratedStackModel(stackController, labelViewFactory, "[key='" + labelViewKey + "']", inputViewFactory, "[key='" + inputElementKey + "']", "[key='" + inputButtonKey + "']", toolbarDecoratorFactory);
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
        })(dom.samples || (dom.samples = {}));
        var samples = dom.samples;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (samples) {
            (function (mvc) {
                ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
                ///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/>
                // Module
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
        })(dom.samples || (dom.samples = {}));
        var samples = dom.samples;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>
///<reference path="HelloWorldModel.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (samples) {
            (function (mvc) {
                (function (hello_world) {
                    ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
                    ///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/>
                    // Module
                    (function (HelloWorldControllerFactory) {
                        function create() {
                            var labelViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div>Hello <span key='name_element'></span>!</div>");
                            var labelController = new templa.dom.samples.mvc.controller.label.LabelController(labelViewFactory, "[key='name_element']");
                            var labelModel = new templa.dom.samples.mvc.hello_world.HelloWorldModel("World");
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
        })(dom.samples || (dom.samples = {}));
        var samples = dom.samples;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>
///<reference path="../controller/text_input/TextInputController.ts"/>
///<reference path="../controller/text_input/ITextInputModel.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (samples) {
            (function (mvc) {
                ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
                ///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/>
                // Module
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
        })(dom.samples || (dom.samples = {}));
        var samples = dom.samples;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="HelloYouModel.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (samples) {
            (function (mvc) {
                ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
                ///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/>
                // Module
                (function (hello_you) {
                    var HelloYouControllerFactory = (function () {
                        function HelloYouControllerFactory() {
                            this._model = new templa.dom.samples.mvc.hello_you.HelloYouModel("You");
                        }
                        HelloYouControllerFactory.prototype.createLabelController = function () {
                            var labelViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div>Hello <span key='name_element'></span>!</div>");
                            var labelController = new templa.dom.samples.mvc.controller.label.LabelController(labelViewFactory, "[key='name_element']");
                            labelController.setModel(this._model);
                            return labelController;
                        };

                        HelloYouControllerFactory.prototype.createInputController = function () {
                            var textInputViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<input key='input_element'></input><br/><input type='button' key='input_button' value='Submit'></input>");
                            var textInputController = new templa.dom.samples.mvc.controller.text_input.TextInputController(textInputViewFactory, "[key='input_element']", "[key='input_button']");
                            textInputController.setModel(this._model);
                            return textInputController;
                        };

                        HelloYouControllerFactory.prototype.create = function () {
                            var idInput = "helloyou_input";
                            var idOutput = "helloyou_output";
                            var controllers = {};
                            controllers["." + idInput] = this.createInputController();
                            controllers["." + idOutput] = this.createLabelController();
                            var model = new templa.mvc.composite.MappedKeyedControllerModel(controllers);

                            var viewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div class = '" + idOutput + "' > </div><div class = '" + idInput + "' > </div>");

                            var controller = new templa.dom.mvc.jquery.composite.KeyedJQueryController(viewFactory);
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
        })(dom.samples || (dom.samples = {}));
        var samples = dom.samples;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../hello_world/HelloWorldControllerFactory.ts"/>
///<reference path="../hello_you/HelloYouControllerFactory.ts"/>
///<reference path="../basic_stack/BasicStackControllerFactory.ts"/>
///<reference path="../decorated_stack/DecoratedStackControllerFactory.ts"/>
///<reference path="../controller/ToolbarDecoratorModel.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (samples) {
            (function (mvc) {
                ///<reference path="../../../../../build/defs/jquery.d.ts"/>
                ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
                ///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/>
                // Module
                (function (tab_index) {
                    // Class
                    var TabIndexControllerFactory = (function () {
                        // Constructor
                        function TabIndexControllerFactory() {
                        }
                        TabIndexControllerFactory.prototype.create = function () {
                            var loadingSwitcherViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/samples/handlebars/tab_index/loading_container.html");
                            var loadingSwitcherController = new templa.dom.mvc.jquery.composite.AbstractCompositeJQueryController(loadingSwitcherViewFactory);

                            var loadables = [];

                            var tabBarContainerId = "tab_bar_container";
                            var tabBarKey = ".tab_bar";

                            // create toolbar decorator
                            // TODO pass the decorator in as a parameter
                            var decoratorToolbarContainerKey = "decorated_toolbar_container";
                            var decoratorToolbarControllerKey = "decorated_toolbar";
                            var decoratorBodyControllerKey = "decorated_body";
                            var decoratorViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/samples/handlebars/decorated_stack/decorator.html", loadables, { toolbar_key: decoratorToolbarControllerKey, view_key: decoratorBodyControllerKey, toolbar_container_key: decoratorToolbarContainerKey });

                            //var localFixedHeightSelectors = ["." + decoratorToolbarContainerKey, "." + tabBarKey];
                            // for the height
                            //decoratorViewFactory = new templa.mvc.element.jquery.DimensionSettingElementViewProxyFactory(decoratorViewFactory, "#" + decoratorBodyControllerKey, null, localFixedHeightSelectors);
                            // for the width
                            //decoratorViewFactory = new templa.mvc.element.jquery.DimensionSettingElementViewProxyFactory(decoratorViewFactory, null, [], null);
                            var toolbarBackViewKey = "toolbar_buttons_back";
                            var toolbarGeneralViewKey = "toolbar_buttons_general";
                            var toolbarViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/samples/handlebars/toolbar/toolbar.html", loadables, { toolbar_buttons_back_class: toolbarBackViewKey, toolbar_buttons_general_class: toolbarGeneralViewKey });

                            var toolbarNormalCommandElementViewFactory = templa.dom.mvc.jquery.command.TemplateCommandJQueryViewDescriptionFactory.createFromURL("src/samples/handlebars/toolbar/button_normal.html", loadables);
                            var toolbarBackCommandElementViewFactory = templa.dom.mvc.jquery.command.TemplateCommandJQueryViewDescriptionFactory.createFromURL("src/samples/handlebars/toolbar/button_back.html", loadables);

                            var toolbarCommandElementViewFactory = new templa.dom.mvc.jquery.command.IdDelegatingCommandJQueryViewDescriptionFactory(toolbarNormalCommandElementViewFactory, { back: toolbarBackCommandElementViewFactory });

                            var decoratorFactory = function (controllers) {
                                var toolbarController = new templa.dom.mvc.jquery.command.ToolbarCommandJQueryController(toolbarViewFactory, toolbarCommandElementViewFactory, "." + toolbarBackViewKey, "." + toolbarGeneralViewKey);
                                toolbarController.setModel(new templa.mvc.command.CommandControllerModelAdapter(loadingSwitcherController));

                                var decoratorController = new templa.dom.mvc.jquery.composite.KeyedJQueryController(decoratorViewFactory);
                                decoratorController.setModel(new templa.dom.samples.mvc.controller.ToolbarDecoratorModel(toolbarController, "." + decoratorToolbarControllerKey, controllers, "." + decoratorBodyControllerKey));
                                return decoratorController;
                            };

                            // create stuff
                            var helloWorldControllerId = "hello_world";
                            var helloWorldController = templa.dom.samples.mvc.hello_world.HelloWorldControllerFactory.create();
                            helloWorldController = decoratorFactory([helloWorldController]);

                            var helloYouControllerId = "hello_you";
                            var helloYouControllerFactory = new templa.dom.samples.mvc.hello_you.HelloYouControllerFactory();
                            var helloYouController = helloYouControllerFactory.create();
                            helloYouController = decoratorFactory([helloYouController]);

                            var basicStackControllerId = "basic_stack";
                            var basicStackControllerFactory = new templa.dom.samples.mvc.basic_stack.BasicStackControllerFactory();
                            var basicStackController = basicStackControllerFactory.create();
                            basicStackController = decoratorFactory([basicStackController]);

                            var decoratedStackControllerId = "decorated_stack";
                            var decoratedStackController = templa.dom.samples.mvc.decorated_stack.DecoratedStackControllerFactory.create(loadables, decoratorFactory);

                            var tabbedControllers = {};
                            tabbedControllers[helloWorldControllerId] = helloWorldController;
                            tabbedControllers[helloYouControllerId] = helloYouController;
                            tabbedControllers[basicStackControllerId] = basicStackController;
                            tabbedControllers[decoratedStackControllerId] = decoratedStackController;

                            var tabBarIdsToViewFactories = {};
                            tabBarIdsToViewFactories[helloWorldControllerId] = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/samples/handlebars/tab_index/tab_button.html", loadables, { title: "Hello World" });
                            tabBarIdsToViewFactories[helloYouControllerId] = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/samples/handlebars/tab_index/tab_button.html", loadables, { title: "Hello You" });
                            tabBarIdsToViewFactories[basicStackControllerId] = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/samples/handlebars/tab_index/tab_button.html", loadables, { title: "Basic Stack" });
                            tabBarIdsToViewFactories[decoratedStackControllerId] = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/samples/handlebars/tab_index/tab_button.html", loadables, { title: "Decorated Stack" });

                            var tabBarViewDescriptionFactory = new templa.dom.mvc.jquery.tab.MappedTabBarTabJQueryViewDescriptionFactory(tabBarIdsToViewFactories, ".tab_bar_button", ".tab_bar_button_root");
                            var tabBarViewFactory = new templa.dom.mvc.jquery.BorrowedElementViewFactory(null);
                            var tabBarController = new templa.dom.mvc.jquery.tab.TabBarJQueryController(tabBarViewFactory, tabBarViewDescriptionFactory, null, "selected");

                            var tabPaneKey = ".tab_pane";
                            var tabControllers = {};
                            tabControllers[tabBarKey] = tabBarController;

                            var tabModel = new templa.mvc.composite.MappedTabControllerModel(helloWorldControllerId, tabbedControllers, tabPaneKey, tabControllers);

                            var tabViewFactoryHorizontal = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/samples/handlebars/tab_index/tab_container_horizontal.html", loadables);
                            var tabViewFactoryVertical = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/samples/handlebars/tab_index/tab_container_vertical.html", loadables);
                            var tabViewFactory = new templa.dom.mvc.ModeElementViewFactoryProxy(function () {
                                var result;
                                if (window.innerWidth > window.innerHeight) {
                                    result = "wide";
                                } else {
                                    result = "narrow";
                                }
                                return result;
                            }, {
                                wide: tabViewFactoryVertical,
                                narrow: tabViewFactoryHorizontal
                            });

                            /*
                            var tabViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory(
                            "<div id = '" + tabBarKey + "' > </div><div id = '" + tabPaneKey + "' > </div>"
                            );
                            */
                            var tabController = new templa.dom.mvc.jquery.composite.KeyedJQueryController(tabViewFactory);

                            tabBarController.setModel(tabModel);
                            tabController.setModel(tabModel);

                            var loadingViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory();
                            var loadingController = new templa.dom.mvc.jquery.loading.ProgressBarLoadingJQueryUIController(loadingViewFactory);

                            var compositeLoadable = new templa.loading.CompositeLoadable(loadables);
                            var loadingModel = new templa.mvc.loading.LoadableProxyingLoadingControllerModel(compositeLoadable);
                            loadingController.setModel(loadingModel);

                            var loadingSwitcherModel = new templa.mvc.loading.SwitchOnLoadingCompositeControllerModel(loadingController, tabController, loadingModel);
                            loadingSwitcherController.setModel(loadingSwitcherModel);

                            //return tabController;
                            return loadingSwitcherController;
                        };
                        return TabIndexControllerFactory;
                    })();
                    tab_index.TabIndexControllerFactory = TabIndexControllerFactory;
                })(mvc.tab_index || (mvc.tab_index = {}));
                var tab_index = mvc.tab_index;
            })(samples.mvc || (samples.mvc = {}));
            var mvc = samples.mvc;
        })(dom.samples || (dom.samples = {}));
        var samples = dom.samples;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
