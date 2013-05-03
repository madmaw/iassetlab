///<reference path="../../../../../iassetlab-templa/src/main/ts/mvc/composite/AbstractStackControllerModel.ts"/>


// Module
module iassetlab.client.core.mvc {

    // Class
    export class AssetLabStackControllerModel extends templa.mvc.composite.AbstractStackControllerModel {

        private _prefixedControllers: templa.mvc.IController[];
        private _postfixedControllers: templa.mvc.IController[];
        private _poppedControllers: templa.mvc.IController[];
        private _padControllers: bool;

        // Constructor
        constructor(controllersToDisplay: number, private _prefixControllerFactory: () => templa.mvc.IController, private _postfixControllerFactory: () => templa.mvc.IController) {
            // TODO it's somehow going to have to manage the number of visible entries
            super(false, controllersToDisplay);
            this._prefixedControllers = [];
            this._postfixedControllers = [];
            this._poppedControllers = [];
            this._padControllers = false;
        }

        public get padControllers(): bool {
            return this._padControllers;
        }

        public _setControllersToDisplay(_controllersToDisplay: number) {
            if (this._controllersToDisplay != _controllersToDisplay) {
                this._recalculateControllers(_controllersToDisplay, false);
                super._setControllersToDisplay(_controllersToDisplay);
            }
        }

        public set padControllers(_padControllers: bool) {
            if (this._padControllers != _padControllers) {
                this._padControllers = _padControllers;
                this._recalculateControllers(this._controllersToDisplay, true);
            }
        }

        private _recalculateControllers(controllersToDisplay: number, fireModelChangeEvent:bool) {
            // calculate the controllers we need to add
            this._prefixedControllers = [this._createPrefixController(controllersToDisplay)];
            this._postfixedControllers = [];
            var i = 0;
            while (this._postfixedControllers.length + Math.min(controllersToDisplay, this._stack.length) + this._prefixedControllers.length < controllersToDisplay + 2) {
                var postfixedController;
                if (i >= this._poppedControllers.length) {
                    postfixedController = this._postfixControllerFactory();
                } else {
                    postfixedController = this._poppedControllers[i];
                    i++;
                }
                this._postfixedControllers.push(postfixedController);
            }

            if (fireModelChangeEvent) {
                // invalidate
                this._fireModelChangeEvent();
            }
        }

        public _pushSafe(controller: templa.mvc.IController): bool {
            var result;
            // check that the controller isn't already in the stack
            if (!this._contains(controller)) {
                this._push(controller);
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
                for (var i in this._prefixedControllers) {
                    result.splice(parseInt(i), 0, this._prefixedControllers[i]);
                }
                for (var i in this._postfixedControllers) {
                    result.push(this._postfixedControllers[i]);
                }
            }
            return result;
        }

        private _createPrefixController(controllersToDisplay:number) {
            var prefixController;
            if (this._stack.length > controllersToDisplay) {
                prefixController = this._stack[this._stack.length - controllersToDisplay - 1].controller;
            } else {
                prefixController = this._prefixControllerFactory()
            }
            return prefixController;
        }

        public _pop(suppressFireModelChangeEvent?: bool, suppressFireDescriptionChangeEvent?: bool): templa.mvc.IController {
            var popped = super._pop(this._padControllers || suppressFireModelChangeEvent == true, suppressFireDescriptionChangeEvent);
            if (popped != null) {
                this._poppedControllers.splice(0, 0, popped);
            }
            // save it up 
            if (this._padControllers) {
                if (popped != null) {
                    this._postfixedControllers.splice(0, 0, popped);
                    var removed;
                    if (this._postfixedControllers.length + Math.min(this._controllersToDisplay, this._stack.length) + this._prefixedControllers.length >= this._controllersToDisplay + 2) {
                        removed = this._postfixedControllers[this._postfixedControllers.length - 1];
                        this._postfixedControllers.splice(this._postfixedControllers.length - 1, 1);
                    } else {
                        removed = null;
                    }
                    var added;
                    if (removed != null) {
                        added = this._createPrefixController(this._controllersToDisplay);
                        this._prefixedControllers = [added];
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
            super._pushEntry(entry, this._padControllers || suppressFireModelChangeEvent, suppressFireDescriptionChangeEvent);
            // TODO override so it fires the correct events
            if (this._padControllers) {
                var removed;
                if (this._prefixedControllers.length > 0) {
                    removed = this._prefixedControllers[0];
                } else {
                    removed = null;
                }
                this._prefixedControllers = [this._createPrefixController(this._controllersToDisplay)];
                var added;
                var silentAdded = [];
                var silentRemoved = [];
                // is the added controller the same as the controller that we had buffered?
                if (entry.controller != this._postfixedControllers[0]) {
                    silentAdded.push(entry.controller);
                    while (this._postfixedControllers.length + this._prefixedControllers.length + Math.min(this._stack.length, this._controllersToDisplay) >= this._controllersToDisplay + 2) {
                        silentRemoved.push(this._postfixedControllers[0]);
                        this._postfixedControllers.splice(0, 1);
                    }
                    this._poppedControllers = [];
                } else {
                    this._poppedControllers.splice(0, 1);
                }
                // TODO maintain a list of popped controllers
                if (this._poppedControllers.length > 0) {
                    added = this._poppedControllers[0];
                } else {
                    added = this._postfixControllerFactory();
                }
                this._postfixedControllers.push(added);
                if (suppressFireModelChangeEvent != true) {
                    var changeDescription = new templa.mvc.composite.StackControllerModelChangeDescription(templa.mvc.composite.stackControllerModelEventPushed, removed, added, silentAdded, silentRemoved);
                    this._fireModelChangeEvent(changeDescription, true);

                }
            }
        }

    }
}
