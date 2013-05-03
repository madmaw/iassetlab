///<reference path="IModel.ts"/>
///<reference path=../util/Arrays.ts"/>
module templa.mvc {

    export class AbstractModel implements IModel {
        private _modelOnChangeListeners: { (source: IModel, changeEvent: ModelChangeEvent): void; }[];
        private _stateDescriptionChangeListeners: { (source: IModel, change: IModelStateChange): void; }[];
        public _listeningForTokenChanges: bool;

        constructor() {
            this._modelOnChangeListeners = [];
            this._stateDescriptionChangeListeners = [];
        }

        public addOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void ) {
            if (this._modelOnChangeListeners.length == 0) {
                // do this first as we don't want to fire events to all the just added listeners as they're (probably) about to do a load anyway
                this._startedListening();
            }
            this._modelOnChangeListeners.push(listener);
        }

        public removeOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void ) {
            var removed = templa.util.Arrays.removeElement(this._modelOnChangeListeners, listener);
            if (removed && this._modelOnChangeListeners.length == 0) {
                this._stoppedListening();
            }
        }

        public _startedListening() {
            
        }

        public _stoppedListening() {

        }

        public _fireModelChangeEvent(changeDescription?: string, suppressFireStateTokenChange?:bool);
        public _fireModelChangeEvent(changeDescription?: ModelChangeDescription, suppressFireStateTokenChange?: bool);
        public _fireModelChangeEvent(changeEvent?: ModelChangeEvent, suppressFireStateTokenChange?: bool);
        public _fireModelChangeEvent(changeEvent?: any, suppressFireStateTokenChange?: bool) {
            if (changeEvent == null) {
                changeEvent = new ModelChangeEvent();
            } else if (!(changeEvent instanceof ModelChangeEvent)) {
                changeEvent = new ModelChangeEvent(changeEvent);
            }
            for (var i in this._modelOnChangeListeners ) {
                var modelOnChangeListener = this._modelOnChangeListeners[i];
                modelOnChangeListener(this, changeEvent);
            }
            if (suppressFireStateTokenChange != true) {
                // fire state token change event
                this._fireStateDescriptionChangeEvent(this);
            }
        }

        public addStateDescriptionChangeListener(listener: (source: IModel, change: IModelStateChange) => void ) {
            this._stateDescriptionChangeListeners.push(listener);
            if (this._stateDescriptionChangeListeners.length == 1) {
                this._startedListeningForStateDescriptionChanges();
            }
        }

        public removeStateDescriptionChangeListener(listener: (source: IModel, change: IModelStateChange) => void ) {
            templa.util.Arrays.removeElement(this._stateDescriptionChangeListeners, listener);
            if (this._stateDescriptionChangeListeners.length == 0) {
                this._stoppedListeningForStateDescriptionChanges();
            }
        }

        public _startedListeningForStateDescriptionChanges() {
             
        }

        public _stoppedListeningForStateDescriptionChanges() {
        }

        public _fireStateDescriptionChangeEvent(source: IModel, change?: IModelStateChange) {
            var fired = [];
            for (var i in this._stateDescriptionChangeListeners) {
                var stateTokenChangeListener = this._stateDescriptionChangeListeners[i];
                if (fired.indexOf(stateTokenChangeListener) < 0) {
                    stateTokenChangeListener(source, change);
                    // can end up with legitimate duplicates, don't want to fire them multiple times though
                    fired.push(stateTokenChangeListener);
                }
            }
        }


        public createStateDescription(models?: IModel[]): any {
            this._checkModels(models);
            return null;
        }

        public loadStateDescription(description: any) {
            // ignore
        }

        public _checkModels(models: IModel[]) {
            if (models == null) {
                models = [this];
            } else {
                if (models.indexOf(this) >= 0) {
                    throw new Error("this model "+this+" has already been added");
                } else {
                    models.push(this);
                }
            }
            return models;
        }
    }
}