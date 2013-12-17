///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var templa;
(function (templa) {
    (function (dom) {
        // Module
        (function (animation) {
            animation.cssAnimationEndEventNames = ["animationend", "webkitAnimationEnd", "oanimationend", "MSAnimationEnd"];

            // Class
            var CSSElementClassAnimation = (function (_super) {
                __extends(CSSElementClassAnimation, _super);
                // Constructor
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
                    for (var i in animation.cssAnimationEndEventNames) {
                        var cssAnimationEndEventName = animation.cssAnimationEndEventNames[i];
                        this._view.addEventListener(cssAnimationEndEventName, this._animationListener, false);
                    }
                    if (this._lifecycleFunction != null) {
                        this._lifecycleFunction(templa.animation.animationStateInitialized, this._view);
                    }
                    return true;
                };

                CSSElementClassAnimation.prototype._doStart = function () {
                    var clazz = this._view.getAttribute("class");
                    if (clazz == null || clazz.length == 0) {
                        clazz = this._class;
                    } else {
                        clazz += " " + this._class;
                    }
                    this._view.setAttribute("class", clazz);

                    // force destroy if max time millis supplied
                    if (this._maxTimeMillis != null) {
                        setTimeout(this._animationListener, this._maxTimeMillis);
                    }
                    if (this._lifecycleFunction != null) {
                        this._lifecycleFunction(templa.animation.animationStateStarted, this._view);
                    }
                    return true;
                };

                CSSElementClassAnimation.prototype._doDestroy = function () {
                    var _this = this;
                    for (var i in animation.cssAnimationEndEventNames) {
                        var cssAnimationEndEventName = animation.cssAnimationEndEventNames[i];
                        this._view.removeEventListener(cssAnimationEndEventName, this._animationListener, false);
                    }

                    // remove this class
                    var clazz = this._view.getAttribute("class");
                    var result;
                    if (clazz != null) {
                        var index = clazz.indexOf(this._class);
                        if (index >= 0) {
                            clazz = clazz.substring(0, index) + clazz.substring(index + this._class.length);
                            this._view.setAttribute("class", clazz);
                            result = true;
                            if (this._lifecycleFunction != null) {
                                // slight delay to allow CSS to complete?!
                                var delay;
                                if (this._maxTimeMillis != null) {
                                    // assume that any queued up animations will run on similar timescales
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
            })(templa.animation.AbstractAnimation);
            animation.CSSElementClassAnimation = CSSElementClassAnimation;
        })(dom.animation || (dom.animation = {}));
        var animation = dom.animation;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="IElementAnimationFactory.ts"/>
///<reference path="CSSElementClassAnimation.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        // Module
        (function (animation) {
            // Class
            var CSSElementClassAnimationFactory = (function () {
                // Constructor
                function CSSElementClassAnimationFactory(_class, _maxTimeMillis, _lifecycleFunction) {
                    this._class = _class;
                    this._maxTimeMillis = _maxTimeMillis;
                    this._lifecycleFunction = _lifecycleFunction;
                }
                CSSElementClassAnimationFactory.prototype.create = function (container, view) {
                    return new templa.dom.animation.CSSElementClassAnimation(view, this._class, this._maxTimeMillis, this._lifecycleFunction);
                };
                return CSSElementClassAnimationFactory;
            })();
            animation.CSSElementClassAnimationFactory = CSSElementClassAnimationFactory;
        })(dom.animation || (dom.animation = {}));
        var animation = dom.animation;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        // Module
        (function (animation) {
            animation.CSSElementTransitionEventNames = ["webkitTransitionEnd", "transitionEnd", "otransitionend", "oTransitionEnd"];

            animation.CSSElementTransitionNames = ["transition", "-moz-transition", "-webkit-transition", "-o-transition", "-ms-transition"];
            animation.CSSElementTransformNames = ["transform", "-moz-transform", "-webkit-transform", "-o-transform", "-ms-transform"];

            // Class
            var CSSTranslateElementTransitionAnimation = (function (_super) {
                __extends(CSSTranslateElementTransitionAnimation, _super);
                // Constructor
                function CSSTranslateElementTransitionAnimation(_view, _initialX, _initialY, _transitionStyle, _transformStyle) {
                    var _this = this;
                    _super.call(this);
                    this._view = _view;
                    this._initialX = _initialX;
                    this._initialY = _initialY;
                    this._transitionStyle = _transitionStyle;
                    this._transformStyle = _transformStyle;
                    this._animationEventListener = function () {
                        _this.destroy();
                    };
                }
                CSSTranslateElementTransitionAnimation.prototype._doInit = function () {
                    var style = this._view.getAttribute("style");
                    if (style == null) {
                        style = "";
                    }
                    style += "margin-top: " + this._initialY + "px; margin-left: " + this._initialX + "px;";
                    this._view.setAttribute("style", style);
                    return true;
                };

                CSSTranslateElementTransitionAnimation.prototype._doStart = function () {
                    for (var i in animation.CSSElementTransitionEventNames) {
                        var eventName = animation.CSSElementTransitionEventNames[i];
                        this._view.addEventListener(eventName, this._animationEventListener, false);
                    }
                    var style = this._view.getAttribute("style");
                    if (style == null) {
                        style = "";
                    }
                    for (var i in animation.CSSElementTransitionNames) {
                        var name = animation.CSSElementTransitionNames[i];
                        style += name;
                        style += " : ";
                        style += this._transitionStyle;
                        style += "; ";
                    }
                    for (var i in animation.CSSElementTransformNames) {
                        var name = animation.CSSElementTransformNames[i];
                        style += name;
                        style += " : ";
                        style += this._transformStyle;
                        style += "; ";
                    }
                    this._view.setAttribute("style", style);
                    return true;
                };

                CSSTranslateElementTransitionAnimation.prototype._doDestroy = function () {
                    for (var i in animation.CSSElementTransitionEventNames) {
                        var eventName = animation.CSSElementTransitionEventNames[i];
                        this._view.removeEventListener(eventName, this._animationEventListener);
                    }
                    return true;
                };
                return CSSTranslateElementTransitionAnimation;
            })(templa.animation.AbstractAnimation);
            animation.CSSTranslateElementTransitionAnimation = CSSTranslateElementTransitionAnimation;
        })(dom.animation || (dom.animation = {}));
        var animation = dom.animation;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="IElementAnimationFactory.ts"/>
///<reference path="CSSTranslateElementTransitionAnimation.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        // Module
        (function (animation) {
            // Class
            var CSSTranslateElementTransitionAnimationFactory = (function () {
                // Constructor
                function CSSTranslateElementTransitionAnimationFactory(_timeSeconds, _xMultFrom, _yMultFrom, _xMultTo, _yMultTo) {
                    this._timeSeconds = _timeSeconds;
                    this._xMultFrom = _xMultFrom;
                    this._yMultFrom = _yMultFrom;
                    this._xMultTo = _xMultTo;
                    this._yMultTo = _yMultTo;
                }
                CSSTranslateElementTransitionAnimationFactory.prototype.create = function (container, view) {
                    var bounds = container.getBoundingClientRect();

                    var initialX = this._xMultFrom * bounds.width;
                    var initialY = this._yMultFrom * bounds.height;
                    var finalX = this._xMultTo * bounds.width;
                    var finalY = this._yMultTo * bounds.height;

                    var transformStyle = "translate(" + (finalX - initialX) + "px ," + (finalY - initialY) + "px)";
                    var transitionStyle = "all " + this._timeSeconds + "s ease-in";
                    return new templa.dom.animation.CSSTranslateElementTransitionAnimation(view, initialX, initialY, transitionStyle, transformStyle);
                };
                return CSSTranslateElementTransitionAnimationFactory;
            })();
            animation.CSSTranslateElementTransitionAnimationFactory = CSSTranslateElementTransitionAnimationFactory;
        })(dom.animation || (dom.animation = {}));
        var animation = dom.animation;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (loading) {
            (function (jquery) {
                var JQueryDeferredLoadable = (function (_super) {
                    __extends(JQueryDeferredLoadable, _super);
                    function JQueryDeferredLoadable(_deferred) {
                        _super.call(this, 1, false);
                        this._deferred = _deferred;
                    }
                    JQueryDeferredLoadable.prototype._doStartLoading = function () {
                        var _this = this;
                        this._deferred.done(function () {
                            _this._setLoadingProgress(1);
                        });
                    };
                    return JQueryDeferredLoadable;
                })(templa.loading.AbstractLoadable);
                jquery.JQueryDeferredLoadable = JQueryDeferredLoadable;
            })(loading.jquery || (loading.jquery = {}));
            var jquery = loading.jquery;
        })(dom.loading || (dom.loading = {}));
        var loading = dom.loading;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="IElementReference.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="IElementView.ts"/>
///<reference path="IElementReference.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="IElementReference.ts"/>
///<reference path="IElementView.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        // Module
        (function (mvc) {
            // Class
            var AttributeElementReference = (function () {
                // Constructor
                function AttributeElementReference(_view, _attributeName, _attributeValue, _filter) {
                    this._view = _view;
                    this._attributeName = _attributeName;
                    this._attributeValue = _attributeValue;
                    this._filter = _filter;
                }
                AttributeElementReference.prototype.resolve = function () {
                    // TODO want to filter out sub-controller names
                    return templa.util.Elements.find(this._attributeName, this._attributeValue, this._view.getRoots(), this._filter);
                };
                return AttributeElementReference;
            })();
            mvc.AttributeElementReference = AttributeElementReference;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="IElementController.ts"/>
///<reference path="IElementViewFactory.ts"/>
///<reference path="IElementView.ts"/>
///<reference path="AttributeElementReference.ts"/>
///<reference path="IElementReference.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        ///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
        // Module
        (function (mvc) {
            var AbstractElementController = (function (_super) {
                __extends(AbstractElementController, _super);
                function AbstractElementController(_viewFactory) {
                    _super.call(this);
                    this._viewFactory = _viewFactory;
                }
                AbstractElementController.prototype.getView = function () {
                    return this._view;
                };

                AbstractElementController.prototype.init = function (container, prepend) {
                    this._viewContainer = container;
                    this._viewPrepend = prepend;
                    this._view = this._viewFactory.create(container, prepend);
                    this._view.attach();
                    return _super.prototype._init.call(this);
                };

                AbstractElementController.prototype._reinitialize = function () {
                    this.init(this._viewContainer, this._viewPrepend);
                };

                AbstractElementController.prototype.load = function () {
                    _super.prototype.load.call(this);
                    this.layout();
                };

                AbstractElementController.prototype._doDestroy = function (detachView) {
                    if (detachView != false) {
                        this._view.detach();
                    }
                    this._view = null;
                    return true;
                };
                return AbstractElementController;
            })(templa.mvc.AbstractController);
            mvc.AbstractElementController = AbstractElementController;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="IElementReference.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        // Module
        (function (mvc) {
            // Class
            var DirectElementReference = (function () {
                // Constructor
                function DirectElementReference(_element) {
                    this._element = _element;
                }
                DirectElementReference.prototype.resolve = function () {
                    return this._element;
                };
                return DirectElementReference;
            })();
            mvc.DirectElementReference = DirectElementReference;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="IElementView.ts"/>
///<reference path="IElementReference.ts"/>
///<reference path="AttributeElementReference.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        // Module
        (function (mvc) {
            var DocumentFragmentElementView = (function () {
                function DocumentFragmentElementView(_fragment, _container, _prepend, _id) {
                    this._fragment = _fragment;
                    this._container = _container;
                    this._prepend = _prepend;
                    this._id = _id;
                    this._attached = false;
                    if (this._container == null) {
                        throw new Error("no container!");
                    }
                }
                DocumentFragmentElementView.createFromHTML = function (html, container, prepend, id) {
                    var fragment = document.createDocumentFragment();
                    var element = document.createElement("div");
                    if (html != null) {
                        element.innerHTML = html;
                    }
                    var childNodes = element.childNodes;
                    for (var i in childNodes) {
                        var childNode = childNodes[i];
                        if (childNode instanceof Element) {
                            //element.removeChild(childNode);
                            // don't actually need to clone it
                            //var clone:Element = <any>childNode;
                            var clone = childNode.cloneNode(true);
                            clone.setAttribute("view_id", id);
                            fragment.appendChild(clone);
                        }
                    }

                    return new DocumentFragmentElementView(fragment, container, prepend, id);
                };

                DocumentFragmentElementView.prototype.attach = function () {
                    var containerElement = this._container.resolve();
                    if (containerElement == null) {
                        throw this._container;
                    }
                    if (this._prepend) {
                        containerElement.insertBefore(this._fragment, containerElement.firstChild);
                    } else {
                        containerElement.appendChild(this._fragment);
                    }
                    this._attached = true;
                };

                DocumentFragmentElementView.prototype.detach = function () {
                    var elements = this.getRoots();
                    var container = this._container.resolve();
                    for (var i in elements) {
                        var element = elements[i];
                        container.removeChild(element);
                    }
                    this._attached = false;
                    /* NO?!
                    var childNodes = this._fragment.childNodes;
                    for (var i in childNodes) {
                    var childNode = childNodes[i];
                    container.removeChild(childNode);
                    }
                    */
                };

                DocumentFragmentElementView.prototype.layout = function () {
                    return false;
                };

                DocumentFragmentElementView.prototype.getRoots = function () {
                    var roots = [];
                    var childNodes;
                    if (this._attached) {
                        var container = this._container.resolve();
                        childNodes = container.childNodes;
                    } else {
                        childNodes = this._fragment.childNodes;
                    }
                    for (var i in childNodes) {
                        var childNode = childNodes[i];
                        if (childNode instanceof Element && childNode.getAttribute("view_id") == this._id) {
                            roots.push(childNode);
                        }
                    }
                    return roots;
                    //return this.getChildren();
                };
                return DocumentFragmentElementView;
            })();
            mvc.DocumentFragmentElementView = DocumentFragmentElementView;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="IElementViewFactory.ts"/>
///<reference path="DocumentFragmentElementView.ts"/>
///<reference path="IElementReference.ts"/>
///<reference path="IElementView"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        // Module
        (function (mvc) {
            /**
            * constant to allow us to create unique ids for the divs
            */
            var divElementCount = 0;

            var DocumentFragmentElementViewFactory = (function () {
                function DocumentFragmentElementViewFactory(_html) {
                    this._html = _html;
                    if (this._html == null) {
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
                    return templa.dom.mvc.DocumentFragmentElementView.createFromHTML(html, container, prepend, id);
                };
                return DocumentFragmentElementViewFactory;
            })();
            mvc.DocumentFragmentElementViewFactory = DocumentFragmentElementViewFactory;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="IElementReference.ts"/>
///<reference path="IElementView.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        // Module
        (function (mvc) {
            // Class
            var ModeElementViewProxy = (function () {
                // Constructor
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
                    // check ratio
                    var ratio = window.innerWidth / window.innerHeight;
                    var needsExternalLayout;
                    var mode = this._modeFunction(this._container);
                    if (mode != this._currentMode) {
                        needsExternalLayout = true;
                    } else {
                        needsExternalLayout = this._proxied.layout();
                    }
                    return needsExternalLayout;
                };
                return ModeElementViewProxy;
            })();
            mvc.ModeElementViewProxy = ModeElementViewProxy;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="IElementViewFactory.ts"/>
///<reference path="IElementView"/>
///<reference path="IElementReference"/>
///<reference path="ModeElementViewProxy.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        // Module
        (function (mvc) {
            // Class
            var ModeElementViewFactoryProxy = (function () {
                // Constructor
                function ModeElementViewFactoryProxy(_modeFunction, _modesToFactories) {
                    this._modeFunction = _modeFunction;
                    this._modesToFactories = _modesToFactories;
                }
                ModeElementViewFactoryProxy.prototype.create = function (container, prepend) {
                    var mode = this._modeFunction(container);
                    var factory = this._modesToFactories[mode];
                    var result;
                    if (factory != null) {
                        var view = factory.create(container, prepend);
                        result = new templa.dom.mvc.ModeElementViewProxy(container, view, mode, this._modeFunction);
                    } else {
                        result = null;
                    }
                    return result;
                };
                return ModeElementViewFactoryProxy;
            })();
            mvc.ModeElementViewFactoryProxy = ModeElementViewFactoryProxy;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="IElementViewFactory.ts"/>
///<reference path="DocumentFragmentElementViewFactory.ts"/>
///<reference path="IElementReference.ts"/>
///<reference path="IElementView.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        ///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
        // Module
        (function (mvc) {
            // Class
            var TemplateElementViewFactory = (function (_super) {
                __extends(TemplateElementViewFactory, _super);
                // Constructor
                function TemplateElementViewFactory(_templateSource, _options) {
                    _super.call(this, null);
                    this._templateSource = _templateSource;
                    this._options = _options;
                }
                TemplateElementViewFactory.createFromString = function (templateString, loadables, options) {
                    var templateSource = new templa.template.StringHandlebarsTemplateSource(templateString);
                    if (loadables != null) {
                        loadables.push(templateSource);
                    }
                    return new TemplateElementViewFactory(templateSource, options);
                };

                TemplateElementViewFactory.createFromURL = function (templateURL, loadables, options) {
                    var templateSource = new templa.template.ExternalHandlebarsTemplateSource(templateURL);
                    if (loadables != null) {
                        loadables.push(templateSource);
                    }
                    return new TemplateElementViewFactory(templateSource, options);
                };

                TemplateElementViewFactory.prototype.create = function (container, prepend, extraOptions) {
                    var options = {};
                    if (this._options != null) {
                        for (var key in this._options) {
                            var value = this._options[key];
                            options[key] = value;
                        }
                    }
                    if (extraOptions != null) {
                        for (var key in extraOptions) {
                            var value = extraOptions[key];
                            options[key] = value;
                        }
                    }
                    var template = this._templateSource.resolve();
                    var html = template(options);
                    return this._createDiv(container, prepend, html);
                };
                return TemplateElementViewFactory;
            })(templa.dom.mvc.DocumentFragmentElementViewFactory);
            mvc.TemplateElementViewFactory = TemplateElementViewFactory;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="IElementReference.ts"/>
///<reference path="IElementView.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        // Module
        (function (mvc) {
            // Class
            var ViewRootElementReference = (function () {
                // Constructor
                function ViewRootElementReference(_view) {
                    this._view = _view;
                }
                ViewRootElementReference.prototype.resolve = function () {
                    return this._view.getRoots()[0];
                };
                return ViewRootElementReference;
            })();
            mvc.ViewRootElementReference = ViewRootElementReference;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../AbstractElementController.ts"/>
///<reference path="../ViewRootElementReference.ts"/>
///<reference path="../IElementReference.ts"/>
///<reference path="../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            // Module
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
                        // load up the controllers
                        this.clear(false);
                        var compositeControllerModel = model;
                        var controllers = compositeControllerModel.getControllers();
                        for (var i in controllers) {
                            var controller = controllers[i];
                            this._add(controller, false, false);
                        }
                        this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, true));
                        this.layout();
                    };

                    AbstractCompositeElementController.prototype.clear = function (fireEvent) {
                        if (this._controllers.length > 0) {
                            var state = this.getState();
                            for (var i in this._controllers) {
                                var controller = this._controllers[i];

                                // check state
                                if (state >= templa.mvc.ControllerStateInitialized) {
                                    if (state >= templa.mvc.ControllerStateStarted) {
                                        controller.removeOnChangeListener(this._controllerOnChangeListener);
                                        controller.stop();
                                    }
                                    controller.destroy();
                                }
                            }
                            if (fireEvent) {
                                this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, true));
                            }
                            this._controllers = [];
                        }
                    };

                    AbstractCompositeElementController.prototype._doStart = function () {
                        var result = _super.prototype._doStart.call(this);
                        for (var i in this._controllers) {
                            var controller = this._controllers[i];
                            result = result && controller.start();
                        }
                        return result;
                    };

                    AbstractCompositeElementController.prototype._doStop = function () {
                        var result = _super.prototype._doStop.call(this);
                        for (var i in this._controllers) {
                            var controller = this._controllers[i];
                            result = result && controller.stop();
                        }
                        return result;
                    };

                    AbstractCompositeElementController.prototype._doInit = function () {
                        var result = _super.prototype._doInit.call(this);
                        for (var i in this._controllers) {
                            var controller = this._controllers[i];
                            var controllerContainer = this.getControllerContainer(controller);
                            result = result && controller.init(controllerContainer, false);
                        }
                        return result;
                    };

                    AbstractCompositeElementController.prototype._doDestroy = function (detachView) {
                        var result = true;
                        for (var i in this._controllers) {
                            var controller = this._controllers[i];

                            // NOTE setting detach view to false will yield some performance benefits since we will just trim the entire tree in one hit (at the parent)
                            // TODO are there cases where the view heirarchy does not reflect the controller heirarchy? (I hope not)
                            result = controller.destroy(false) && result;
                        }

                        // destroy our view at the end, otherwise the children cannot remove themselves from an empty view
                        result = _super.prototype._doDestroy.call(this, detachView) && result;
                        return result;
                    };

                    AbstractCompositeElementController.prototype._add = function (controller, fireEvent, layout, prepend) {
                        this._controllers.push(controller);

                        var container = this.getControllerContainer(controller);
                        if (container == null) {
                            throw "no container!";
                        }
                        var state = this.getState();
                        if (state >= templa.mvc.ControllerStateInitialized) {
                            controller.init(container, prepend);
                            if (state >= templa.mvc.ControllerStateStarted) {
                                controller.addOnChangeListener(this._controllerOnChangeListener);
                                controller.start();
                            }
                        }
                        if (fireEvent != false) {
                            this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, true));
                        }
                        if (layout != false) {
                            this.layout();
                        }
                    };

                    AbstractCompositeElementController.prototype._remove = function (controller, detachView, layout) {
                        var removed = templa.util.Arrays.removeElement(this._controllers, controller);
                        if (removed) {
                            var state = this.getState();
                            if (state >= templa.mvc.ControllerStateInitialized) {
                                if (state >= templa.mvc.ControllerStateStarted) {
                                    controller.stop();
                                    controller.removeOnChangeListener(this._controllerOnChangeListener);
                                }
                                controller.destroy(detachView);
                            }
                            this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, true));
                            if (layout != false) {
                                this.layout();
                            }
                        }
                    };

                    AbstractCompositeElementController.prototype._handleModelChangeEvent = function (event) {
                        _super.prototype._handleModelChangeEvent.call(this, event);
                        this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, true));
                    };

                    AbstractCompositeElementController.prototype.getControllerContainer = function (controller) {
                        return new templa.dom.mvc.ViewRootElementReference(this._view);
                        ;
                    };

                    AbstractCompositeElementController.prototype.getCommands = function () {
                        var commands = [];
                        for (var i in this._controllers) {
                            var controller = this._controllers[i];
                            var controllerCommands = controller.getCommands();
                            if (controllerCommands != null) {
                                templa.util.Arrays.pushAll(commands, controllerCommands);
                            }
                        }
                        return commands;
                    };

                    AbstractCompositeElementController.prototype.getTitle = function () {
                        var title = null;
                        for (var i in this._controllers) {
                            var controller = this._controllers[i];
                            title = controller.getTitle();
                            if (title != null) {
                                break;
                            }
                        }
                        return title;
                    };

                    AbstractCompositeElementController.prototype.layout = function () {
                        _super.prototype.layout.call(this);

                        for (var i in this._controllers) {
                            var controller = this._controllers[i];
                            controller.layout();
                        }
                    };
                    return AbstractCompositeElementController;
                })(templa.dom.mvc.AbstractElementController);
                composite.AbstractCompositeElementController = AbstractCompositeElementController;
            })(mvc.composite || (mvc.composite = {}));
            var composite = mvc.composite;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="IJQuerySelectorHandler.ts"/>
///<reference path="../IElementReference.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            ///<reference path="../../../../../build/defs/jquery.d.ts"/>
            ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
            // Module
            (function (jquery) {
                // Class
                var JQueryElementReference = (function () {
                    // Constructor
                    function JQueryElementReference(_selectorHandler, _selector) {
                        this._selectorHandler = _selectorHandler;
                        this._selector = _selector;
                    }
                    JQueryElementReference.prototype.resolve = function () {
                        var query = this._selectorHandler.$(this._selector);
                        var result;
                        if (query.length > 0) {
                            result = query.get()[0];
                        } else {
                            result = null;
                        }
                        return result;
                    };
                    return JQueryElementReference;
                })();
                jquery.JQueryElementReference = JQueryElementReference;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="IJQuerySelectorHandler.ts"/>
///<reference path="JQueryElementReference.ts"/>
///<reference path="../AbstractElementController.ts"/>
///<reference path="../DirectElementReference.ts"/>
///<reference path="../IElementViewFactory.ts"/>
///<reference path="../IElementReference.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            ///<reference path="../../../../../build/defs/jquery.d.ts"/>
            ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
            // Module
            (function (jquery) {
                // Class
                var AbstractJQueryController = (function (_super) {
                    __extends(AbstractJQueryController, _super);
                    // Constructor
                    function AbstractJQueryController(_viewFactory) {
                        _super.call(this, _viewFactory);
                    }
                    AbstractJQueryController.prototype.$ = function (selector, roots) {
                        // do a careful jquery (only owned elements)
                        if (roots == null) {
                            roots = this._view.getRoots();
                        }

                        // TODO I dislike parsing the selector twice, I also dislike marching the results twice though
                        if (selector) {
                            var self = $(roots).filter(selector);
                            return $(roots).find(selector).add(self);
                        } else {
                            return $(roots);
                        }
                    };

                    AbstractJQueryController.prototype.$reference = function (selector) {
                        // too slow!
                        //return new JQueryElementReference(this, selector);
                        var query = this.$(selector);
                        var result;
                        if (query.length > 0) {
                            result = new templa.dom.mvc.DirectElementReference(query.get(0));
                        } else {
                            result = null;
                        }
                        return result;
                    };
                    return AbstractJQueryController;
                })(templa.dom.mvc.AbstractElementController);
                jquery.AbstractJQueryController = AbstractJQueryController;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../IElementView.ts"/>
///<reference path="../IElementReference.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            ///<reference path="../../../../../build/defs/jquery.d.ts"/>
            ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
            // Module
            (function (jquery) {
                // Class
                var BorrowedElementView = (function () {
                    // Constructor
                    function BorrowedElementView(_container, _selector) {
                        this._container = _container;
                        this._selector = _selector;
                        if (this._container == null) {
                            throw "no container!";
                        }
                    }
                    BorrowedElementView.prototype.getRoots = function () {
                        var result;
                        if (this._selector != null) {
                            var query = $([this._container.resolve()]).select(this._selector);
                            result = [];
                            for (var i = 0; i < query.length; i++) {
                                result.push(query.get(i));
                            }
                        } else {
                            result = [this._container.resolve()];
                        }
                        return result;
                    };

                    BorrowedElementView.prototype.attach = function () {
                        // do nothing, it's already attached
                    };

                    BorrowedElementView.prototype.detach = function () {
                        // do nothing, it's someone else's job
                    };

                    BorrowedElementView.prototype.layout = function () {
                        // nope
                        return false;
                    };
                    return BorrowedElementView;
                })();
                jquery.BorrowedElementView = BorrowedElementView;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="BorrowedElementView.ts"/>
///<reference path="../IElementViewFactory.ts"/>
///<reference path="../IElementReference.ts"/>
///<reference path="../IElementView.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            ///<reference path="../../../../../build/defs/jquery.d.ts"/>
            ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
            // Module
            (function (jquery) {
                // Class
                var BorrowedElementViewFactory = (function () {
                    // Constructor
                    function BorrowedElementViewFactory(_selector) {
                        this._selector = _selector;
                    }
                    BorrowedElementViewFactory.prototype.create = function (container, prefix) {
                        return new templa.dom.mvc.jquery.BorrowedElementView(container, this._selector);
                    };
                    return BorrowedElementViewFactory;
                })();
                jquery.BorrowedElementViewFactory = BorrowedElementViewFactory;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../IElementView.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            ///<reference path="../../../../../build/defs/jquery.d.ts"/>
            ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
            // Module
            (function (jquery) {
                // Class
                var DimensionSettingElementViewProxy = (function () {
                    // Constructor
                    function DimensionSettingElementViewProxy(_proxied, _variableDimensionSelector, _fixedWidthSelectors, _fixedHeightSelectors, _widthAttribute, _heightAttribute, _maxHeightSelectors) {
                        this._proxied = _proxied;
                        this._variableDimensionSelector = _variableDimensionSelector;
                        this._fixedWidthSelectors = _fixedWidthSelectors;
                        this._fixedHeightSelectors = _fixedHeightSelectors;
                        this._widthAttribute = _widthAttribute;
                        this._heightAttribute = _heightAttribute;
                        this._maxHeightSelectors = _maxHeightSelectors;
                        if (this._widthAttribute == null) {
                            this._widthAttribute = "width";
                        }
                        if (this._heightAttribute == null) {
                            this._heightAttribute = "height";
                        }
                    }
                    DimensionSettingElementViewProxy.prototype.getRoots = function () {
                        return this._proxied.getRoots();
                    };

                    DimensionSettingElementViewProxy.prototype.attach = function () {
                        this._proxied.attach();

                        // layout
                        this.layout();
                    };

                    DimensionSettingElementViewProxy.prototype.detach = function () {
                        this._proxied.detach();
                    };

                    DimensionSettingElementViewProxy.prototype.layout = function () {
                        var result = this._proxied.layout();
                        var variableDimensionElement = $(this.getRoots());
                        if (this._variableDimensionSelector != null) {
                            variableDimensionElement = variableDimensionElement.find(this._variableDimensionSelector);
                        }
                        if (this._fixedHeightSelectors != null) {
                            var fixedHeight = 0;
                            for (var i in this._fixedHeightSelectors) {
                                var fixedHeightSelector = this._fixedHeightSelectors[i];
                                var fixedHeightElement = $(fixedHeightSelector);
                                fixedHeight += fixedHeightElement.outerHeight(true);
                            }
                            var windowHeight = window.innerHeight;
                            var height = windowHeight - fixedHeight;
                            if (this._maxHeightSelectors != null) {
                                var maxHeight = height;
                                for (var i in this._maxHeightSelectors) {
                                    var maxHeightSelector = this._maxHeightSelectors[i];
                                    var allVariableDimensionElements = $(maxHeightSelector);
                                    var newHeight = Math.max.apply(null, allVariableDimensionElements.map(function () {
                                        return $(this).height();
                                    }).get());
                                    if (newHeight > maxHeight) {
                                        maxHeight = newHeight;
                                    }
                                }
                                if (height < maxHeight) {
                                    height = maxHeight;
                                }
                            }
                            variableDimensionElement.css(this._heightAttribute, height + "px");
                        }
                        if (this._fixedWidthSelectors != null) {
                            var fixedWidth = 0;
                            for (var i in this._fixedWidthSelectors) {
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
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="DimensionSettingElementViewProxy.ts"/>
///<reference path="../IElementViewFactory.ts"/>
///<reference path="../IElementView.ts"/>
///<reference path="../IElementReference.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            ///<reference path="../../../../../build/defs/jquery.d.ts"/>
            ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
            // Module
            (function (jquery) {
                // Class
                var DimensionSettingElementViewProxyFactory = (function () {
                    // Constructor
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
                        return new templa.dom.mvc.jquery.DimensionSettingElementViewProxy(proxied, this._variableDimensionSelector, this._fixedWidthSelectors, this._fixedHeightSelectors, this._widthAttribute, this._heightAttribute, this._maxHeightSelectors);
                    };
                    return DimensionSettingElementViewProxyFactory;
                })();
                jquery.DimensionSettingElementViewProxyFactory = DimensionSettingElementViewProxyFactory;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="IJQuerySelectorHandler.ts"/>
///<reference path="../IElementView.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            ///<reference path="../../../../../build/defs/jquery.d.ts"/>
            ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
            // Module
            (function (jquery) {
                var ElementViewJQuerySelectorHandler = (function () {
                    function ElementViewJQuerySelectorHandler(_view, _excludedViews) {
                        this._view = _view;
                        this._excludedViews = _excludedViews;
                    }
                    ElementViewJQuerySelectorHandler.prototype.$ = function (selector) {
                        // do a careful jquery (only owned elements)
                        var roots = this._view.getRoots();

                        // TODO I dislike parsing the selector twice, I also dislike marching the results twice though
                        var self = $(roots);
                        var query;
                        if (selector) {
                            query = $(roots).find(selector);
                            if (this._excludedViews != null) {
                                var allChildRoots = [];
                                for (var i in this._excludedViews) {
                                    var excludedView = this._excludedViews[i];
                                    templa.util.Arrays.pushAll(allChildRoots, excludedView.getRoots());
                                }

                                // selector goes first as checking the parenthood is quite expensive
                                query = query.filter(function (index) {
                                    var valid = true;
                                    var e = this;
                                    while (e != null) {
                                        if (roots.indexOf(e) >= 0) {
                                            break;
                                        } else if (allChildRoots.indexOf(e) >= 0) {
                                            valid = false;
                                            break;
                                        } else {
                                            e = e.parentNode;
                                        }
                                    }
                                    return valid;
                                });
                            }

                            self = self.filter(selector);
                            query = query.add(self);
                        } else {
                            query = self;
                        }
                        return query;
                    };
                    return ElementViewJQuerySelectorHandler;
                })();
                jquery.ElementViewJQuerySelectorHandler = ElementViewJQuerySelectorHandler;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../IElementView.ts"/>
///<reference path="../IElementReference.ts"/>
///<reference path="../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            // Module
            (function (jquery) {
                var RotatedElementViewProxy = (function () {
                    function RotatedElementViewProxy(_container, _useContainer, _prepend, _proxied, _root) {
                        this._container = _container;
                        this._useContainer = _useContainer;
                        this._prepend = _prepend;
                        this._proxied = _proxied;
                        this._root = _root;
                    }
                    RotatedElementViewProxy.prototype.getRoots = function () {
                        if (this._root != null) {
                            return [this._root];
                        } else {
                            return this._proxied.getRoots();
                        }
                    };

                    RotatedElementViewProxy.prototype.attach = function () {
                        this._proxied.attach();
                        if (this._root != null) {
                            if (this._prepend) {
                                var element = this._container.resolve();
                                element.insertBefore(this._root, element.firstElementChild);
                            } else {
                                this._container.resolve().appendChild(this._root);
                            }
                        }
                    };

                    RotatedElementViewProxy.prototype.detach = function () {
                        this._proxied.detach();
                        if (this._root != null) {
                            this._container.resolve().removeChild(this._root);
                        }
                    };

                    RotatedElementViewProxy.prototype.layout = function () {
                        var result = this._proxied.layout();
                        if (!result) {
                            // size off inner value
                            var toSize;
                            $(this._root).removeAttr("width").removeAttr("height").removeAttr("margin-top").removeAttr("margin-bottom");
                            var query = $(this._proxied.getRoots());
                            var width = query.width();
                            var height = query.height();
                            if (this._useContainer) {
                                toSize = this._container.resolve();
                                if (this._root != null) {
                                    $(this._root).width(height).height(width).css("margin-top", Math.round(width / 2) + "px").css("margin-bottom", "-" + Math.round(width / 2) + "px");
                                }
                            } else {
                                toSize = this._root;
                            }
                            $(toSize).width(height).height(width);
                        }
                        return result;
                    };
                    return RotatedElementViewProxy;
                })();
                jquery.RotatedElementViewProxy = RotatedElementViewProxy;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="RotatedElementViewProxy.ts"/>
///<reference path="../IElementReference.ts"/>
///<reference path="../IElementView.ts"/>
///<reference path="../IElementViewFactory.ts"/>
///<reference path="../DirectElementReference.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
            // Module
            (function (jquery) {
                var RotatedElementViewProxyFactory = (function () {
                    function RotatedElementViewProxyFactory(_proxied, _useContainer) {
                        this._proxied = _proxied;
                        this._useContainer = _useContainer;
                    }
                    RotatedElementViewProxyFactory.prototype.create = function (container, prepend) {
                        var element = document.createElement("div");
                        var proxyContainer = new templa.dom.mvc.DirectElementReference(element);
                        var proxied = this._proxied.create(proxyContainer, false);
                        return new templa.dom.mvc.jquery.RotatedElementViewProxy(container, this._useContainer, prepend, proxied, element);
                    };
                    return RotatedElementViewProxyFactory;
                })();
                jquery.RotatedElementViewProxyFactory = RotatedElementViewProxyFactory;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../../IElementView.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            (function (jquery) {
                ///<reference path="../../../../../../build/defs/jquery.d.ts"/>
                ///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
                // Module
                (function (command) {
                    // Class
                    var CommandJQueryViewDescription = (function () {
                        // Constructor
                        function CommandJQueryViewDescription(_view, _actionElementSelector) {
                            this._view = _view;
                            this._actionElementSelector = _actionElementSelector;
                        }
                        CommandJQueryViewDescription.prototype.getView = function () {
                            return this._view;
                        };

                        CommandJQueryViewDescription.prototype.getActionElementSelector = function () {
                            return this._actionElementSelector;
                        };
                        return CommandJQueryViewDescription;
                    })();
                    command.CommandJQueryViewDescription = CommandJQueryViewDescription;
                })(jquery.command || (jquery.command = {}));
                var command = jquery.command;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../../IElementView.ts"/>
///<reference path="CommandJQueryViewDescription.ts"/>
///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../IElementReference.ts"/>
///<reference path="ICommandJQueryViewDescriptionFactory.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            (function (jquery) {
                ///<reference path="../../../../../../build/defs/jquery.d.ts"/>
                ///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
                // Module
                (function (command) {
                    // Class
                    var IdDelegatingCommandJQueryViewDescriptionFactory = (function () {
                        // Constructor
                        function IdDelegatingCommandJQueryViewDescriptionFactory(_defaultDescriptionFactory, _idsToDescriptionFactories) {
                            this._defaultDescriptionFactory = _defaultDescriptionFactory;
                            this._idsToDescriptionFactories = _idsToDescriptionFactories;
                        }
                        IdDelegatingCommandJQueryViewDescriptionFactory.prototype.create = function (container, command) {
                            var factory = this._idsToDescriptionFactories[command.getId()];
                            if (factory == null) {
                                factory = this._defaultDescriptionFactory;
                            }
                            return factory.create(container, command);
                        };
                        return IdDelegatingCommandJQueryViewDescriptionFactory;
                    })();
                    command.IdDelegatingCommandJQueryViewDescriptionFactory = IdDelegatingCommandJQueryViewDescriptionFactory;
                })(jquery.command || (jquery.command = {}));
                var command = jquery.command;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="ICommandJQueryViewDescriptionFactory.ts"/>
///<reference path="CommandJQueryViewDescription.ts"/>
///<reference path="../../DocumentFragmentElementView.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            (function (jquery) {
                ///<reference path="../../../../../../build/defs/jquery.d.ts"/>
                ///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
                // Module
                (function (command) {
                    /**
                    * constant to allow us to create unique ids for the divs
                    */
                    var templateCommandElementCount = 0;

                    // Class
                    var TemplateCommandJQueryViewDescriptionFactory = (function () {
                        // Constructor
                        function TemplateCommandJQueryViewDescriptionFactory(_templateSource, _options) {
                            this._templateSource = _templateSource;
                            this._options = _options;
                        }
                        TemplateCommandJQueryViewDescriptionFactory.createFromString = function (templateString, loadables, options) {
                            var templateSource = new templa.template.StringHandlebarsTemplateSource(templateString);
                            if (loadables != null) {
                                loadables.push(templateSource);
                            }
                            return new TemplateCommandJQueryViewDescriptionFactory(templateSource, options);
                        };

                        TemplateCommandJQueryViewDescriptionFactory.createFromURL = function (templateURL, loadables, options) {
                            var templateSource = new templa.template.ExternalHandlebarsTemplateSource(templateURL);
                            if (loadables != null) {
                                loadables.push(templateSource);
                            }
                            return new TemplateCommandJQueryViewDescriptionFactory(templateSource, options);
                        };

                        TemplateCommandJQueryViewDescriptionFactory.prototype.create = function (_container, _command) {
                            var count = templateCommandElementCount;
                            templateCommandElementCount++;
                            var id = "__command_template_element_id_" + count;
                            var options = { command: _command };

                            //options[this._idAttributeName] = id;
                            if (this._options != null) {
                                for (var key in this._options) {
                                    var value = this._options[key];
                                    options[key] = value;
                                }
                            }
                            var template = this._templateSource.resolve();
                            var html = template(options);
                            var view = templa.dom.mvc.DocumentFragmentElementView.createFromHTML(html, _container, false, id);
                            return new templa.dom.mvc.jquery.command.CommandJQueryViewDescription(view, "[view_id='" + id + "']");
                        };
                        return TemplateCommandJQueryViewDescriptionFactory;
                    })();
                    command.TemplateCommandJQueryViewDescriptionFactory = TemplateCommandJQueryViewDescriptionFactory;
                })(jquery.command || (jquery.command = {}));
                var command = jquery.command;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../AbstractJQueryController.ts"/>
///<reference path="ICommandJQueryViewDescriptionFactory.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            (function (jquery) {
                ///<reference path="../../../../../../build/defs/jquery.d.ts"/>
                ///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
                // Module
                (function (command) {
                    // Class
                    var ToolbarCommandJQueryController = (function (_super) {
                        __extends(ToolbarCommandJQueryController, _super);
                        // Constructor
                        function ToolbarCommandJQueryController(_viewFactory, _commandViewDescriptionFactory, _backContainerSelector, _generalContainerSelector) {
                            _super.call(this, _viewFactory);
                            this._commandViewDescriptionFactory = _commandViewDescriptionFactory;
                            this._backContainerSelector = _backContainerSelector;
                            this._generalContainerSelector = _generalContainerSelector;

                            this._backViews = [];
                            this._generalViews = [];
                        }
                        ToolbarCommandJQueryController.prototype._doDestroy = function (detachView) {
                            if (detachView == false) {
                                // TODO disable onclicks
                                this._backViews = [];
                                this._generalViews = [];
                            } else {
                                this._clear();
                            }
                            var result = _super.prototype._doDestroy.call(this, detachView);
                            return result;
                        };

                        ToolbarCommandJQueryController.prototype._detachViews = function () {
                            for (var i in this._backViews) {
                                var backView = this._backViews[i];
                                backView.detach();
                            }

                            for (var i in this._generalViews) {
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

                            for (var i in commands) {
                                var command = commands[i];
                                var container;
                                var selector;
                                var views;
                                if (command.getCommandType() == templa.mvc.CommandTypeBack) {
                                    selector = this._backContainerSelector;
                                    views = this._backViews;
                                } else {
                                    selector = this._generalContainerSelector;
                                    views = this._generalViews;
                                }
                                container = this.$reference(selector);
                                if (container == null) {
                                    throw "no container for selector " + selector;
                                }
                                var actionElementView = this._commandViewDescriptionFactory.create(container, command);
                                var actionElementSelector = actionElementView.getActionElementSelector();
                                var view = actionElementView.getView();
                                view.attach();
                                var actionElements = this.$(actionElementSelector, view.getRoots());
                                actionElements.click(function () {
                                    // hope this works
                                    (command.getAction())();
                                });
                                views.push(view);
                            }
                        };
                        return ToolbarCommandJQueryController;
                    })(templa.dom.mvc.jquery.AbstractJQueryController);
                    command.ToolbarCommandJQueryController = ToolbarCommandJQueryController;
                })(jquery.command || (jquery.command = {}));
                var command = jquery.command;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../AbstractJQueryController.ts"/>
///<reference path="../IJQuerySelectorHandler.ts"/>
///<reference path="../JQueryElementReference.ts"/>
///<reference path="../../ViewRootElementReference.ts"/>
///<reference path="../../IElementView.ts"/>
///<reference path="../../IElementReference.ts"/>
///<reference path="../../DirectElementReference.ts"/>
///<reference path="../../composite/AbstractCompositeElementController.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            (function (jquery) {
                ///<reference path="../../../../../../build/defs/jquery.d.ts"/>
                ///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
                // Module
                (function (composite) {
                    var AbstractCompositeJQueryController = (function (_super) {
                        __extends(AbstractCompositeJQueryController, _super);
                        function AbstractCompositeJQueryController(viewFactory) {
                            _super.call(this, viewFactory);
                        }
                        AbstractCompositeJQueryController.prototype.$ = function (selector) {
                            // do a careful jquery (only owned elements)
                            var roots = this._view.getRoots();
                            var allChildRoots = [];
                            for (var i in this._controllers) {
                                var controller = this._controllers[i];
                                var view = controller.getView();
                                if (view != null) {
                                    // we can get odd situations where the owner controller is initialized, but the children are not
                                    var childRoots = view.getRoots();
                                    if (childRoots != null) {
                                        templa.util.Arrays.pushAll(allChildRoots, childRoots);
                                    }
                                }
                            }

                            // selector goes first as checking the parenthood is quite expensive
                            var query = $(roots).find(selector).filter(function (index) {
                                var valid = true;
                                var e = this;
                                while (e != null) {
                                    if (roots.indexOf(e) >= 0) {
                                        break;
                                    } else if (allChildRoots.indexOf(e) >= 0) {
                                        valid = false;
                                        break;
                                    } else {
                                        e = e.parentNode;
                                    }
                                }
                                return valid;
                            });

                            // we inherently know that our roots are valid (no need to check lineage)
                            var self = $(roots).filter(selector);
                            query = query.add(self);
                            return query;
                        };

                        AbstractCompositeJQueryController.prototype.$reference = function (selector) {
                            // too slow!
                            //return new JQueryElementReference(this, selector);
                            var query = this.$(selector);
                            var result;
                            if (query.length > 0) {
                                result = new templa.dom.mvc.DirectElementReference(query.get(0));
                            } else {
                                result = null;
                            }
                            return result;
                        };

                        AbstractCompositeJQueryController.prototype.getControllerContainer = function (controller) {
                            var selector = this.getControllerContainerSelector(controller);
                            var result;
                            if (selector == null) {
                                result = _super.prototype.getControllerContainer.call(this, controller);
                            } else {
                                result = this.$reference(selector);
                            }
                            if (result == null) {
                                throw "no container for selector " + selector;
                            }
                            return result;
                        };

                        AbstractCompositeJQueryController.prototype.getControllerContainerSelector = function (controller) {
                            return null;
                        };
                        return AbstractCompositeJQueryController;
                    })(templa.dom.mvc.composite.AbstractCompositeElementController);
                    composite.AbstractCompositeJQueryController = AbstractCompositeJQueryController;
                })(jquery.composite || (jquery.composite = {}));
                var composite = jquery.composite;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="AbstractCompositeJQueryController.ts"/>
///<reference path="../../IElementViewFactory.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            (function (jquery) {
                ///<reference path="../../../../../../build/defs/jquery.d.ts"/>
                ///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
                // Module
                (function (composite) {
                    // Class
                    var KeyedJQueryController = (function (_super) {
                        __extends(KeyedJQueryController, _super);
                        function KeyedJQueryController(_viewFactory, _keysToSelectors) {
                            _super.call(this, _viewFactory);
                            this._keysToSelectors = _keysToSelectors;
                            if (this._keysToSelectors == null) {
                                this._keysToSelectors = {};
                            }
                        }
                        KeyedJQueryController.prototype.setKeyAndSelector = function (key, selector) {
                            this._keysToSelectors[key] = selector;
                        };

                        KeyedJQueryController.prototype.getControllerContainerSelector = function (controller) {
                            var model = this._model;
                            var key = model.getControllerKey(controller);
                            var selector = this._keysToSelectors[key];
                            if (selector == null && key != null) {
                                selector = key;
                            }

                            return selector;
                        };
                        return KeyedJQueryController;
                    })(templa.dom.mvc.jquery.composite.AbstractCompositeJQueryController);
                    composite.KeyedJQueryController = KeyedJQueryController;
                })(jquery.composite || (jquery.composite = {}));
                var composite = jquery.composite;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="AbstractCompositeJQueryController.ts"/>
///<reference path="../../IElementController.ts"/>
///<reference path="../../IElementView.ts"/>
///<reference path="../../../animation/IElementAnimationFactory.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            (function (jquery) {
                ///<reference path="../../../../../../build/defs/jquery.d.ts"/>
                ///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
                // Module
                (function (composite) {
                    var StackJQueryController = (function (_super) {
                        __extends(StackJQueryController, _super);
                        function StackJQueryController(viewFactory, _animationFactoryBundles) {
                            var _this = this;
                            _super.call(this, viewFactory);
                            this._animationFactoryBundles = _animationFactoryBundles;
                            this.removedAnimatedChildren = [];
                            this._backCommand = new templa.mvc.Command("back", templa.mvc.CommandTypeBack, 1, function () {
                                _this._back();
                            });
                        }
                        StackJQueryController.prototype.setAnimationFactoryBundles = function (_animationFactoryBundles) {
                            this._animationFactoryBundles = _animationFactoryBundles;
                        };

                        StackJQueryController.prototype._handleModelChangeEvent = function (event) {
                            var pushed;
                            var stackChangeDescription = event.lookup(templa.mvc.composite.stackControllerModelEventPushed);
                            if (stackChangeDescription == null) {
                                stackChangeDescription = event.lookup(templa.mvc.composite.stackControllerModelEventPopped);
                                pushed = false;
                            } else {
                                pushed = true;
                            }
                            if (stackChangeDescription != null) {
                                var stackDescription = stackChangeDescription;

                                // remove all the silent ones (if any)
                                var silentRemovedControllers = stackDescription.getSilentRemovedControllers();
                                if (silentRemovedControllers != null) {
                                    for (var i in silentRemovedControllers) {
                                        var silentRemovedController = silentRemovedControllers[i];
                                        this._remove(silentRemovedController, true, false);
                                    }
                                }

                                // add all the silent ones (if any)
                                var silentAddedControllers = stackDescription.getSilentAddedControllers();
                                if (silentAddedControllers != null) {
                                    for (var i in silentAddedControllers) {
                                        var silentAddedController = silentAddedControllers[i];
                                        this._add(silentAddedController, false, false, false);
                                    }
                                }

                                var animationFactoryName;

                                if (pushed) {
                                    animationFactoryName = "pushAnimationFactory";
                                } else {
                                    animationFactoryName = "popAnimationFactory";
                                }

                                var hiddenController = stackDescription.getRemovedController();
                                var hiddenView;
                                if (hiddenController != null) {
                                    var maxState;
                                    if (this.getState() >= templa.mvc.ControllerStateInitialized) {
                                        maxState = templa.mvc.ControllerStateInitialized;
                                        hiddenView = hiddenController.getView();
                                        /*
                                        var roots: Node[] = hiddenView.getRoots();
                                        for (var i in roots) {
                                        var root = roots[i];
                                        var animation = removeAnimationFactory.create(<any>container, <any>root);
                                        animation.addAnimationListener((source: templa.animation.IAnimation, event: templa.animation.AnimationStateChangeEvent) => {
                                        if (event.animationState == templa.animation.animationStateFinished) {
                                        hiddenView.detach();
                                        }
                                        });
                                        this._addAnimation(animation, false);
                                        }
                                        */
                                    } else {
                                        maxState = null;
                                        hiddenView = null;
                                    }
                                    this._remove(hiddenController, hiddenView == null);
                                }

                                var addedController = stackDescription.getAddedController();
                                if (addedController != null) {
                                    this._add(addedController, true, true, !pushed);
                                    var pushedView = addedController.getView();
                                    /*
                                    var roots: Node[] = pushedView.getRoots();
                                    for (var i in roots) {
                                    var root = roots[i];
                                    var animation = addAnimationFactory.create(<any>container, <any>root);
                                    // add it to the controller so it can manage its own animations
                                    pushedController.addAnimation(animation);
                                    }
                                    */
                                }
                                var animated;
                                if (addedController != null || hiddenController != null) {
                                    var animationListener;
                                    if (hiddenView != null) {
                                        animationListener = function (source, event) {
                                            if (event.getAnimationState() == templa.animation.animationStateFinished) {
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
                                if (!animated && hiddenView != null) {
                                    // remove immediately
                                    hiddenView.detach();
                                }
                                this.layout();
                                this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, true));
                            } else {
                                _super.prototype._handleModelChangeEvent.call(this, event);
                            }
                            this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, true));
                        };

                        StackJQueryController.prototype._back = function () {
                            var stackControllerModel = this._model;
                            stackControllerModel.requestPop();
                        };

                        StackJQueryController.prototype.getCommands = function () {
                            var commands = _super.prototype.getCommands.call(this);
                            var stackControllerModel = this._model;
                            if (stackControllerModel != null && stackControllerModel.canPop()) {
                                if (commands == null) {
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
                            for (var i in this._animationFactoryBundles) {
                                var animationFactoryBundle = this._animationFactoryBundles[i];
                                var animationFactory = animationFactoryBundle[animationFactoryName];
                                if (animationFactory != null) {
                                    var selector = animationFactoryBundle.selector;
                                    var jquery = $(roots);
                                    if (selector != null) {
                                        var self = $(roots).filter(selector);
                                        jquery = jquery.find(selector).add(self);
                                    }

                                    // TODO work out which element has a root
                                    var containerElement = this._view.getRoots()[0];
                                    for (var j = 0; j < jquery.length; j++) {
                                        var toAnimate = jquery.get(j);
                                        var animation = animationFactory.create(containerElement, toAnimate);
                                        count++;
                                        result = true;
                                        if (animationCompletionListener != null) {
                                            // aggregate all the animation completions into one callback
                                            animation.addAnimationListener(function (source, event) {
                                                if (event.getAnimationState() == templa.animation.animationStateFinished) {
                                                    completionCount++;
                                                    if (completionCount == count) {
                                                        animationCompletionListener(source, event);
                                                    }
                                                }
                                            });
                                        }
                                        this._addAnimation(animation, false);
                                    }
                                }
                            }
                            if (count == 0 && animationCompletionListener != null) {
                                // animation is complete now
                                animationCompletionListener(null, new templa.animation.AnimationStateChangeEvent(templa.animation.animationStateFinished));
                            }
                            return result;
                        };
                        return StackJQueryController;
                    })(templa.dom.mvc.jquery.composite.AbstractCompositeJQueryController);
                    composite.StackJQueryController = StackJQueryController;
                })(jquery.composite || (jquery.composite = {}));
                var composite = jquery.composite;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../IJQuerySelectorHandler.ts"/>
///<reference path="../../AbstractElementController.ts"/>
///<reference path="../../DirectElementReference.ts"/>
///<reference path="../../ViewRootElementReference.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            (function (jquery) {
                ///<reference path="../../../../../../build/defs/jquery.d.ts"/>
                ///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
                // Module
                (function (list) {
                    var AbstractListJQueryListItem = (function () {
                        function AbstractListJQueryListItem(_controller, _controllerType, _containerView) {
                            this._controller = _controller;
                            this._controllerType = _controllerType;
                            this._containerView = _containerView;
                        }
                        AbstractListJQueryListItem.prototype.getController = function () {
                            return this._controller;
                        };

                        AbstractListJQueryListItem.prototype.getControllerType = function () {
                            return this._controllerType;
                        };

                        AbstractListJQueryListItem.prototype.getContainerView = function () {
                            return this._containerView;
                        };
                        return AbstractListJQueryListItem;
                    })();
                    list.AbstractListJQueryListItem = AbstractListJQueryListItem;

                    // Class
                    var AbstractListJQueryController = (function (_super) {
                        __extends(AbstractListJQueryController, _super);
                        // Constructor
                        function AbstractListJQueryController(viewFactory, _listItemContainerViewFactory) {
                            _super.call(this, viewFactory);
                            this._listItemContainerViewFactory = _listItemContainerViewFactory;
                            this._positionsToListItems = {};
                            this._typesToReusableControllers = {};
                        }
                        AbstractListJQueryController.prototype._initAndStart = function (controller, container) {
                            var state = controller.getState();
                            if (state == templa.mvc.ControllerStateUninitialized) {
                                // initialize it
                                controller.init(container);
                            }
                            this._start(controller);
                        };

                        AbstractListJQueryController.prototype._start = function (controller) {
                            var state = controller.getState();
                            if (state == templa.mvc.ControllerStateInitialized) {
                                // start it
                                controller.start();
                            }
                        };

                        AbstractListJQueryController.prototype._stop = function (controller) {
                            var state = controller.getState();
                            if (state == templa.mvc.ControllerStateStarted) {
                                controller.stop();
                            }
                        };

                        AbstractListJQueryController.prototype._destroy = function (controller) {
                            var state = controller.getState();
                            if (state == templa.mvc.ControllerStateInitialized) {
                                controller.destroy();
                            }
                        };

                        AbstractListJQueryController.prototype._doLoad = function (model) {
                            // unload everything
                            this._clear();

                            var listModel = model;

                            // load everything for now
                            var controllerCount = listModel.getControllerCount();
                            var container = this._getContainer();
                            for (var i = 0; i < controllerCount; i++) {
                                if (this._keepLoading(listModel, i)) {
                                    var controllerType = listModel.getControllerType(i);

                                    // check reusable controllers
                                    var reusableControllers = this._typesToReusableControllers[controllerType];
                                    var reusableController;
                                    if (reusableControllers != null && reusableControllers.length > 0) {
                                        // note, this controller gets removed from the reuse pile regardless of whether it is actually used or not
                                        reusableController = reusableControllers.pop();
                                    } else {
                                        reusableController = null;
                                    }
                                    var controller = listModel.getController(i, reusableController);
                                    var listItemContainer = this._listItemContainerViewFactory.create(container);
                                    listItemContainer.attach();
                                    this._initAndStart(controller, new templa.dom.mvc.ViewRootElementReference(listItemContainer));
                                    this._positionsToListItems[i] = new AbstractListJQueryListItem(controller, controllerType, listItemContainer);
                                } else {
                                    break;
                                }
                            }
                        };

                        AbstractListJQueryController.prototype._keepLoading = function (listModel, position) {
                            return true;
                        };

                        AbstractListJQueryController.prototype._doInit = function () {
                            var result = _super.prototype._doInit.call(this);
                            if (result) {
                                for (var position in this._positionsToListItems) {
                                    var listItem = this._positionsToListItems[position];
                                    var containerView = listItem.getContainerView();
                                    containerView.attach();
                                    var controller = listItem.getController();
                                    controller.init(new templa.dom.mvc.ViewRootElementReference(containerView));
                                }
                            }
                            return result;
                        };

                        AbstractListJQueryController.prototype._doStart = function () {
                            for (var position in this._positionsToListItems) {
                                var listItem = this._positionsToListItems[position];
                                var controller = listItem.getController();
                                this._start(controller);
                            }
                            return _super.prototype._doStart.call(this);
                        };

                        AbstractListJQueryController.prototype._doStop = function () {
                            for (var position in this._positionsToListItems) {
                                var listItem = this._positionsToListItems[position];
                                var controller = listItem.getController();
                                this._stop(controller);
                            }
                            return _super.prototype._doStop.call(this);
                        };

                        AbstractListJQueryController.prototype._doDestroy = function () {
                            // just clear it
                            /*
                            for (var position in this._positionsToListItems) {
                            var listItem: AbstractListJQueryListItem = this._positionsToListItems[position];
                            var controller = listItem.getController();
                            this._destroy(controller);
                            listItem.containerView.detach();
                            }
                            */
                            this._clear();
                            return _super.prototype._doDestroy.call(this);
                        };

                        AbstractListJQueryController.prototype.layout = function () {
                            // TODO layout subordinate controllers;
                            _super.prototype.layout.call(this);
                        };

                        AbstractListJQueryController.prototype._clear = function () {
                            for (var position in this._positionsToListItems) {
                                var listItem = this._positionsToListItems[position];
                                var controller = listItem.getController();
                                this._stop(controller);
                                this._destroy(controller);
                                listItem.getContainerView().detach();
                                var reusableControllers = this._typesToReusableControllers[listItem.getControllerType()];
                                if (reusableControllers == null) {
                                    reusableControllers = [];
                                    this._typesToReusableControllers[listItem.getControllerType()] = reusableControllers;
                                }
                                reusableControllers.push(controller);
                            }

                            // TODO save any discarded controllers for later
                            this._positionsToListItems = {};
                        };

                        // all list items are assumed to go into the same container!
                        AbstractListJQueryController.prototype._getContainer = function () {
                            // just use the root element
                            return this.$reference();
                        };

                        AbstractListJQueryController.prototype.$ = function (selector) {
                            // do a careful jquery (only owned elements)
                            var roots = this._view.getRoots();

                            // we inherently know that our roots are valid (no need to check lineage)
                            var self = $(roots);
                            var query;
                            if (selector != null) {
                                var allChildRoots = [];

                                for (var position in this._positionsToListItems) {
                                    var listItem = this._positionsToListItems[position];
                                    var view = listItem.getContainerView();
                                    if (view != null) {
                                        // we can get odd situations where the owner controller is initialized, but the children are not
                                        var childRoots = view.getRoots();
                                        if (childRoots != null) {
                                            templa.util.Arrays.pushAll(allChildRoots, childRoots);
                                        }
                                    }
                                }

                                // selector goes first as checking the parenthood is quite expensive
                                query = $(roots).find(selector).filter(function (index) {
                                    var valid = true;
                                    var e = this;
                                    while (e != null) {
                                        if (roots.indexOf(e) >= 0) {
                                            break;
                                        } else if (allChildRoots.indexOf(e) >= 0) {
                                            valid = false;
                                            break;
                                        } else {
                                            e = e.parentNode;
                                        }
                                    }
                                    return valid;
                                });
                                self = self.filter(selector);
                                query = query.add(self);
                            } else {
                                query = self;
                            }

                            return query;
                        };

                        AbstractListJQueryController.prototype.$reference = function (selector) {
                            // too slow!
                            //return new JQueryElementReference(this, selector);
                            var query = this.$(selector);
                            var result;
                            if (query.length > 0) {
                                result = new templa.dom.mvc.DirectElementReference(query.get(0));
                            } else {
                                result = null;
                            }
                            return result;
                        };
                        return AbstractListJQueryController;
                    })(templa.dom.mvc.AbstractElementController);
                    list.AbstractListJQueryController = AbstractListJQueryController;
                })(jquery.list || (jquery.list = {}));
                var list = jquery.list;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../AbstractJQueryController.ts"/>
///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            (function (jquery) {
                // Module
                (function (loading) {
                    // Class
                    var AbstractLoadingJQueryController = (function (_super) {
                        __extends(AbstractLoadingJQueryController, _super);
                        function AbstractLoadingJQueryController(viewFactory) {
                            _super.call(this, viewFactory);
                        }
                        AbstractLoadingJQueryController.prototype._doStart = function () {
                            var loadingModel = this._model;
                            var updateRequired = loadingModel.requestStartLoading();
                            if (updateRequired) {
                                // increment load
                                this._increment();
                            }
                            return _super.prototype._doStart.call(this);
                        };

                        AbstractLoadingJQueryController.prototype._increment = function () {
                            var _this = this;
                            // TODO safe setTimeout
                            this._safeTimeout(function () {
                                var loadingModel = _this._model;
                                var updateRequired = loadingModel.update();
                                if (updateRequired) {
                                    _this._increment();
                                }
                            }, 0);
                        };
                        return AbstractLoadingJQueryController;
                    })(templa.dom.mvc.jquery.AbstractJQueryController);
                    loading.AbstractLoadingJQueryController = AbstractLoadingJQueryController;
                })(jquery.loading || (jquery.loading = {}));
                var loading = jquery.loading;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="AbstractLoadingJQueryController.ts"/>
///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/jqueryui.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            (function (jquery) {
                // Module
                (function (loading) {
                    // Class
                    var ProgressBarLoadingJQueryUIController = (function (_super) {
                        __extends(ProgressBarLoadingJQueryUIController, _super);
                        // Constructor
                        function ProgressBarLoadingJQueryUIController(viewFactory, _progressBarSelector) {
                            _super.call(this, viewFactory);
                            this._progressBarSelector = _progressBarSelector;
                        }
                        ProgressBarLoadingJQueryUIController.prototype._doLoad = function (model) {
                            var loadingModel = model;

                            // progressbar is hard coded to have a maximum of 100?
                            var progress = loadingModel.getLoadingProgress();
                            var maximum = loadingModel.getMaximumProgress();
                            var effectiveProgress = Math.round((progress * 100) / maximum);

                            this.$(this._progressBarSelector).progressbar({
                                value: effectiveProgress
                            });
                        };
                        return ProgressBarLoadingJQueryUIController;
                    })(templa.dom.mvc.jquery.loading.AbstractLoadingJQueryController);
                    loading.ProgressBarLoadingJQueryUIController = ProgressBarLoadingJQueryUIController;
                })(jquery.loading || (jquery.loading = {}));
                var loading = jquery.loading;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../../IElementView.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            (function (jquery) {
                // Module
                (function (tab) {
                    // Class
                    var TabBarTabJQueryViewDescription = (function () {
                        // Constructor
                        function TabBarTabJQueryViewDescription(_clickableElementSelector, _styleableElementSelector, _view) {
                            this._clickableElementSelector = _clickableElementSelector;
                            this._styleableElementSelector = _styleableElementSelector;
                            this._view = _view;
                        }
                        TabBarTabJQueryViewDescription.prototype.getClickableElementSelector = function () {
                            return this._clickableElementSelector;
                        };

                        TabBarTabJQueryViewDescription.prototype.getStyleableElementSelector = function () {
                            return this._styleableElementSelector;
                        };

                        TabBarTabJQueryViewDescription.prototype.getView = function () {
                            return this._view;
                        };
                        return TabBarTabJQueryViewDescription;
                    })();
                    tab.TabBarTabJQueryViewDescription = TabBarTabJQueryViewDescription;
                })(jquery.tab || (jquery.tab = {}));
                var tab = jquery.tab;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="TabBarTabJQueryViewDescription.ts"/>
///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="ITabBarTabJQueryViewDescriptionFactory.ts"/>
///<reference path="../../IElementViewFactory.ts"/>
///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            (function (jquery) {
                // Module
                (function (tab) {
                    // Class
                    var MappedTabBarTabJQueryViewDescriptionFactory = (function () {
                        // Constructor
                        function MappedTabBarTabJQueryViewDescriptionFactory(_tabBarIdsToViewFactories, _clickableElementSelector, _styleableElementSelector) {
                            this._tabBarIdsToViewFactories = _tabBarIdsToViewFactories;
                            this._clickableElementSelector = _clickableElementSelector;
                            this._styleableElementSelector = _styleableElementSelector;
                        }
                        MappedTabBarTabJQueryViewDescriptionFactory.prototype.create = function (container, tabBarId) {
                            var viewFactory = this._tabBarIdsToViewFactories[tabBarId];
                            var result;
                            if (viewFactory != null) {
                                var view = viewFactory.create(container);
                                result = new templa.dom.mvc.jquery.tab.TabBarTabJQueryViewDescription(this._clickableElementSelector, this._styleableElementSelector, view);
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
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../AbstractJQueryController.ts"/>
///<reference path="ITabBarTabJQueryViewDescriptionFactory.ts"/>
///<reference path="TabBarTabJQueryViewDescription.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            (function (jquery) {
                ///<reference path="../../../../../../build/defs/jquery.d.ts"/>
                ///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
                // Module
                (function (tab) {
                    // Class
                    var TabBarJQueryController = (function (_super) {
                        __extends(TabBarJQueryController, _super);
                        // Constructor
                        function TabBarJQueryController(_viewFactory, _tabBarTabViewDescriptionFactory, _tabButtonContainerSelector, _selectedTabClass) {
                            _super.call(this, _viewFactory);
                            this._tabBarTabViewDescriptionFactory = _tabBarTabViewDescriptionFactory;
                            this._tabButtonContainerSelector = _tabButtonContainerSelector;
                            this._selectedTabClass = _selectedTabClass;
                            this._tabIdsToDescriptions = {};
                        }
                        TabBarJQueryController.prototype._doLoad = function (model) {
                            var _this = this;
                            // unload existing views
                            this._removeAllTabs();

                            var tabBarModel = model;

                            var tabIds = tabBarModel.getAvailableTabIds();
                            var selectedTabId = tabBarModel.getSelectedTabId();
                            var tabButtonContainer = this.$reference(this._tabButtonContainerSelector);
                            for (var i in tabIds) {
                                var tabId = tabIds[i];
                                var description = this._tabBarTabViewDescriptionFactory.create(tabButtonContainer, tabId);

                                var view = description.getView();
                                view.attach();

                                if (tabId == selectedTabId) {
                                    // add the class
                                    var styleableElements = this.$(description.getStyleableElementSelector(), view.getRoots());
                                    styleableElements.addClass(this._selectedTabClass);
                                }

                                // add in the onclick listener
                                var clickableElements = this.$(description.getClickableElementSelector(), view.getRoots());
                                clickableElements.click(tabId, function (e) {
                                    _this._requestSelectTabId(e.data);
                                });
                                this._tabIdsToDescriptions[tabId] = description;
                            }
                        };

                        TabBarJQueryController.prototype._removeAllTabs = function () {
                            for (var tabId in this._tabIdsToDescriptions) {
                                var description = this._tabIdsToDescriptions[tabId];
                                description.getView().detach();
                            }
                            this._tabIdsToDescriptions = {};
                        };

                        TabBarJQueryController.prototype._requestSelectTabId = function (tabId) {
                            var tabBarModel = this._model;
                            tabBarModel.requestSelectTabId(tabId);
                        };

                        TabBarJQueryController.prototype._selectTab = function (selectedTabId) {
                            for (var tabId in this._tabIdsToDescriptions) {
                                var description = this._tabIdsToDescriptions[tabId];
                                var view = description.getView();
                                var styleableElements = this.$(description.getStyleableElementSelector(), view.getRoots());
                                if (tabId == selectedTabId) {
                                    // add the class
                                    styleableElements.addClass(this._selectedTabClass);
                                } else {
                                    // remove the class
                                    styleableElements.removeClass(this._selectedTabClass);
                                }
                            }
                        };

                        TabBarJQueryController.prototype._handleModelChangeEvent = function (event) {
                            if (event.lookup(templa.mvc.tab.tabBarModelEventSelectedTabChange)) {
                                // special case for the selected tab changing (avoids reloading everything)
                                var tabBarModel = this._model;
                                this._selectTab(tabBarModel.getSelectedTabId());
                            } else {
                                _super.prototype._handleModelChangeEvent.call(this, event);
                            }
                        };
                        return TabBarJQueryController;
                    })(templa.dom.mvc.jquery.AbstractJQueryController);
                    tab.TabBarJQueryController = TabBarJQueryController;
                })(jquery.tab || (jquery.tab = {}));
                var tab = jquery.tab;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
///<reference path="../ElementViewJQuerySelectorHandler.ts"/>
///<reference path="../IJQuerySelectorHandler.ts"/>
///<reference path="../JQueryElementReference.ts"/>
///<reference path="../../IElementController.ts"/>
///<reference path="../../AbstractElementController.ts"/>
///<reference path="../../ViewRootElementReference.ts"/>
var templa;
(function (templa) {
    (function (dom) {
        (function (mvc) {
            (function (jquery) {
                ///<reference path="../../../../../../build/defs/jquery.d.ts"/>
                ///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>
                // Module
                (function (table) {
                    var AbstractTableJQueryController = (function (_super) {
                        __extends(AbstractTableJQueryController, _super);
                        function AbstractTableJQueryController(viewFactory, _rowHeaderViewFactory, _rowSelectorFormat, _columnHeaderViewFactory, _columnSelectorFormat, _tableViewFactory, _cellSelectorFormat) {
                            _super.call(this, viewFactory);
                            this._rowHeaderViewFactory = _rowHeaderViewFactory;
                            this._rowSelectorFormat = _rowSelectorFormat;
                            this._columnHeaderViewFactory = _columnHeaderViewFactory;
                            this._columnSelectorFormat = _columnSelectorFormat;
                            this._tableViewFactory = _tableViewFactory;
                            this._cellSelectorFormat = _cellSelectorFormat;
                        }
                        AbstractTableJQueryController.prototype._doLoad = function (model) {
                            // remove everything
                            this._removeAll();

                            var tableModel = model;
                            var rowCount = tableModel.getRowCount();
                            var columnCount = tableModel.getColumnCount();
                            var rowHeaderDepth = tableModel.getRowHeaderDepth();
                            var columnHeaderDepth = tableModel.getColumnHeaderDepth();

                            this._rowCount = rowCount;
                            this._columnCount = columnCount;

                            var container = new templa.dom.mvc.ViewRootElementReference(this._view);

                            // create the views
                            this._rowHeaderView = this._rowHeaderViewFactory(container, rowCount, rowHeaderDepth);
                            this._rowHeaderView.attach();

                            this._columnHeaderView = this._columnHeaderViewFactory(container, columnCount, columnHeaderDepth);
                            this._columnHeaderView.attach();

                            this._tableView = this._tableViewFactory(container, rowCount, columnCount);
                            this._tableView.attach();

                            // create the headers
                            this._columnHeaders = [];
                            this._leafColumnHeaders = [];
                            var columnHeaderSelectorHandler = new templa.dom.mvc.jquery.ElementViewJQuerySelectorHandler(this._columnHeaderView);
                            for (var i = 0; i < columnCount; i++) {
                                for (var depth = 0; depth < columnHeaderDepth; depth++) {
                                    var columnHeader = tableModel.getColumnHeader(i, depth);
                                    var columnSelector = templa.util.Strings.format(this._columnSelectorFormat, [i, depth]);
                                    var reference = new templa.dom.mvc.jquery.JQueryElementReference(columnHeaderSelectorHandler, columnSelector);
                                    if (columnHeader.getFromIndex() == i) {
                                        var columnHeaderController = columnHeader.getController();

                                        // set the span on cell
                                        var columnSpan = columnHeader.getSpan();
                                        if (columnSpan != null && columnSpan > 1) {
                                            $(reference.resolve()).attr("colspan", columnSpan);
                                        }

                                        var columnHeaderCell = {
                                            container: reference,
                                            controller: columnHeaderController
                                        };
                                        columnHeaderController.init(reference, false);
                                        var view = columnHeaderController.getView();
                                        if (depth == columnHeaderDepth - 1) {
                                            this._leafColumnHeaders.push(columnHeaderCell);
                                        }
                                        columnHeaderController.start();
                                        this._columnHeaders.push(columnHeaderCell);
                                    } else {
                                        // slight problem here, we want a colspan of 0, but that's not going to work, remove should do the trick
                                        $(reference.resolve()).remove();
                                    }
                                }
                            }
                            this._rowHeaders = [];
                            this._leafRowHeaders = [];
                            var rowHeaderSelectorHandler = new templa.dom.mvc.jquery.ElementViewJQuerySelectorHandler(this._rowHeaderView);
                            for (var i = 0; i < rowCount; i++) {
                                for (var depth = 0; depth < rowHeaderDepth; depth++) {
                                    var rowHeader = tableModel.getRowHeader(i, depth);
                                    var rowHeaderSelector = templa.util.Strings.format(this._rowSelectorFormat, [i, depth]);
                                    var reference = new templa.dom.mvc.jquery.JQueryElementReference(rowHeaderSelectorHandler, rowHeaderSelector);
                                    if (rowHeader.getFromIndex() == i) {
                                        var rowHeaderController = rowHeader.getController();

                                        // set the span on cell
                                        var rowSpan = rowHeader.getSpan();
                                        if (rowSpan != null && rowSpan > 1) {
                                            $(reference.resolve()).attr("rowspan", rowSpan);
                                        }

                                        var rowHeaderCell = {
                                            container: reference,
                                            controller: rowHeaderController
                                        };

                                        rowHeaderController.init(reference, false);
                                        var view = rowHeaderController.getView();
                                        if (depth == rowHeaderDepth - 1) {
                                            this._leafRowHeaders.push(rowHeaderCell);
                                        }
                                        rowHeaderController.start();
                                        this._rowHeaders.push(rowHeaderCell);
                                    } else {
                                        // slight problem here, we want a rowspan of 0, but that's not going to work, remove should do the trick
                                        $(reference.resolve()).remove();
                                    }
                                }
                            }

                            // assign the rows and columns
                            this._cells = [];
                            var tableSelectorHandler = new templa.dom.mvc.jquery.ElementViewJQuerySelectorHandler(this._tableView);
                            for (var row = 0; row < rowCount; row++) {
                                var columns = [];
                                for (var col = 0; col < columnCount; col++) {
                                    var cell = tableModel.getCell(row, col);
                                    var cellSelector = templa.util.Strings.format(this._cellSelectorFormat, [row, col]);

                                    //
                                    var reference = new templa.dom.mvc.jquery.JQueryElementReference(tableSelectorHandler, cellSelector);
                                    cell.init(reference, false);
                                    columns.push({
                                        container: reference,
                                        controller: cell
                                    });
                                }
                                this._cells.push(columns);
                            }

                            // make sure eveything is lined up properly
                            this._layoutTable();
                        };

                        AbstractTableJQueryController.prototype._removeAll = function () {
                            this._removeAllFromArray(this._rowHeaders);
                            this._removeAllFromArray(this._columnHeaders);
                            if (this._cells != null) {
                                for (var i in this._cells) {
                                    var row = this._cells[i];
                                    this._removeAllFromArray(row);
                                }
                                this._cells = null;
                            }
                            if (this._rowHeaderView != null) {
                                this._rowHeaderView.detach();
                                this._rowHeaderView = null;
                            }
                            if (this._columnHeaderView != null) {
                                this._columnHeaderView.detach();
                                this._columnHeaderView = null;
                            }
                            if (this._tableView != null) {
                                this._tableView.detach();
                                this._tableView = null;
                            }
                        };

                        AbstractTableJQueryController.prototype._removeAllFromArray = function (controllers) {
                            if (controllers != null) {
                                for (var i in controllers) {
                                    var controller = controllers[i].controller;
                                    if (this.getState() >= templa.mvc.ControllerStateInitialized) {
                                        if (this.getState() == templa.mvc.ControllerStateStarted) {
                                            controller.stop();
                                        }
                                    }
                                    controller.destroy();
                                }
                            }
                        };

                        AbstractTableJQueryController.prototype.layout = function () {
                            // layout table controllers so everything is aligned
                            _super.prototype.layout.call(this);
                            this._layoutTable();
                        };

                        AbstractTableJQueryController.prototype._layoutTable = function () {
                            // measure everything
                            var maxRowHeights = [];
                            var maxColumnWidths = [];

                            var rowHeaderQuery = $(this._rowHeaderView.getRoots());
                            var columnHeaderQuery = $(this._columnHeaderView.getRoots());
                            var tableQuery = $(this._tableView.getRoots());

                            // assume these don't interfere with eachother
                            var rowHeaderWidth = rowHeaderQuery.width();
                            var columnHeaderHeight = columnHeaderQuery.height();
                            rowHeaderQuery.css('margin-top', columnHeaderHeight + 'px');
                            columnHeaderQuery.css('margin-left', rowHeaderWidth + 'px');
                            tableQuery.css('margin-top', columnHeaderHeight + 'px');
                            tableQuery.css('margin-left', rowHeaderWidth + 'px');

                            for (var row = 0; row < this._rowCount; row++) {
                                var controller = this._leafRowHeaders[row].controller;
                                var view = controller.getView();
                                var height = $(view.getRoots()).height();
                                maxRowHeights.push(height);
                            }
                            for (var column = 0; column < this._columnCount; column++) {
                                var controller = this._leafColumnHeaders[column].controller;
                                var view = controller.getView();
                                var width = $(view.getRoots()).width();
                                maxColumnWidths.push(width);
                            }
                            for (var row = 0; row < this._rowCount; row++) {
                                var maxHeight = maxRowHeights[row];
                                for (var column = 0; column < this._columnCount; column++) {
                                    var cell = this._cells[row][column].controller;
                                    var view = cell.getView();
                                    var width = $(view.getRoots()).width();
                                    var height = $(view.getRoots()).height();
                                    var maxWidth = maxColumnWidths[column];
                                    if (height > maxHeight) {
                                        maxHeight = height;
                                    }
                                    if (width > maxWidth) {
                                        maxColumnWidths[column] = width;
                                    }
                                }
                                maxRowHeights[row] = maxHeight;
                            }

                            for (var row = 0; row < this._rowCount; row++) {
                                var height = maxRowHeights[row];
                                var rowHeaderContainer = this._leafRowHeaders[row].container;
                                $(rowHeaderContainer).height(height);
                                for (var column = 0; column < this._columnCount; column++) {
                                    var width = maxColumnWidths[column];
                                    if (row == 0) {
                                        var columnHeaderContainer = this._leafColumnHeaders[column].container;
                                        $(columnHeaderContainer.resolve()).width(width);
                                    }
                                    var maxWidth = maxColumnWidths[column];
                                    var cellContainer = this._cells[row][column].container;
                                    $(cellContainer.resolve()).width(width).height(height);
                                }
                            }
                        };

                        // from IJQuerySelectorHandler
                        // do we need this method?
                        AbstractTableJQueryController.prototype.$ = function (selector, roots) {
                            // do a careful jquery (only owned elements)
                            if (roots == null) {
                                roots = this._view.getRoots();
                            }

                            // we inherently know that our roots are valid (no need to check lineage)
                            var self = $(roots);
                            var query;
                            if (selector != null) {
                                var allChildRoots = [];

                                // initialized controllers
                                this._appendRoots(allChildRoots, this._columnHeaders);
                                this._appendRoots(allChildRoots, this._rowHeaders);
                                for (var row in this._cells) {
                                    var rowCells = this._cells[row];
                                    this._appendRoots(allChildRoots, rowCells);
                                }

                                // selector goes first as checking the parenthood is quite expensive
                                query = $(roots).find(selector).filter(function (index) {
                                    var valid = true;
                                    var e = this;
                                    while (e != null) {
                                        if (roots.indexOf(e) >= 0) {
                                            break;
                                        } else if (allChildRoots.indexOf(e) >= 0) {
                                            valid = false;
                                            break;
                                        } else {
                                            e = e.parentNode;
                                        }
                                    }
                                    return valid;
                                });
                                self = self.filter(selector);
                                query = query.add(self);
                            } else {
                                query = self;
                            }

                            return query;
                        };

                        AbstractTableJQueryController.prototype._appendRoots = function (into, cells) {
                            for (var index in cells) {
                                var cell = cells[index].controller;
                                var view = cell.getView();
                                if (view != null) {
                                    // we can get odd situations where the owner controller is initialized, but the children are not
                                    var childRoots = view.getRoots();
                                    if (childRoots != null) {
                                        templa.util.Arrays.pushAll(into, childRoots);
                                    }
                                }
                            }
                        };
                        return AbstractTableJQueryController;
                    })(templa.dom.mvc.AbstractElementController);
                    table.AbstractTableJQueryController = AbstractTableJQueryController;
                })(jquery.table || (jquery.table = {}));
                var table = jquery.table;
            })(mvc.jquery || (mvc.jquery = {}));
            var jquery = mvc.jquery;
        })(dom.mvc || (dom.mvc = {}));
        var mvc = dom.mvc;
    })(templa.dom || (templa.dom = {}));
    var dom = templa.dom;
})(templa || (templa = {}));
