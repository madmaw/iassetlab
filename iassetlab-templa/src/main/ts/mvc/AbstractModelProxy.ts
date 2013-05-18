///<reference path="IModel.ts"/>
///<reference path="AbstractModel.ts"/>

// Module
module templa.mvc {

    // Class
    export class AbstractModelProxy extends AbstractModel implements IModel {

        private _onChangeListener: (source: IModel, event: ModelChangeEvent) => void;
        private _onStateChangeListener: (source: IModel, event: IModelStateChange) => void;

        // Constructor
        constructor(private _model: IModel) {
            super();

            this._onChangeListener = (source: IModel, event: ModelChangeEvent) => {
                this._fireModelChangeEvent(event, true);
            };

            this._onStateChangeListener = (source: IModel, event: IModelStateChange) => {
                this._fireStateDescriptionChangeEvent(source, event);
            };
        }

        public _startedListening() {
            this._model.addOnChangeListener(this._onChangeListener);
        }

        public _stoppedListening() {
            this._model.removeOnChangeListener(this._onChangeListener);
        }

        public _startedListeningForStateDescriptionChanges() {
            this._model.addStateDescriptionChangeListener(this._onStateChangeListener);
        }

        public _stoppedListeningForStateDescriptionChanges() {
            this._model.removeStateDescriptionChangeListener(this._onStateChangeListener);
        }


    }

}
