///<reference path="IModel.ts"/>
///<reference path=../util/Arrays.ts"/>
module templa.mvc {

    export class AbstractModel implements IModel {
        private _modelOnChangeListeners: { (source: IModel, changeEvent:ModelChangeEvent) : void; }[];

        constructor() {
            this._modelOnChangeListeners = [];
        }

        public addOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void ) {
            this._modelOnChangeListeners.push(listener);
            if (this._modelOnChangeListeners.length > 0) {
                this._startedListening();
            }
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

        public _fireModelChangeEvent(changeEvent: ModelChangeEvent) {
            for (var i in this._modelOnChangeListeners ) {
                var modelOnChangeListener = this._modelOnChangeListeners[i];
                modelOnChangeListener(this, changeEvent);
            }
        }
    }
}