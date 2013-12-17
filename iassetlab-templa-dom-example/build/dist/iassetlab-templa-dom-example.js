///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="../../../../../build/defs/jquery.d.ts"/>
///<reference path="stack/IBackForwardStackControllerModel.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            ///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
            ///<reference path="../../../../build/defs/iassetlab-templa-dom.d.ts"/>
            ///<reference path="../../../../build/defs/jquery.d.ts"/>
            // Module
            (function (mvc) {
                // Class
                var AssetLabStackControllerModel = (function (_super) {
                    __extends(AssetLabStackControllerModel, _super);
                    // Constructor
                    function AssetLabStackControllerModel(controllersToDisplay, _prefixControllerFactory, _postfixControllerFactory, _padControllers) {
                        // TODO it's somehow going to have to manage the number of visible entries
                        _super.call(this, false, controllersToDisplay);
                        this._prefixControllerFactory = _prefixControllerFactory;
                        this._postfixControllerFactory = _postfixControllerFactory;
                        this._padControllers = _padControllers;
                        this._prefixedControllerEntries = [];
                        this._postfixedControllerEntries = [];
                        this._poppedControllerEntries = [];
                        this._recalculateControllers(controllersToDisplay, _padControllers);
                    }
                    AssetLabStackControllerModel.prototype.canPush = function () {
                        var result;
                        if (this._postfixedControllerEntries.length > 0) {
                            var postfixedControllerEntry = this._postfixedControllerEntries[0];
                            result = (postfixedControllerEntry["padding"] != true);
                        } else {
                            if (this._poppedControllerEntries.length > 0) {
                                var poppedControllerEntry = this._poppedControllerEntries[0];
                                result = (poppedControllerEntry["padding"] != true);
                            } else {
                                result = false;
                            }
                        }
                        return result;
                    };

                    AssetLabStackControllerModel.prototype.requestPush = function () {
                        this._pushEntry(this._poppedControllerEntries[0]);
                    };

                    AssetLabStackControllerModel.prototype.getPadControllers = function () {
                        return this._padControllers;
                    };

                    AssetLabStackControllerModel.prototype.setPadControllers = function (_padControllers) {
                        if (this._padControllers != _padControllers) {
                            this._padControllers = _padControllers;
                            this._recalculateControllers(this._controllersToDisplay, true);
                        }
                    };

                    AssetLabStackControllerModel.prototype._setControllersToDisplay = function (_controllersToDisplay, _padControllers) {
                        if (this._controllersToDisplay != _controllersToDisplay) {
                            if (_padControllers != null) {
                                this._padControllers = _padControllers;
                            }
                            this._recalculateControllers(_controllersToDisplay, false);
                            _super.prototype._setControllersToDisplay.call(this, _controllersToDisplay);
                        } else if (_padControllers != this._padControllers) {
                            this.setPadControllers(_padControllers);
                        }
                    };

                    AssetLabStackControllerModel.prototype._recalculateControllers = function (controllersToDisplay, fireModelChangeEvent) {
                        // calculate the controllers we need to add
                        this._prefixedControllerEntries = [];
                        this._postfixedControllerEntries = [];
                        if (this._padControllers) {
                            this._prefixedControllerEntries.push(this._createPrefixControllerEntry(controllersToDisplay));
                            var i = 0;
                            while (this._postfixedControllerEntries.length + Math.min(controllersToDisplay, this._stack.length) + this._prefixedControllerEntries.length < controllersToDisplay + 2) {
                                var postfixedControllerEntry;
                                if (i >= this._poppedControllerEntries.length) {
                                    postfixedControllerEntry = {
                                        controller: this._postfixControllerFactory(),
                                        padding: true
                                    };
                                } else {
                                    postfixedControllerEntry = this._poppedControllerEntries[i];
                                    i++;
                                }
                                this._postfixedControllerEntries.push(postfixedControllerEntry);
                            }
                        }
                        if (fireModelChangeEvent) {
                            // invalidate
                            this._fireModelChangeEvent();
                        }
                    };

                    AssetLabStackControllerModel.prototype._pushPair = function (previous, controller, controllerData, suppressModelChangeEvent) {
                        var _this = this;
                        // is the controller already ontop
                        var result;

                        // check that the controller isn't already in the stack
                        if (!this._contains(controller)) {
                            var fullReload = false;
                            if (!this._contains(previous)) {
                                this._push(previous, true, true);
                                fullReload = true;
                            } else {
                                while (this.peek() != previous) {
                                    // do not animate
                                    this._pop(true, true);
                                    fullReload = true;
                                }
                            }
                            var change = this._pushEntryGetChange({ controller: controller, data: controllerData }, fullReload || suppressModelChangeEvent == true);
                            if (fullReload) {
                                if (suppressModelChangeEvent != true) {
                                    this._fireModelChangeEvent(null, true);
                                }
                                result = null;
                            } else {
                                result = {
                                    undo: function () {
                                        change.undo();
                                    },
                                    redo: function () {
                                        _this._pushPair(previous, controller, controllerData, false);
                                    }
                                };
                                //result = change;
                            }
                        } else {
                            result = null;
                        }
                        return result;
                    };

                    // override so all the shit works
                    AssetLabStackControllerModel.prototype.getControllers = function () {
                        var result = _super.prototype.getControllers.call(this);
                        if (this._padControllers) {
                            for (var i in this._prefixedControllerEntries) {
                                result.splice(parseInt(i), 0, this._prefixedControllerEntries[i].controller);
                            }
                            for (var i in this._postfixedControllerEntries) {
                                result.push(this._postfixedControllerEntries[i].controller);
                            }
                        }
                        return result;
                    };

                    AssetLabStackControllerModel.prototype._createPrefixControllerEntry = function (controllersToDisplay) {
                        var prefixControllerEntry;
                        var supportsBack;
                        if (this._stack.length > controllersToDisplay) {
                            prefixControllerEntry = this._stack[this._stack.length - controllersToDisplay - 1];
                            supportsBack = true;
                        } else {
                            var prefixController = this._prefixControllerFactory();
                            prefixControllerEntry = {
                                controller: prefixController
                            };
                            supportsBack = false;
                        }
                        return prefixControllerEntry;
                    };

                    AssetLabStackControllerModel.prototype._pop = function (suppressFireModelChangeEvent, suppressFireDescriptionChangeEvent) {
                        var popped = _super.prototype._pop.call(this, this._padControllers || suppressFireModelChangeEvent == true, this._padControllers || suppressFireDescriptionChangeEvent == true);
                        if (popped != null) {
                            this._poppedControllerEntries.splice(0, 0, popped);
                        }

                        // save it up
                        if (this._padControllers) {
                            if (popped != null) {
                                this._postfixedControllerEntries.splice(0, 0, popped);
                                var removed;
                                if (this._postfixedControllerEntries.length + Math.min(this._controllersToDisplay, this._stack.length) + this._prefixedControllerEntries.length >= this._controllersToDisplay + 2) {
                                    removed = this._postfixedControllerEntries[this._postfixedControllerEntries.length - 1].controller;
                                    this._postfixedControllerEntries.splice(this._postfixedControllerEntries.length - 1, 1);
                                } else {
                                    removed = null;
                                }
                                var added;
                                if (removed != null) {
                                    var addedEntry = this._createPrefixControllerEntry(this._controllersToDisplay);
                                    added = addedEntry.controller;
                                    this._prefixedControllerEntries = [addedEntry];
                                } else {
                                    added = null;
                                }
                                if (suppressFireModelChangeEvent != true) {
                                    // get the removed controller (it's not the one that was popped!)
                                    // get the added controller based on .... some shit
                                    var changeDescription = new templa.mvc.composite.StackControllerModelChangeDescription(templa.mvc.composite.stackControllerModelEventPopped, removed, added);
                                    this._fireModelChangeEvent(changeDescription, true);
                                }
                                if (suppressFireDescriptionChangeEvent != true) {
                                    // notify of pop
                                    var modelStateChange = new templa.mvc.composite.AbstractStackControllerModelPopChange(this, popped);
                                    this._fireStateDescriptionChangeEvent(this, modelStateChange);
                                }
                            }
                        }
                        return popped;
                    };

                    AssetLabStackControllerModel.prototype._pushEntryGetChange = function (entry, suppressFireModelChangeEvent) {
                        var originalStackLength = this._stack.length;
                        var result = _super.prototype._pushEntryGetChange.call(this, entry, true);

                        // override so it fires the correct events
                        if (this._padControllers) {
                            var added;
                            var removed;
                            var silentAdded = [];
                            var silentRemoved = [];

                            // note, we just added a controller, so we are comparing a +1
                            if (this._postfixedControllerEntries.length <= 1) {
                                // is the added controller the same as the controller that we had buffered?
                                if (this._prefixedControllerEntries.length > 0) {
                                    removed = this._prefixedControllerEntries[0].controller;
                                } else {
                                    removed = null;
                                }
                                this._prefixedControllerEntries = [this._createPrefixControllerEntry(this._controllersToDisplay)];

                                if (this._poppedControllerEntries.length == 0 || entry.controller != this._poppedControllerEntries[0].controller) {
                                    silentAdded.push(entry.controller);
                                    while (this._postfixedControllerEntries.length + this._prefixedControllerEntries.length + Math.min(this._stack.length, this._controllersToDisplay) >= this._controllersToDisplay + 2) {
                                        silentRemoved.push(this._postfixedControllerEntries[0].controller);
                                        this._postfixedControllerEntries.splice(0, 1);
                                    }
                                    this._poppedControllerEntries = [];
                                } else {
                                    this._poppedControllerEntries.splice(0, 1);
                                }

                                // maintain a list of popped controllers
                                var addedEntry;
                                if (this._poppedControllerEntries.length > 0) {
                                    addedEntry = this._poppedControllerEntries[0];
                                } else {
                                    addedEntry = {
                                        controller: this._postfixControllerFactory(),
                                        padding: true
                                    };
                                }
                                this._postfixedControllerEntries = [addedEntry];
                                added = addedEntry.controller;
                            } else {
                                for (var i in this._postfixedControllerEntries) {
                                    silentRemoved.push(this._postfixedControllerEntries[i].controller);
                                }
                                this._postfixedControllerEntries.splice(0, 1);
                                silentAdded.push(entry.controller);

                                for (var i in this._postfixedControllerEntries) {
                                    silentAdded.push(this._postfixedControllerEntries[i].controller);
                                }
                                added = null;
                                removed = null;
                                this._poppedControllerEntries = [];
                            }
                            if (suppressFireModelChangeEvent != true) {
                                var changeDescription = new templa.mvc.composite.StackControllerModelChangeDescription(templa.mvc.composite.stackControllerModelEventPushed, removed, added, silentRemoved, silentAdded);
                                this._fireModelChangeEvent(changeDescription, true);
                            }
                            /*
                            if (suppressFireDescriptionChangeEvent != true) {
                            // notify of push
                            var modelStateChange = new templa.mvc.composite.AbstractStackControllerModelPushChange(
                            this,
                            entry
                            );
                            this._fireStateDescriptionChangeEvent(this, modelStateChange);
                            
                            }
                            */
                        } else {
                            // checked the popped controllers
                            if (this._poppedControllerEntries.length > 0) {
                                if (this._poppedControllerEntries[0].controller == entry.controller) {
                                    this._poppedControllerEntries.splice(0, 1);
                                } else {
                                    this._poppedControllerEntries = [];
                                }
                            }
                            if (suppressFireModelChangeEvent != true) {
                                var removed;
                                if (this._stack.length > this._controllersToDisplay) {
                                    removed = this._stack[this._stack.length - this._controllersToDisplay - 1].controller;
                                } else {
                                    removed = null;
                                }
                                var changeDescription = new templa.mvc.composite.StackControllerModelChangeDescription(templa.mvc.composite.stackControllerModelEventPushed, removed, entry.controller);
                                this._fireModelChangeEvent(changeDescription, true);
                            }
                        }
                        return result;
                    };

                    AssetLabStackControllerModel.prototype.createStateDescription = function (models) {
                        // just pass it through to the root controller and let it deal
                        return this._stack[0].controller.getModel().createStateDescription(models);
                    };

                    AssetLabStackControllerModel.prototype.loadStateDescription = function (description) {
                        this._stack[0].controller.getModel().loadStateDescription(description);
                    };
                    return AssetLabStackControllerModel;
                })(templa.mvc.composite.AbstractStackControllerModel);
                mvc.AssetLabStackControllerModel = AssetLabStackControllerModel;
            })(core.mvc || (core.mvc = {}));
            var mvc = core.mvc;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="AssetLabStackControllerModel.ts"/>
