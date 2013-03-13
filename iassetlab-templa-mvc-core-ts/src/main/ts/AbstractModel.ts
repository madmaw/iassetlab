///<reference path="IModel.ts"/>
///<reference path="../lib/templa-util.d.ts"/>
module Templa.MVC {

    export class AbstractModel implements Templa.MVC.IModel {
        private _modelOnChangeListeners: { (source: Templa.MVC.IModel, changeEvent: Templa.MVC.ModelChangeEvent) : void; }[];

        constructor() {
            this._modelOnChangeListeners = [];
        }

        public addOnChangeListener(listener: (source: Templa.MVC.IModel, changeEvent: Templa.MVC.ModelChangeEvent) => void ) {
            this._modelOnChangeListeners.push(listener);
            if (this._modelOnChangeListeners.length > 0) {
                this._startedListening();
            }
        }

        public removeOnChangeListener(listener: (source: Templa.MVC.IModel, changeEvent: Templa.MVC.ModelChangeEvent) => void ) {
            var removed = Templa.Util.Arrays.removeElement(this._modelOnChangeListeners, listener);
            if (removed && this._modelOnChangeListeners.length == 0) {
                this._stoppedListening();
            }
        }

        public _startedListening() {
            
        }

        public _stoppedListening() {

        }

        public _fireModelChangeEvent(changeEvent: Templa.MVC.ModelChangeEvent) {
            for (var i in this._modelOnChangeListeners ) {
                var modelOnChangeListener = this._modelOnChangeListeners[i];
                modelOnChangeListener(this, changeEvent);
            }
        }
    }
}