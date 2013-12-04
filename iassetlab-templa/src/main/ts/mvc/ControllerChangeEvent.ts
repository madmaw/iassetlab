// Module
module templa.mvc {

    // Class
    export class ControllerChangeEvent {
        // Constructor
        constructor(private _commandsChanged: boolean, private _titleChanged: boolean, private _modelChanged?: boolean, private _previousModel?:IModel) {
            if (this._modelChanged == null) {
                this._modelChanged = false;
            }
        }

        public getCommandsChanged(): boolean {
            return this._commandsChanged;
        }
        
        public getTitleChanged(): boolean {
            return this._titleChanged;
        }

        public getModelChanged(): boolean {
            return this._modelChanged;
        }

        public getPreviousModel() {
            return this._previousModel;
        }
    }

}