///<reference path="home/IHomeControllerModel.ts"/>
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            ///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
            ///<reference path="../../../../build/defs/iassetlab-templa-dom.d.ts"/>
            ///<reference path="../../../../build/defs/jquery.d.ts"/>
            // Module
            (function (mvc) {
                // Class
                var AssetLabHomeControllerModel = (function (_super) {
                    __extends(AssetLabHomeControllerModel, _super);
                    // Constructor
                    function AssetLabHomeControllerModel(_owner, _stackModel, _optionIdsToControllers) {
                        _super.call(this);
                        this._owner = _owner;
                        this._stackModel = _stackModel;
                        this._optionIdsToControllers = _optionIdsToControllers;
                    }
                    AssetLabHomeControllerModel.prototype.getDisplayedOption = function () {
                        return this._displayedOption;
                    };

                    AssetLabHomeControllerModel.prototype.requestDisplayOption = function (option, suppressDescriptionChangeEvent) {
                        var _this = this;
                        // show the controller for this
                        var controller;
                        if (option != null) {
                            controller = this._optionIdsToControllers[option];
                            if (controller != null) {
                                var isOnTop = this._stackModel.peek() == this._owner;
                                var change = this._stackModel._pushPair(this._owner, controller, null, false);
                                var oldDisplayedOption = this._displayedOption;
                                change = {
                                    undo: function () {
                                        if (isOnTop) {
                                            // TODO ensure that the owner controller is visible, do nothing else
                                            _this._stackModel._ensureVisible(_this._owner, true);
                                        } else {
                                            _this.requestDisplayOption(oldDisplayedOption, true);
                                        }
                                    },
                                    redo: function () {
                                        _this.requestDisplayOption(option, true);
                                    }
                                };
                                this._displayedOption = option;

                                this._fireModelChangeEvent(null, true);
                                if (suppressDescriptionChangeEvent != true) {
                                    this._fireStateDescriptionChangeEvent(this, change);
                                }
                            }
                        } else {
                            controller = null;

                            while (this._stackModel.peek() != this._owner && this._stackModel.peek != null) {
                                this._stackModel._pop(false, suppressDescriptionChangeEvent);
                            }
                        }
                        return controller;
                    };

                    AssetLabHomeControllerModel.prototype.createStateDescription = function (models) {
                        models = this._checkModels(models);

                        // are we ontop of the stack?
                        var result;
                        if (this._stackModel.peek() == this._owner) {
                            // oh well
                            result = null;
                        } else {
                            // obtain controller's model's description
                            var controller = this._optionIdsToControllers[this._displayedOption];
                            var optionData = controller.getModel().createStateDescription(models);
                            result = {
                                option: this._displayedOption,
                                optionData: optionData
                            };
                        }

                        return result;
                    };

                    AssetLabHomeControllerModel.prototype.loadStateDescription = function (description) {
                        // TODO load controller's model's description
                        if (description != null) {
                            var option = description["option"];
                            var controller = this.requestDisplayOption(option, true);
                            if (controller != null) {
                                var optionData = description["optionData"];
                                controller.getModel().loadStateDescription(optionData);
                            }
                        }
                    };
                    return AssetLabHomeControllerModel;
                })(templa.mvc.AbstractModel);
                mvc.AssetLabHomeControllerModel = AssetLabHomeControllerModel;
            })(core.mvc || (core.mvc = {}));
            var mvc = core.mvc;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            // Module
            (function (service) {
                // Class
                var Template = (function () {
                    function Template() {
                    }
                    return Template;
                })();
                service.Template = Template;
            })(core.service || (core.service = {}));
            var service = core.service;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
///<reference path="Template.ts"/>
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            // Module
            (function (service) {
                // Class
                var TemplateVersion = (function () {
                    function TemplateVersion() {
                    }
                    return TemplateVersion;
                })();
                service.TemplateVersion = TemplateVersion;
            })(core.service || (core.service = {}));
            var service = core.service;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            // Module
            (function (service) {
                // Class
                var User = (function () {
                    function User() {
                    }
                    return User;
                })();
                service.User = User;
            })(core.service || (core.service = {}));
            var service = core.service;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
