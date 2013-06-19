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

        public getCommandsChanged(): bool {
            return this._commandsChanged;
        }
        
        public getTitleChanged(): bool {
            return this._titleChanged;
        }

        public getModelChanged(): bool {
            return this._modelChanged;
        }

        public getPreviousModel() {
            return this._previousModel;
        }
    }

}

