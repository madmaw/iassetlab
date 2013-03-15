// Module
module templa.mvc {

    // Class
    export class ControllerChangeEvent {
        // Constructor
        constructor(private _commandsChanged: bool, private _titleChanged: bool) { }

        public get commandsChanged(): bool {
            return this._commandsChanged;
        }
        
        public get titleChanged(): bool {
            return this._titleChanged;
        }
    }

}

