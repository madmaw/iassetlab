///<reference path="../IModel.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../IModelStateChange.ts"/>
///<reference path="../../../d.ts/rison.d.ts"/>

// Module
module templa.mvc.history {

    // Class
    export class WebHistoryManager {

        private _stateDescriptionChangeListener: (model : IModel, modelStateChange: IModelStateChange) => void;
        private _historyChangeListener: EventListener;

        private _model: IModel;
        private _modelStateChanges: IModelStateChange[];
        private _modelStateChangeIndex: number;
        private _lastKnownData: string;

        // Constructor
        constructor(private _controller: IController) {
            this._modelStateChanges = [];
            this._modelStateChangeIndex = null;
            this._lastKnownData = null;
            // TODO listen for changes to the model
            this._model = this._controller.getModel();

            this._stateDescriptionChangeListener = (model: IModel, modelStateChange: IModelStateChange) => {
                this.push(modelStateChange);
            };

            this._historyChangeListener = (event: PopStateEvent) => {
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
                var change: IModelStateChange;
                if (parsedChangeIndex != null && this._modelStateChangeIndex != null && this._modelStateChanges.length > parsedChangeIndex) {
                    if (parsedChangeIndex > this._modelStateChangeIndex) {
                        back = false;
                        change = this._modelStateChanges[parsedChangeIndex];
                    } else {
                        change = this._modelStateChanges[this._modelStateChangeIndex];
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
                    this._controller.stop();
                    this._model.loadStateDescription(description);
                    this._controller.start();
                }
                this._modelStateChangeIndex = parsedChangeIndex;
            };

        }

        public push(modelStateChange: IModelStateChange, replace?:boolean) {
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
        }

        public start(): void {
            // force a hash on the URL
            var hash = window.location.hash;
            if (hash == null || hash.length == 0) {
                this.push(null, true);
            }
            this._model.addStateDescriptionChangeListener(this._stateDescriptionChangeListener);
            window.addEventListener('popstate', this._historyChangeListener);
        }

        public stop(): void {
            this._model.removeStateDescriptionChangeListener(this._stateDescriptionChangeListener);
            window.removeEventListener('popstate', this._historyChangeListener);
        }
    }

}