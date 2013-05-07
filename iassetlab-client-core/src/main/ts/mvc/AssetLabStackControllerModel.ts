///<reference path="stack/IBackForwardStackControllerModel.ts"/>

///<reference path="../../../../../iassetlab-templa/src/main/ts/mvc/composite/AbstractStackControllerModel.ts"/>



// Module
module iassetlab.client.core.mvc {

    // Class
    export class AssetLabStackControllerModel extends templa.mvc.composite.AbstractStackControllerModel implements iassetlab.client.core.mvc.stack.IBackForwardStackControllerModel {

        private _prefixedControllerEntries: templa.mvc.composite.IAbstractStackControllerModelEntry[];
        private _postfixedControllerEntries: templa.mvc.composite.IAbstractStackControllerModelEntry[];
        private _poppedControllerEntries: templa.mvc.composite.IAbstractStackControllerModelEntry[];

        // Constructor
        constructor(
            controllersToDisplay: number,
            private _prefixControllerFactory: () => templa.mvc.IController,
            private _postfixControllerFactory: () => templa.mvc.IController,
            private _padControllers:bool
        ) {
            // TODO it's somehow going to have to manage the number of visible entries
            super(false, controllersToDisplay);
            this._prefixedControllerEntries = [];
            this._postfixedControllerEntries = [];
            this._poppedControllerEntries = [];
            this._recalculateControllers(controllersToDisplay, _padControllers);
        }

        public canPush(): bool {
            var result;
            if (this._postfixedControllerEntries.length > 0) {
                var postfixedControllerEntry = this._postfixedControllerEntries[0];
                result = (postfixedControllerEntry["padding"] != true);
            } else {
                result = false;
            }
            return result;
        }

        public requestPush(): void {
            this._pushEntry(this._postfixedControllerEntries[0]);
        }

        public get padControllers(): bool {
            return this._padControllers;
        }

        public set padControllers(_padControllers: bool) {
            if (this._padControllers != _padControllers) {
                this._padControllers = _padControllers;
                this._recalculateControllers(this._controllersToDisplay, true);
            }
        }

        public _setControllersToDisplay(_controllersToDisplay: number, _padControllers?:bool) {
            if (this._controllersToDisplay != _controllersToDisplay) {
                if (_padControllers != null) {
                    this._padControllers = _padControllers;
                }
                this._recalculateControllers(_controllersToDisplay, false);
                super._setControllersToDisplay(_controllersToDisplay);
            } else if (_padControllers != this._padControllers) {
                this.padControllers = _padControllers;
            }
        }

        private _recalculateControllers(controllersToDisplay: number, fireModelChangeEvent:bool) {
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
                        }
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
        }

        public _pushPair(previous: templa.mvc.IController, controller: templa.mvc.IController): bool {
            // is the controller already ontop
            var result;
            // check that the controller isn't already in the stack
            if (!this._contains(controller)) {
                var fullReload = false;
                if (!this._contains(previous)) {
                    this._push(previous);
                    fullReload = true;
                } else {
                    // pop back to the previous controller
                    while (this.peek != previous) {
                        // do not animate
                        this._pop(true, true);
                        fullReload = true;
                    }
                }
                this._push(controller, null, fullReload, fullReload);
                if (fullReload) {
                    this._fireModelChangeEvent();
                    this._fireStateDescriptionChangeEvent(this);
                }
                result = true;
            } else {
                result = false;
            }
            return result;
        }

        // override so all the shit workds
        public getControllers(): templa.mvc.IController[]{
            var result = super.getControllers();
            if (this._padControllers) {
                for (var i in this._prefixedControllerEntries) {
                    result.splice(parseInt(i), 0, this._prefixedControllerEntries[i].controller);
                }
                for (var i in this._postfixedControllerEntries) {
                    result.push(this._postfixedControllerEntries[i].controller);
                }
            }
            return result;
        }

        private _createPrefixControllerEntry(controllersToDisplay:number): templa.mvc.composite.IAbstractStackControllerModelEntry {
            var prefixControllerEntry;
            var supportsBack;
            if (this._stack.length > controllersToDisplay) {
                prefixControllerEntry = this._stack[this._stack.length - controllersToDisplay - 1];
                supportsBack = true;
            } else {
                var prefixController = this._prefixControllerFactory()
                var prefixControllerEntry = {
                    controller: prefixController
                };
                supportsBack = false;
            }
            return prefixControllerEntry;
        }

        public _pop(suppressFireModelChangeEvent?: bool, suppressFireDescriptionChangeEvent?: bool): templa.mvc.composite.IAbstractStackControllerModelEntry {
            var popped = super._pop(this._padControllers || suppressFireModelChangeEvent == true, suppressFireDescriptionChangeEvent);
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
                }
            }
            return popped;
        }

        public _pushEntry(entry: templa.mvc.composite.IAbstractStackControllerModelEntry, suppressFireModelChangeEvent?: bool, suppressFireDescriptionChangeEvent?: bool) {
            var originalStackLength = this._stack.length;
            super._pushEntry(entry, this._padControllers || suppressFireModelChangeEvent, suppressFireDescriptionChangeEvent);
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

                    if (entry.controller != this._postfixedControllerEntries[0].controller) {
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
                    // replace the next postfix
                    // remove all the postfixed controllers
                    for (var i in this._postfixedControllerEntries) {
                        silentRemoved.push(this._postfixedControllerEntries[i].controller);
                    }
                    this._postfixedControllerEntries.splice(0, 1);
                    silentAdded.push(entry.controller);
                    // add them back in (for ordering only) 
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
            }
        }

    }
}
