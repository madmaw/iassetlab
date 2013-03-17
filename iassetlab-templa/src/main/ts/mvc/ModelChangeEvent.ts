module templa.mvc {
    export class ModelChangeEvent {

        private _changeType:string;

        constructor(_changeType?:string) {
            this._changeType = _changeType;
        }

        public get changeType():string {
            return this._changeType;
        }
    }
}