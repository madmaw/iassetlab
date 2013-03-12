module Templa.MVC {
    export class ModelChangeEvent {

        private _changeType:string;
        private _data:any;

        constructor(_changeType?:string, _data?:any) {
            this._changeType = _changeType;
            this._data = _data;
        }

        public get changeType():string {
            return this._changeType;
        }

        public get data():any {
            return this._data;
        }
    }
}