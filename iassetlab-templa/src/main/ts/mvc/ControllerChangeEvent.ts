// Module
module templa.mvc {

    // Class
    export class ControllerChangeEvent {
        // Constructor
        constructor(private _commandsChanged: bool, private _titleChanged: bool, private _modelChanged?: bool, private _previousModel?:IModel) {
            if (this._modelChanged == null) {
                this._modelChanged = false;
            }
        }

        public get commandsChanged(): bool {
            return this._commandsChanged;
        }
        
        public get titleChanged(): bool {
            return this._titleChanged;
        }

        public get modelChanged(): bool {
            return this._modelChanged;
        }

        public get previousModel() {
            return this._previousModel;
        }
    }

}