///<reference path="Template.ts"/>
///<reference path="TemplateVersion.ts"/>
///<reference path="User.ts"/>
///<reference path="../service/ITemplateService.ts"/>
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            ///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
            ///<reference path="../../../../build/defs/iassetlab-templa-dom.d.ts"/>
            ///<reference path="../../../../build/defs/jquery.d.ts"/>
            // Module
            (function (mvc) {
                // Class
                var AssetLabSearchResultsControllerModel = (function (_super) {
                    __extends(AssetLabSearchResultsControllerModel, _super);
                    // Constructor
                    function AssetLabSearchResultsControllerModel(_blockSize, _templateService, _searchResultControllerFactory) {
                        _super.call(this);
                        this._blockSize = _blockSize;
                        this._templateService = _templateService;
                        this._searchResultControllerFactory = _searchResultControllerFactory;
                        this._controllerCount = null;
                    }
                    AssetLabSearchResultsControllerModel.prototype._search = function (searchString) {
                        var _this = this;
                        // TODO cancel any existing requests
                        // start loading
                        this._loadingComplete = false;

                        // no meaningful description change
                        this._fireModelChangeEvent(null, true);

                        // immediately start loading
                        // TODO cancel previous loading request
                        this._blocks = {};
                        this._controllerCount = 0;
                        this._currentBlock = 0;

                        // set state to loading
                        this._fireModelChangeEvent(null, true);

                        this._templateService.search(searchString, 0, this._blockSize, this._controllerCount == null, function (results, done, totalCount, error) {
                            if (totalCount != null) {
                                _this._controllerCount = totalCount;
                            }

                            // create controllers and append
                            var block = _this._blocks[0];
                            if (block == null) {
                                block = [];
                                _this._blocks[0] = block;
                            }

                            for (var i in results) {
                                var searchResult = results[i];
                                var searchResultController = _this._searchResultControllerFactory(searchResult);
                                block.push(searchResultController);
                            }

                            if (done) {
                                _this._loadingComplete = true;
                            }
                            _this._fireModelChangeEvent(null, true);
                            return done;
                        });
                    };

                    // from list controller
                    AssetLabSearchResultsControllerModel.prototype.getController = function (index, reuseController) {
                        var blockNumber = Math.floor(index / this._blockSize);
                        var blockIndex = index % this._blockSize;
                        var block = this._blocks[blockNumber];
                        return block[blockIndex];
                    };

                    AssetLabSearchResultsControllerModel.prototype.getControllerType = function (index) {
                        // all the same type
                        return "template";
                    };

                    AssetLabSearchResultsControllerModel.prototype.getControllerCount = function () {
                        // TODO : perhaps controller count should just be the number of blocks, with the option to keep loading if we scroll down?
                        return this._controllerCount;
                    };

                    // from loading controller (which activates whenever we are loading up new values)
                    AssetLabSearchResultsControllerModel.prototype.getLoadingProgress = function () {
                        return this._loadingProgress;
                    };

                    AssetLabSearchResultsControllerModel.prototype.getMaximumProgress = function () {
                        return this._loadingMaximumProgress;
                    };

                    AssetLabSearchResultsControllerModel.prototype.getErrors = function () {
                        return this._loadingErrors;
                    };

                    AssetLabSearchResultsControllerModel.prototype.isComplete = function () {
                        return this._loadingComplete;
                    };

                    /**
                    * update a synchronous loading thing, return true if it isn't finished (requires another call), false if it is
                    */
                    AssetLabSearchResultsControllerModel.prototype.update = function () {
                        return false;
                    };

                    /**
                    * return true if the loading requires calls to update, false if it is asynchronous
                    */
                    AssetLabSearchResultsControllerModel.prototype.requestStartLoading = function (callback) {
                        // we don't worry about that, do we?
                        return false;
                    };
                    return AssetLabSearchResultsControllerModel;
                })(templa.mvc.AbstractModel);
                mvc.AssetLabSearchResultsControllerModel = AssetLabSearchResultsControllerModel;
            })(core.mvc || (core.mvc = {}));
            var mvc = core.mvc;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="AssetLabSearchResultsControllerModel.ts"/>
///<reference path="AssetLabStackControllerModel.ts"/>
///<reference path="search/ISearchControllerModel.ts"/>
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            ///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
            ///<reference path="../../../../build/defs/iassetlab-templa-dom.d.ts"/>
            ///<reference path="../../../../build/defs/jquery.d.ts"/>
            // Module
            (function (mvc) {
                // Class
                var AssetLabSearchControllerModel = (function (_super) {
                    __extends(AssetLabSearchControllerModel, _super);
                    // Constructor
                    function AssetLabSearchControllerModel(_stackModel, _owner, _searchResultsController, _searchResultsModel) {
                        _super.call(this);
                        this._stackModel = _stackModel;
                        this._owner = _owner;
                        this._searchResultsController = _searchResultsController;
                        this._searchResultsModel = _searchResultsModel;
                        this._searchString = null;
                        this._activeSearch = null;
                    }
                    AssetLabSearchControllerModel.prototype.requestSearch = function (searchString, suppressDescriptionChangeEvent) {
                        var _this = this;
                        // TODO set the search data on the search results model
                        var oldSearchString = this._activeSearch;
                        this._activeSearch = searchString;
                        this._searchString = searchString;

                        // push the search controller
                        var isOnTop = this._stackModel.peek() == this._owner;
                        var change = this._stackModel._pushPair(this._owner, this._searchResultsController, null, false);
                        change = {
                            undo: function () {
                                if (isOnTop) {
                                    // TODO ensure that the owner controller is visible, do nothing else
                                    _this._stackModel._popTo(_this._owner, true);
                                } else {
                                    _this.requestSearch(oldSearchString, true);
                                }
                            },
                            redo: function () {
                                _this.requestSearch(searchString, true);
                            }
                        };
                        this._searchResultsModel._search(searchString);
                        this._fireModelChangeEvent(null, true);
                        if (suppressDescriptionChangeEvent != true) {
                            this._fireStateDescriptionChangeEvent(this, change);
                        }
                    };

                    AssetLabSearchControllerModel.prototype.getSearchString = function () {
                        return this._searchString;
                    };

                    AssetLabSearchControllerModel.prototype.stashSearch = function (searchString) {
                        this._searchString = searchString;
                        // TODO fire a model change event?
                    };

                    AssetLabSearchControllerModel.prototype.createStateDescription = function (models) {
                        models = this._checkModels(models);

                        // are we ontop of the stack?
                        var result = {
                            search: this._searchString
                        };
                        if (this._stackModel.peek() != this._owner) {
                            // just pass it through to the root controller and let it deal
                            // TODO obtain controller's model's description
                            var controller = this._searchResultsController;
                            var searchData = controller.getModel().createStateDescription(models);
                            result["searchData"] = searchData;
                            result["searchActive"] = true;
                        }

                        return result;
                    };

                    AssetLabSearchControllerModel.prototype.loadStateDescription = function (description) {
                        // TODO load controller's model's description
                        if (description != null) {
                            var search = description["search"];
                            var searchData = description["searchData"];
                            var searchActive = description["searchActive"];
                            if (searchActive) {
                                this.requestSearch(search);
                                this._searchResultsController.getModel().loadStateDescription(searchData);
                            } else {
                                this._searchString = search;
                            }
                            this._fireModelChangeEvent(null, true);
                        }
                    };
                    return AssetLabSearchControllerModel;
                })(templa.mvc.AbstractModel);
                mvc.AssetLabSearchControllerModel = AssetLabSearchControllerModel;
            })(core.mvc || (core.mvc = {}));
            var mvc = core.mvc;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="../../../../build/defs/jquery.d.ts"/>
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            // Module
            (function (mvc) {
                var AssetLabDecoratorModel = (function (_super) {
                    __extends(AssetLabDecoratorModel, _super);
                    function AssetLabDecoratorModel(_decorationController, _decorationControllerKey, _otherControllers, _otherControllerKey) {
                        _super.call(this);
                        this._decorationController = _decorationController;
                        this._decorationControllerKey = _decorationControllerKey;
                        this._otherControllers = _otherControllers;
                        this._otherControllerKey = _otherControllerKey;
                    }
                    AssetLabDecoratorModel.prototype.getControllerKey = function (controller) {
                        var result;
                        if (controller == this._decorationController) {
                            result = this._decorationControllerKey;
                        } else {
                            result = this._otherControllerKey;
                        }
                        return result;
                    };

                    AssetLabDecoratorModel.prototype._getDescribedControllers = function () {
                        // assume the toolbar is stateless
                        return this._otherControllers;
                    };

                    AssetLabDecoratorModel.prototype.getControllers = function () {
                        var result = [this._decorationController];
                        templa.util.Arrays.pushAll(result, this._otherControllers);
                        return result;
                    };
                    return AssetLabDecoratorModel;
                })(templa.mvc.composite.AbstractCompositeControllerModel);
                mvc.AssetLabDecoratorModel = AssetLabDecoratorModel;
            })(core.mvc || (core.mvc = {}));
            var mvc = core.mvc;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="../../../../../build/defs/jquery.d.ts"/>
