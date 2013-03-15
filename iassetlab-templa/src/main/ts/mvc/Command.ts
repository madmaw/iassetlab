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

        public get priority(): number {
            return this._priority;
        }

        public get commandType(): number {
            return this._commandType;
        }

        public set enabled(_enabled: bool) {
            this._enabled = _enabled;
        }

        public get enabled(): bool {
            return this._enabled;
        }

        public get id(): string {
            return this._id;
        }

        public get action(): () => void {
            return this._action;
        }
    }
}
