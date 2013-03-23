// Module
module templa.mvc {

    // Class
    export class ModelChangeDescription {
        // Constructor
        constructor (private _changeType:string) { }

        public get changeType(): string {
            return this._changeType;
        }
    }

}