///<reference path="../ITemplateModel.ts"/>
///<reference path="template/summary/ITemplateSummaryModel.ts"/>
///<reference path="../service/ITemplateService.ts"/>
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            ///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
            ///<reference path="../../../../build/defs/iassetlab-templa-dom.d.ts"/>
            ///<reference path="../../../../build/defs/jquery.d.ts"/>
            // Module
            (function (mvc) {
                // Class
                var AssetLabSearchResultTemplateSummaryModel = (function (_super) {
                    __extends(AssetLabSearchResultTemplateSummaryModel, _super);
                    // Constructor
                    function AssetLabSearchResultTemplateSummaryModel(_searchResult) {
                        _super.call(this);
                        this._searchResult = _searchResult;
                    }
                    AssetLabSearchResultTemplateSummaryModel.prototype.getTitle = function () {
                        return this._searchResult.template.name;
                    };

                    AssetLabSearchResultTemplateSummaryModel.prototype.getDescription = function () {
                        return this._searchResult.template.description;
                    };

                    AssetLabSearchResultTemplateSummaryModel.prototype.getImageURL = function (maxWidth, maxHeight) {
                        // TODO format the max width and height in there somehow
                        return this._searchResult.version.imageUrl;
                    };

                    AssetLabSearchResultTemplateSummaryModel.prototype.requestDetail = function () {
                        // do nothing...for now
                    };
                    return AssetLabSearchResultTemplateSummaryModel;
                })(templa.mvc.AbstractModel);
                mvc.AssetLabSearchResultTemplateSummaryModel = AssetLabSearchResultTemplateSummaryModel;
            })(core.mvc || (core.mvc = {}));
            var mvc = core.mvc;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
///<reference path="IHomeControllerModel.ts"/>
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            (function (mvc) {
                ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
                ///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
                // Module
                (function (home) {
                    // Class
                    var HomeController = (function (_super) {
                        __extends(HomeController, _super);
                        // Constructor
                        function HomeController(viewFactory) {
                            _super.call(this, viewFactory);
                        }
                        HomeController.prototype._doStart = function () {
                            var model = this.getModel();
                            for (var i in HomeController._selectors) {
                                var selector = HomeController._selectors[i];

                                // get around scoping problems
                                this.$(selector).click(function (s) {
                                    return function () {
                                        model.requestDisplayOption(s);
                                    };
                                }(selector));
                            }
                            return true;
                        };

                        HomeController.prototype._doLoad = function (model) {
                            var homeModel = this.getModel();
                            for (var i in HomeController._selectors) {
                                var selector = HomeController._selectors[i];

                                var jquery = this.$(selector);
                                if (selector == homeModel.getDisplayedOption()) {
                                    if (!jquery.hasClass(HomeController._displayedClass)) {
                                        jquery.addClass(HomeController._displayedClass);
                                    }
                                } else {
                                    this.$(selector).removeClass(HomeController._displayedClass);
                                }
                            }
                        };
                        HomeController._selectorAbout = ".home_item_about";
                        HomeController._selectorSearch = ".home_item_search";
                        HomeController._selectorBrowse = ".home_item_browse";

                        HomeController._selectors = [HomeController._selectorAbout, HomeController._selectorSearch, HomeController._selectorBrowse];
                        HomeController._displayedClass = "displayed";
                        return HomeController;
                    })(templa.dom.mvc.jquery.AbstractJQueryController);
                    home.HomeController = HomeController;
                })(mvc.home || (mvc.home = {}));
                var home = mvc.home;
            })(core.mvc || (core.mvc = {}));
            var mvc = core.mvc;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
///<reference path="ISearchControllerModel.ts"/>
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            (function (mvc) {
                ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
                ///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
                ///<reference path="../../../../../build/defs/jquery.d.ts"/>
                // Module
                (function (search) {
                    // Class
                    var SearchController = (function (_super) {
                        __extends(SearchController, _super);
                        // Constructor
                        function SearchController(viewFactory) {
                            var _this = this;
                            _super.call(this, viewFactory);
                            this._searchButtonClickHandler = function (eventObject) {
                                _this._requestSearch();
                            };
                            this._searchFieldEnterHandler = function (eventObject) {
                                if (eventObject.which == 13) {
                                    _this._requestSearch();
                                }
                            };
                            this._searchFieldChangeHandler = function (eventObject) {
                                _this._stashSearch();
                            };
                        }
                        SearchController.prototype._doStart = function () {
                            var searchButton = this.$(".search-button");
                            searchButton.click(this._searchButtonClickHandler);
                            var searchInput = this.$(".search-input");
                            searchInput.keypress(this._searchFieldEnterHandler);
                            searchInput.change(this._searchFieldChangeHandler);
                            searchInput.focus();
                            return true;
                        };

                        SearchController.prototype._doStop = function () {
                            var searchButton = this.$(".search-button");
                            searchButton.off("click", this._searchButtonClickHandler);
                            var searchInput = this.$(".search-input");
                            searchInput.off('keypress', this._searchFieldEnterHandler);
                            searchInput.off('change', this._searchFieldChangeHandler);
                            return true;
                        };

                        SearchController.prototype._doLoad = function (model) {
                            var searchModel = model;
                            var searchInput = this.$(".search-input");
                            searchInput.val(searchModel.getSearchString());
                        };

                        SearchController.prototype._requestSearch = function () {
                            var searchInput = this.$(".search-input");
                            var searchString = searchInput.val();
                            var searchModel = this.getModel();
                            searchModel.requestSearch(searchString);
                        };

                        SearchController.prototype._stashSearch = function () {
                            var searchInput = this.$(".search-input");
                            var searchString = searchInput.val();
                            var searchModel = this.getModel();
                            searchModel.stashSearch(searchString);
                        };
                        return SearchController;
                    })(templa.dom.mvc.jquery.AbstractJQueryController);
                    search.SearchController = SearchController;
                })(mvc.search || (mvc.search = {}));
                var search = mvc.search;
            })(core.mvc || (core.mvc = {}));
            var mvc = core.mvc;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="IAboutControllerModel.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            (function (mvc) {
                // Module
                (function (about) {
                    // Class
                    var AboutController = (function (_super) {
                        __extends(AboutController, _super);
                        // Constructor
                        function AboutController(viewFactory) {
                            _super.call(this, viewFactory);
                        }
                        return AboutController;
                    })(templa.dom.mvc.jquery.AbstractJQueryController);
                    about.AboutController = AboutController;
                })(mvc.about || (mvc.about = {}));
                var about = mvc.about;
            })(core.mvc || (core.mvc = {}));
            var mvc = core.mvc;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
///<reference path="../home/IHomeControllerModel.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="../../../../../build/defs/jquery.d.ts"/>
///<reference path="IStatusbarControllerModel.ts"/>
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            (function (mvc) {
                ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
                ///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
                ///<reference path="../../../../../build/defs/jquery.d.ts"/>
                // Module
                (function (statusbar) {
                    // Class
                    var StatusbarController = (function (_super) {
                        __extends(StatusbarController, _super);
                        // Constructor
                        function StatusbarController(viewFactory) {
                            _super.call(this, viewFactory);
                        }
                        return StatusbarController;
                    })(templa.dom.mvc.jquery.AbstractJQueryController);
                    statusbar.StatusbarController = StatusbarController;
                })(mvc.statusbar || (mvc.statusbar = {}));
                var statusbar = mvc.statusbar;
            })(core.mvc || (core.mvc = {}));
            var mvc = core.mvc;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
