// Module
module templa.mvc {

    // Class
    export class ModelChangeDescription {
        // Constructor
        constructor (private _changeType:string) { }

        public getChangeType(): string {
            return this._changeType;
        }
    }

}
