module templa.mvc {

    export var CommandTypeScreen = 0;
    export var CommandTypeBack = 1;
    export var CommandTypeForward = 2;

    // Class
    export class Command {

        private _enabled: bool;

        // Constructor
        constructor(private _id: string, private _commandType:number, private _priority:number, private _action:() => void) {
            this._enabled = true;
        }

        public getPriority(): number {
            return this._priority;
        }

        public getCommandType(): number {
            return this._commandType;
        }

        public setEnabled(_enabled: bool) {
            this._enabled = _enabled;
        }

        public getEnabled(): bool {
            return this._enabled;
        }

        public getId(): string {
            return this._id;
        }

        public getAction(): () => void {
            return this._action;
        }
    }
}