///<reference path="IBackForwardStackControllerModel.ts"/>
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            (function (mvc) {
                ///<reference path="../../../d.ts/hammerjs.d.ts"/>
                ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
                ///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
                ///<reference path="../../../../../build/defs/jquery.d.ts"/>
                // Module
                (function (stack) {
                    // Class
                    var BackForwardStackController = (function (_super) {
                        __extends(BackForwardStackController, _super);
                        // Constructor
                        function BackForwardStackController(viewFactory, bundles, _leftWingSelector, _rightWingSelector) {
                            var _this = this;
                            _super.call(this, viewFactory, bundles);
                            this._leftWingSelector = _leftWingSelector;
                            this._rightWingSelector = _rightWingSelector;

                            this._backClickHandler = function () {
                                _this._requestBack();
                            };

                            this._forwardClickHandler = function () {
                                _this._requestForward();
                            };

                            this._backSwipeHandler = function (event) {
                                if (_this._isAnimating()) {
                                    _this._clearAnimations();
                                }
                                _this._requestBack();
                            };

                            this._forwardSwipeHandler = function (event) {
                                if (_this._isAnimating()) {
                                    _this._clearAnimations();
                                }
                                _this._requestForward();
                            };
                        }
                        BackForwardStackController.prototype._doInit = function () {
                            var result = _super.prototype._doInit.call(this);
                            if (result) {
                                var containerElement = this._viewContainer.resolve();
                                var options = {
                                    prevent_default: true,
                                    swipe: true,
                                    tap: false,
                                    drag: false,
                                    hold: false,
                                    tap_double: false
                                };
                                this._hammer = new Hammer(containerElement);
                            }
                            return result;
                        };

                        BackForwardStackController.prototype._doDestroy = function (detachView) {
                            var result = _super.prototype._doDestroy.call(this, detachView);
                            if (result) {
                                this._hammer = null;
                            }
                            return result;
                        };

                        BackForwardStackController.prototype._doStart = function () {
                            var result = _super.prototype._doStart.call(this);

                            // listen for swipe events
                            this._hammer.on('swipeleft', this._forwardSwipeHandler);
                            this._hammer.on('swiperight', this._backSwipeHandler);
                            this.$(this._leftWingSelector).click(this._backClickHandler);
                            this.$(this._rightWingSelector).click(this._forwardClickHandler);
                            return result;
                        };

                        BackForwardStackController.prototype._doStop = function () {
                            var result = _super.prototype._doStop.call(this);

                            // stop listening for swipe events
                            this._hammer.off('swipeleft', this._forwardSwipeHandler);
                            this._hammer.off('swiperight', this._backSwipeHandler);
                            this.$(this._leftWingSelector).off("click");
                            this.$(this._rightWingSelector).off("click");

                            return result;
                        };

                        BackForwardStackController.prototype._requestBack = function () {
                            var model = this.getModel();
                            if (model.canPop()) {
                                model.requestPop();
                            }
                        };

                        BackForwardStackController.prototype._requestForward = function () {
                            var model = this.getModel();
                            if (model.canPush()) {
                                model.requestPush();
                            }
                        };
                        return BackForwardStackController;
                    })(templa.dom.mvc.jquery.composite.StackJQueryController);
                    stack.BackForwardStackController = BackForwardStackController;
                })(mvc.stack || (mvc.stack = {}));
                var stack = mvc.stack;
            })(core.mvc || (core.mvc = {}));
            var mvc = core.mvc;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            (function (mvc) {
                // Module
                (function (filter) {
                    // Class
                    var FilteringKeyedControllerModelProxy = (function (_super) {
                        __extends(FilteringKeyedControllerModelProxy, _super);
                        // Constructor
                        function FilteringKeyedControllerModelProxy(_keyedControllerModel, _filter) {
                            _super.call(this, _keyedControllerModel);
                            this._keyedControllerModel = _keyedControllerModel;
                            this._filter = _filter;
                        }
                        FilteringKeyedControllerModelProxy.prototype.getControllerKey = function (controller) {
                            return this._keyedControllerModel.getControllerKey(controller);
                        };

                        FilteringKeyedControllerModelProxy.prototype.getControllers = function () {
                            var result = [];
                            var controllers = this._keyedControllerModel.getControllers();
                            for (var i in controllers) {
                                var controller = controllers[i];
                                if (this._filter(controller)) {
                                    result.push(controller);
                                }
                            }
                            return result;
                        };
                        return FilteringKeyedControllerModelProxy;
                    })(templa.mvc.AbstractModelProxy);
                    filter.FilteringKeyedControllerModelProxy = FilteringKeyedControllerModelProxy;
                })(mvc.filter || (mvc.filter = {}));
                var filter = mvc.filter;
            })(core.mvc || (core.mvc = {}));
            var mvc = core.mvc;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
///<reference path="ITemplateModel.ts"/>
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            (function (mvc) {
                ///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
                ///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
                ///<reference path="../../../../../build/defs/jquery.d.ts"/>
                // Module
                (function (template) {
                    // Class
                    var TemplateController = (function (_super) {
                        __extends(TemplateController, _super);
                        // Constructor
                        function TemplateController(viewFactory) {
                            _super.call(this, viewFactory);
                        }
                        TemplateController.prototype._doLoad = function (model) {
                            var templateModel = model;
                            this.$(".title").text(templateModel.getTitle());
                            this.$(".description").text(templateModel.getDescription());
                            this._setImage(templateModel);
                        };

                        TemplateController.prototype._setImage = function (templateModel) {
                            // TODO keep old image until new one is loaded
                            var image = this.$(".image");
                            var width = image.innerWidth();
                            var height = image.innerHeight();
                            var imageURL = templateModel.getImageURL(width, height);
                            image.attr("src", imageURL);
                        };

                        TemplateController.prototype.layout = function () {
                            _super.prototype.layout.call(this);

                            // set the image of appropriate size
                            var templateModel = this.getModel();
                            this._setImage(templateModel);
                        };
                        return TemplateController;
                    })(templa.dom.mvc.jquery.AbstractJQueryController);
                    template.TemplateController = TemplateController;
                })(mvc.template || (mvc.template = {}));
                var template = mvc.template;
            })(core.mvc || (core.mvc = {}));
            var mvc = core.mvc;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
///<reference path="ITemplateSummaryModel.ts"/>
///<reference path="../TemplateController.ts"/>
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            (function (mvc) {
                (function (template) {
                    ///<reference path="../../../../../../build/defs/jquery.d.ts"/>
                    ///<reference path="../../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
                    // Module
                    (function (summary) {
                        // Class
                        var TemplateSummaryController = (function (_super) {
                            __extends(TemplateSummaryController, _super);
                            // Constructor
                            function TemplateSummaryController(viewFactory) {
                                var _this = this;
                                _super.call(this, viewFactory);
                                this._detailRequestHandler = function (event) {
                                    _this._requestDetail();
                                };
                            }
                            TemplateSummaryController.prototype._doStart = function () {
                                var result = _super.prototype._doStart.call(this);

                                this.$(".detail").click(this._detailRequestHandler);

                                return result;
                            };

                            TemplateSummaryController.prototype._doStop = function () {
                                var result = _super.prototype._doStop.call(this);

                                this.$(".detail").unbind("click", this._detailRequestHandler);

                                return result;
                            };

                            TemplateSummaryController.prototype._requestDetail = function () {
                                var model = this.getModel();
                                model.requestDetail();
                            };
                            return TemplateSummaryController;
                        })(iassetlab.client.core.mvc.template.TemplateController);
                        summary.TemplateSummaryController = TemplateSummaryController;
                    })(template.summary || (template.summary = {}));
                    var summary = template.summary;
                })(mvc.template || (mvc.template = {}));
                var template = mvc.template;
            })(core.mvc || (core.mvc = {}));
            var mvc = core.mvc;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
///<reference path="../ITemplateService.ts"/>
///<reference path="../Template.ts"/>
///<reference path="../TemplateVersion.ts"/>
///<reference path="../User.ts"/>
var iassetlab;
(function (iassetlab) {
    (function (client) {
        (function (core) {
            (function (service) {
                // Module
                (function (json) {
                    // Class
                    var JSONTemplateServiceFunctionFactory = (function () {
                        // Constructor
                        function JSONTemplateServiceFunctionFactory() {
                        }
                        JSONTemplateServiceFunctionFactory.prototype.createSearch = function () {
                            return function (value, index, quantity, retrieveTotalCount, resultHandler) {
                                window.setTimeout(function () {
                                    var results = [];
                                    for (var i = 0; i < quantity; i++) {
                                        var template = new iassetlab.client.core.service.Template();
                                        template.name = "Template " + i;
                                        template.description = "description " + i;

                                        var version = new iassetlab.client.core.service.TemplateVersion();
                                        version.versionNumber = 1;
                                        version.imageUrl = "https://si0.twimg.com/profile_images/57758916/mouth_normal.gif";

                                        var owner = new iassetlab.client.core.service.User();
                                        owner.displayName = "User " + i;

                                        var result = {
                                            template: template,
                                            version: version,
                                            owner: owner
                                        };
                                        results.push(result);
                                    }
                                    resultHandler(results, true, quantity);
                                }, 1000);
                            };
                        };
                        return JSONTemplateServiceFunctionFactory;
                    })();
                    json.JSONTemplateServiceFunctionFactory = JSONTemplateServiceFunctionFactory;
                })(service.json || (service.json = {}));
                var json = service.json;
            })(core.service || (core.service = {}));
            var service = core.service;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
///<reference path="mvc/AssetLabHomeControllerModel.ts"/>
///<reference path="mvc/AssetLabSearchControllerModel.ts"/>
///<reference path="mvc/AssetLabDecoratorModel.ts"/>
///<reference path="mvc/AssetLabSearchResultsControllerModel.ts"/>
///<reference path="mvc/AssetLabSearchResultTemplateSummaryModel.ts"/>
///<reference path="mvc/home/HomeController.ts"/>
///<reference path="mvc/search/SearchController.ts"/>
///<reference path="mvc/about/AboutController.ts"/>
///<reference path="mvc/about/IAboutControllerModel.ts"/>
///<reference path="mvc/statusbar/StatusbarController.ts"/>
///<reference path="mvc/statusbar/IStatusbarControllerModel.ts"/>
///<reference path="mvc/stack/BackForwardStackController.ts"/>
///<reference path="mvc/filter/FilteringKeyedControllerModelProxy.ts"/>
///<reference path="mvc/template/summary/TemplateSummaryController.ts"/>
///<reference path="service/json/JSONTemplateServiceFunctionFactory.ts"/>
var iassetlab;
(function (iassetlab) {
    (function (client) {
        ///<reference path="../../../build/defs/iassetlab-templa.d.ts"/>
        ///<reference path="../../../build/defs/iassetlab-templa-dom.d.ts"/>
        ///<reference path="../../../build/defs/jquery.d.ts"/>
        // Module
        (function (core) {
            // Class
            var AssetLabControllerFactory = (function () {
                function AssetLabControllerFactory() {
                    this._statusbarDecoratorStatusbarClass = "statusbar_decorator_statusbar";
                    this._statusbarDecoratorContentClass = "statusbar_decorator_content";
                    this._toolbarButtonsBackClass = "toolbar_buttons_back";
                    this._toolbarButtonsGeneralClass = "toolbar_buttons_general";
                    this._toolbarDecoratorClass = "toolbar_decorator";
                    this._toolbarDecoratorContentClass = "toolbar_decorator_content";
                    this._contextClass = "context";
                    this._contextSummaryClass = "context_summary";
                    this._contextMainClass = "context_main";
                }
                AssetLabControllerFactory.prototype.init = function (loadables) {
                    var _this = this;
                    this._modeFunction = function () {
                        var result;

                        // TODO factor in small landscape and portrait modes too
                        if (window.innerWidth > window.innerHeight) {
                            if (window.innerWidth >= 1000) {
                                result = "wide_4";
                                //result = "wide_3";
                            } else {
                                result = "wide_3";
                                //result = "narrow";
                            }
                        } else {
                            result = "narrow";
                        }
                        return result;
                    };
                    this._animationBundleFactory = function () {
                        var mode = _this._modeFunction();
                        var result = [];
                        if (mode == "wide_3") {
                            templa.util.Arrays.pushAll(result, _this._relativeAnimationBundlesWide3);
                            templa.util.Arrays.pushAll(result, _this._absoluteAnimationBundlesWide3);
                        } else if (mode == "wide_4") {
                            templa.util.Arrays.pushAll(result, _this._relativeAnimationBundlesWide4);
                        } else {
                            result.push(_this._relativeAnimationBundleNarrow);
                            templa.util.Arrays.pushAll(result, _this._absoluteAnimationBundlesNarrow);
                        }
                        return result;
                    };

                    var slideTime = 1000;

                    var relativeWide3PushAnimationFactory;
                    var relativeWide3PushAnimationFactory2 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-3-push-2", slideTime, function (phase, view) {
                        if (phase == templa.animation.animationStateStarted) {
                            // stop the flicker as the animation ends and the view flicks back
                            $(view).css("opacity", "0.3");
                        } else if (phase == templa.animation.animationStateFinished) {
                            $(view).css("opacity", "");
                        }
                    });
                    var relativeWide3PushAnimationFactory3 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-3-push-3", slideTime, function (phase, view) {
                        if (phase == templa.animation.animationStateStarted) {
                            // stop the flicker as the animation ends and the view flicks back
                            $(view).css("opacity", "1");
                        } else if (phase == templa.animation.animationStateFinished) {
                            $(view).css("opacity", "");
                        }
                    });
                    var relativeWide3PopAnimationFactory;
                    var relativeWide3PopAnimationFactory2 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-3-pop-2", slideTime);
                    var relativeWide3PopAnimationFactory3 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-3-pop-3", slideTime);

                    var relativeNarrowPushAnimationFactory;
                    var relativeNarrowPopAnimationFactory;

                    relativeWide3PushAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-3-push", slideTime, function (phase, view) {
                        if (phase == templa.animation.animationStateStarted) {
                            // stop the flicker as the animation ends and the view flicks back
                            $(view).css("margin-left", "-33%");
                        }
                    });
                    relativeWide3PopAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-3-pop", slideTime);

                    // TODO have safeguard cleanup functions as with wide-3 factories
                    var relativeWide4PushAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-4-push", slideTime);
                    var relativeWide4PushAnimationFactory2 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-4-push-2", slideTime);
                    var relativeWide4PushAnimationFactory4 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-4-push-4", slideTime);
                    var relativeWide4PopAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-4-pop", slideTime);
                    var relativeWide4PopAnimationFactory2 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-4-pop-2", slideTime);
                    var relativeWide4PopAnimationFactory4 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-4-pop-4", slideTime);

                    relativeNarrowPushAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-narrow-push", slideTime);
                    relativeNarrowPopAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-narrow-pop", slideTime);

                    var absoluteNarrowPushAnimationFactory1 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-narrow-push-1", slideTime);
                    var absoluteNarrowPushAnimationFactory2 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-narrow-push-2", slideTime);
                    var absoluteNarrowPopAnimationFactory1 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-narrow-pop-1", slideTime);
                    var absoluteNarrowPopAnimationFactory2 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-narrow-pop-2", slideTime);

                    var absoluteWide3PushAnimationFactory1 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-wide-3-push-1", slideTime);
                    var absoluteWide3PushAnimationFactory2 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-wide-3-push-2", slideTime);
                    var absoluteWide3PushAnimationFactory3 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-wide-3-push-3", slideTime);
                    var absoluteWide3PushAnimationFactory4 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-wide-3-push-4", slideTime);
                    var absoluteWide3PopAnimationFactory1 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-wide-3-pop-1", slideTime);
                    var absoluteWide3PopAnimationFactory2 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-wide-3-pop-2", slideTime);
                    var absoluteWide3PopAnimationFactory3 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-wide-3-pop-3", slideTime);
                    var absoluteWide3PopAnimationFactory4 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-wide-3-pop-4", slideTime);

                    this._relativeAnimationBundlesWide3 = [
                        {
                            popAnimationFactory: relativeWide3PopAnimationFactory,
                            pushAnimationFactory: relativeWide3PushAnimationFactory,
                            selector: ".toolbar_decorator_content_container:nth-of-type(2)"
                        }, {
                            pushAnimationFactory: relativeWide3PushAnimationFactory2,
                            popAnimationFactory: relativeWide3PopAnimationFactory2,
                            selector: ".toolbar_decorator_content_container:nth-of-type(4)"
                        }, {
                            pushAnimationFactory: relativeWide3PushAnimationFactory3,
                            popAnimationFactory: relativeWide3PopAnimationFactory3,
                            selector: ".toolbar_decorator_content_container:nth-of-type(6)"
                        }];
                    this._relativeAnimationBundlesWide4 = [
                        {
                            popAnimationFactory: relativeWide4PopAnimationFactory,
                            pushAnimationFactory: relativeWide4PushAnimationFactory,
                            selector: ".toolbar_decorator_content_container:nth-of-type(2)"
                        }, {
                            popAnimationFactory: relativeWide4PopAnimationFactory2,
                            pushAnimationFactory: relativeWide4PushAnimationFactory2,
                            selector: ".toolbar_decorator_content_container:nth-of-type(4)"
                        }, {
                            popAnimationFactory: relativeWide4PopAnimationFactory4,
                            pushAnimationFactory: relativeWide4PushAnimationFactory4,
                            selector: ".toolbar_decorator_content_container:nth-of-type(8)"
                        }];
                    this._relativeAnimationBundleNarrow = {
                        popAnimationFactory: relativeNarrowPopAnimationFactory,
                        pushAnimationFactory: relativeNarrowPushAnimationFactory,
                        selector: ".toolbar_decorator_content_container:nth-of-type(2)"
                    };
                    this._absoluteAnimationBundlesNarrow = [
                        {
                            popAnimationFactory: absoluteNarrowPopAnimationFactory1,
                            pushAnimationFactory: absoluteNarrowPushAnimationFactory1,
                            selector: ".toolbar_decorator_toolbar_container:nth-of-type(1)"
                        }, {
                            popAnimationFactory: absoluteNarrowPopAnimationFactory2,
                            pushAnimationFactory: absoluteNarrowPushAnimationFactory2,
                            selector: ".toolbar_decorator_toolbar_container:nth-of-type(3)"
                        }];
                    this._absoluteAnimationBundlesWide3 = [
                        {
                            popAnimationFactory: absoluteWide3PopAnimationFactory1,
                            pushAnimationFactory: absoluteWide3PushAnimationFactory1,
                            selector: ".toolbar_decorator_toolbar_container:nth-of-type(1)"
                        }, {
                            popAnimationFactory: absoluteWide3PopAnimationFactory2,
                            pushAnimationFactory: absoluteWide3PushAnimationFactory2,
                            selector: ".toolbar_decorator_toolbar_container:nth-of-type(3)"
                        }, {
                            popAnimationFactory: absoluteWide3PopAnimationFactory3,
                            pushAnimationFactory: absoluteWide3PushAnimationFactory3,
                            selector: ".toolbar_decorator_toolbar_container:nth-of-type(5)"
                        }, {
                            popAnimationFactory: absoluteWide3PopAnimationFactory4,
                            pushAnimationFactory: absoluteWide3PushAnimationFactory4,
                            selector: ".toolbar_decorator_toolbar_container:nth-of-type(7)"
                        }];

                    var stackViewFactoryWide4 = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/stack/stack_wide_4.html", loadables);
                    var stackViewFactoryWide3 = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/stack/stack_wide_3.html", loadables);
                    var stackViewFactoryNarrow = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/stack/stack_narrow.html", loadables);
                    this._stackViewFactory = new templa.dom.mvc.ModeElementViewFactoryProxy(this._modeFunction, {
                        wide_4: stackViewFactoryWide4,
                        wide_3: stackViewFactoryWide3,
                        narrow: stackViewFactoryNarrow
                    });
                    this._emptyStarterViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/empty/empty_starter.html", loadables);
                    this._emptyEnderViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/empty/empty_ender.html", loadables);
                    this._aboutViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/about/about_main.html", loadables);
                    this._homeViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/home/home_main.html", loadables);
                    this._searchViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/search/search_main.html", loadables);
                    this._searchResultsViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/search/search_results_main.html", loadables);
                    this._searchResultsItemContainerViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/search/search_results_item_container_main.html", loadables);
                    this._searchResultsLoadingViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/search/search_results_loading_main.html", loadables);
                    this._searchResultsLoadingSwitcherViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/search/search_results_loading_switcher_main.html", loadables);
                    this._templateSummaryViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/template/template_summary.html", loadables);

                    var statusbarProperties = {};
                    this._statusbarViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/statusbar/statusbar.html", loadables, statusbarProperties);

                    var statusbarDecoratorProperties = {
                        statusbar_decorator_statusbar_container_class: this._statusbarDecoratorStatusbarClass,
                        statusbar_decorator_content_container_class: this._statusbarDecoratorContentClass
                    };
                    this._statusbarDecoratorViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/statusbar/statusbar_decorator.html", loadables, statusbarDecoratorProperties);

                    var toolbarProperties = {
                        toolbar_buttons_back_class: this._toolbarButtonsBackClass,
                        toolbar_buttons_general_class: this._toolbarButtonsGeneralClass
                    };
                    this._toolbarViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/toolbar/toolbar.html", loadables, toolbarProperties);

                    var toolbarNormalCommandElementViewFactory = templa.dom.mvc.jquery.command.TemplateCommandJQueryViewDescriptionFactory.createFromURL("src/main/handlebars/toolbar/toolbar_button_normal.html", loadables);
                    var toolbarBackCommandElementViewFactory = templa.dom.mvc.jquery.command.TemplateCommandJQueryViewDescriptionFactory.createFromURL("src/main/handlebars/toolbar/toolbar_button_back.html", loadables);

                    this._toolbarCommandElementViewFactory = new templa.dom.mvc.jquery.command.IdDelegatingCommandJQueryViewDescriptionFactory(toolbarNormalCommandElementViewFactory, { back: toolbarBackCommandElementViewFactory });

                    var toolbarDecoratorParameters = { toolbar_decorator_class: this._toolbarDecoratorClass, toolbar_decorator_content_class: this._toolbarDecoratorContentClass };
                    var decoratorViewFactoryWide4 = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/toolbar/toolbar_decorator_wide_4.html", loadables, toolbarDecoratorParameters);
                    var decoratorViewFactoryWide3 = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/toolbar/toolbar_decorator_wide_3.html", loadables, toolbarDecoratorParameters);
                    var decoratorViewFactoryNarrow = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/toolbar/toolbar_decorator_narrow.html", loadables, toolbarDecoratorParameters);
                    this._visibleDecoratorViewFactory = new templa.dom.mvc.jquery.DimensionSettingElementViewProxyFactory(new templa.dom.mvc.ModeElementViewFactoryProxy(this._modeFunction, {
                        wide_4: decoratorViewFactoryWide4,
                        wide_3: decoratorViewFactoryWide3,
                        narrow: decoratorViewFactoryNarrow
                    }), "." + this._toolbarDecoratorContentClass, null, ["." + this._statusbarDecoratorStatusbarClass, "#content_padding_measure"], null, "min-height", ["." + this._contextClass, ".content_home"]);

                    var invisibleDecoratorParameters = { toolbar_decorator_class: this._toolbarDecoratorClass, toolbar_decorator_content_class: this._toolbarDecoratorContentClass, toolbar_decorator_content_container_extra: "toolbar_decorator_content_container_invisible" };
                    this._invisibleDecoratorViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/toolbar/toolbar_decorator_wide_3.html", loadables, invisibleDecoratorParameters);

                    var contextProperties = {
                        context_container_class: this._contextClass,
                        context_summary_container_class: this._contextSummaryClass,
                        context_main_container_class: this._contextMainClass
                    };
                    this._contextViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/context/context.html", loadables, contextProperties);

                    var jsonTemplateServiceFunctionFactory = new iassetlab.client.core.service.json.JSONTemplateServiceFunctionFactory();
                    var jsonTemplateServiceFunctionSearch = jsonTemplateServiceFunctionFactory.createSearch();

                    this._templateService = {
                        search: jsonTemplateServiceFunctionSearch
                    };
                };

                AssetLabControllerFactory.prototype.wrapInLoader = function (loadables, controller) {
                    var loadingSwitcherViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL("src/main/handlebars/loading/loading_container.html");
                    var loadingSwitcherController = new templa.dom.mvc.jquery.composite.AbstractCompositeJQueryController(loadingSwitcherViewFactory);

                    var compositeLoadable = new templa.loading.CompositeLoadable(loadables);
                    var loadingModel = new templa.mvc.loading.LoadableProxyingLoadingControllerModel(compositeLoadable);

                    var loadingViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory();
                    var loadingController = new templa.dom.mvc.jquery.loading.ProgressBarLoadingJQueryUIController(loadingViewFactory);

                    loadingController.setModel(loadingModel);

                    var loadingSwitcherModel = new templa.mvc.loading.SwitchOnLoadingCompositeControllerModel(loadingController, controller, loadingModel);
                    loadingSwitcherController.setModel(loadingSwitcherModel);

                    return loadingSwitcherController;
                };

                AssetLabControllerFactory.prototype.create = function () {
                    var _this = this;
                    var e;

                    var getControllersToDisplay = function () {
                        var result = 1;
                        var mode = _this._modeFunction();
                        if (mode == "wide_4") {
                            result = 2;
                        } else if (mode == "wide_3") {
                            result = 1;
                        }
                        return result;
                    };

                    var getPadding = function () {
                        var mode = _this._modeFunction();
                        return mode != "narrow";
                    };

                    var stackController = new iassetlab.client.core.mvc.stack.BackForwardStackController(this._stackViewFactory, this._animationBundleFactory(), ".stack_wing_left", ".stack_wing_right");

                    var decoratorFactory = this.createToolbarDecoratorFactory(stackController);

                    var stackModel = new iassetlab.client.core.mvc.AssetLabStackControllerModel(getControllersToDisplay(), function () {
                        var emptyController = new templa.dom.mvc.AbstractElementController(_this._emptyStarterViewFactory);
                        var emptyModel = new templa.mvc.AbstractModel();
                        emptyController.setModel(emptyModel);
                        return decoratorFactory([emptyController], true);
                    }, function () {
                        var emptyController = new templa.dom.mvc.AbstractElementController(_this._emptyEnderViewFactory);
                        var emptyModel = new templa.mvc.AbstractModel();
                        emptyController.setModel(emptyModel);
                        return decoratorFactory([emptyController], true);
                    }, getPadding());

                    var homeOptionIdsToControllers = {};
                    var homeController = this.createHomeController(this._homeViewFactory, null);
                    var decoratedHomeController = decoratorFactory([homeController]);
                    var homeModel = new iassetlab.client.core.mvc.AssetLabHomeControllerModel(decoratedHomeController, stackModel, homeOptionIdsToControllers);
                    homeController.setModel(homeModel);

                    stackModel._push(decoratedHomeController, AssetLabControllerFactory.controllerNameHome);
                    stackController.setModel(stackModel);

                    var aboutModel = new templa.mvc.AbstractModel();
                    var aboutController = this.createAboutController(this._aboutViewFactory, aboutModel);
                    var decoratedAboutController = this.createContextController(aboutController, this.createHomeController(this._homeViewFactory, homeModel), decoratorFactory);
                    homeOptionIdsToControllers[iassetlab.client.core.mvc.home.HomeController._selectorAbout] = decoratedAboutController;

                    var searchResultControllerFactory = function (searchResult) {
                        // create the controller for this
                        var searchResultModel = new iassetlab.client.core.mvc.AssetLabSearchResultTemplateSummaryModel(searchResult);
                        var searchResultController = new iassetlab.client.core.mvc.template.summary.TemplateSummaryController(_this._templateSummaryViewFactory);
                        searchResultController.setModel(searchResultModel);
                        return searchResultController;
                    };

                    var searchResultsModel = new iassetlab.client.core.mvc.AssetLabSearchResultsControllerModel(20, this._templateService, searchResultControllerFactory);
                    var searchResultsController = this.createSearchResultsController(this._searchResultsViewFactory, searchResultsModel);
                    var decoratedSearchResultsController = this.createContextController(searchResultsController, this.createSearchResultsController(this._searchResultsViewFactory, searchResultsModel), decoratorFactory);

                    var searchController = new iassetlab.client.core.mvc.search.SearchController(this._searchViewFactory);
                    var decoratedSearchController = this.createContextController(searchController, this.createHomeController(this._homeViewFactory, homeModel), decoratorFactory);
                    var searchModel = new iassetlab.client.core.mvc.AssetLabSearchControllerModel(stackModel, decoratedSearchController, decoratedSearchResultsController, searchResultsModel);
                    searchController.setModel(searchModel);
                    homeOptionIdsToControllers[iassetlab.client.core.mvc.home.HomeController._selectorSearch] = decoratedSearchController;

                    // do this after, otherwise the stack order will be wrong
                    //homeModel.requestDisplayOption(iassetlab.client.core.mvc.home.HomeController._selectorAbout);
                    // TODO actual statusbar model
                    var statusbarModel = new templa.mvc.AbstractModel();
                    var decoratedStackController = this.createStatusbarDecoratorFactory(statusbarModel)([stackController]);

                    window.onresize = function () {
                        decoratedStackController.layout();

                        // adjust the number of visible controllers
                        stackModel._setControllersToDisplay(getControllersToDisplay(), getPadding());

                        // adjust the animation factory
                        stackController.setAnimationFactoryBundles(_this._animationBundleFactory());
                    };

                    return decoratedStackController;
                };

                AssetLabControllerFactory.prototype.createSearchResultsController = function (searchResultsViewFactory, searchResultsModel) {
                    var searchResultsController = new templa.dom.mvc.jquery.list.AbstractListJQueryController(searchResultsViewFactory, this._searchResultsItemContainerViewFactory);

                    //return searchResultsController;
                    searchResultsController.setModel(searchResultsModel);

                    // TODO do not use progress bar, have a spinning circle or something?
                    var loadingController = new templa.dom.mvc.AbstractElementController(this._searchResultsLoadingViewFactory);
                    loadingController.setModel(searchResultsModel);

                    var loadingSwitcherController = new templa.dom.mvc.jquery.composite.AbstractCompositeJQueryController(this._searchResultsLoadingSwitcherViewFactory);
                    var loadingSwitcherModel = new templa.mvc.loading.SwitchOnLoadingCompositeControllerModel(loadingController, searchResultsController, searchResultsModel);
                    loadingSwitcherController.setModel(loadingSwitcherModel);

                    return loadingSwitcherController;
                };

                AssetLabControllerFactory.prototype.createHomeController = function (homeViewFactory, homeModel) {
                    var homeController = new iassetlab.client.core.mvc.home.HomeController(homeViewFactory);
                    if (homeModel != null) {
                        homeController.setModel(homeModel);
                    }
                    return homeController;
                };

                AssetLabControllerFactory.prototype.createAboutController = function (aboutViewFactory, aboutModel) {
                    var aboutController = new iassetlab.client.core.mvc.about.AboutController(aboutViewFactory);
                    aboutController.setModel(aboutModel);
                    return aboutController;
                };

                AssetLabControllerFactory.prototype.createContextController = function (mainController, summaryController, decoratorFactory) {
                    var _this = this;
                    // create
                    var controller = new templa.dom.mvc.jquery.composite.KeyedJQueryController(this._contextViewFactory);

                    var keysToControllers = {};
                    keysToControllers["." + this._contextSummaryClass] = summaryController;
                    keysToControllers["." + this._contextMainClass] = mainController;
                    var model = new templa.mvc.composite.MappedKeyedControllerModel(keysToControllers);
                    var modelProxy = new iassetlab.client.core.mvc.filter.FilteringKeyedControllerModelProxy(model, function (controller) {
                        var result;
                        if (controller == summaryController) {
                            result = _this._modeFunction() == "narrow" && window.innerHeight > 640;
                        } else {
                            result = true;
                        }
                        return result;
                    });
                    controller.setModel(modelProxy);

                    // decorate
                    var decoratedController = decoratorFactory([controller]);

                    return decoratedController;
                };

                AssetLabControllerFactory.prototype.createStatusbarDecoratorFactory = function (statusbarModel) {
                    var _this = this;
                    return function (controllers) {
                        var statusbarController = new iassetlab.client.core.mvc.statusbar.StatusbarController(_this._statusbarViewFactory);
                        statusbarController.setModel(statusbarModel);

                        var decoratorController = new templa.dom.mvc.jquery.composite.KeyedJQueryController(_this._statusbarDecoratorViewFactory);
                        decoratorController.setModel(new iassetlab.client.core.mvc.AssetLabDecoratorModel(statusbarController, "." + _this._statusbarDecoratorStatusbarClass, controllers, "." + _this._statusbarDecoratorContentClass));
                        return decoratorController;
                    };
                };

                AssetLabControllerFactory.prototype.createToolbarDecoratorFactory = function (sourceController) {
                    var _this = this;
                    // decorator
                    return function (controllers, invisible) {
                        var toolbarController = new templa.dom.mvc.jquery.command.ToolbarCommandJQueryController(_this._toolbarViewFactory, _this._toolbarCommandElementViewFactory, "." + _this._toolbarButtonsBackClass, "." + _this._toolbarButtonsGeneralClass);
                        toolbarController.setModel(new templa.mvc.command.CommandControllerModelAdapter(sourceController));

                        var viewFactory;
                        if (invisible == true) {
                            viewFactory = _this._invisibleDecoratorViewFactory;
                        } else {
                            viewFactory = _this._visibleDecoratorViewFactory;
                        }

                        var decoratorController = new templa.dom.mvc.jquery.composite.KeyedJQueryController(viewFactory);
                        decoratorController.setModel(new iassetlab.client.core.mvc.AssetLabDecoratorModel(toolbarController, "." + _this._toolbarDecoratorClass, controllers, "." + _this._toolbarDecoratorContentClass));
                        return decoratorController;
                    };
                };
                AssetLabControllerFactory.controllerNameHome = "home";
                return AssetLabControllerFactory;
            })();
            core.AssetLabControllerFactory = AssetLabControllerFactory;
        })(client.core || (client.core = {}));
        var core = client.core;
    })(iassetlab.client || (iassetlab.client = {}));
    var client = iassetlab.client;
})(iassetlab || (iassetlab = {}));
