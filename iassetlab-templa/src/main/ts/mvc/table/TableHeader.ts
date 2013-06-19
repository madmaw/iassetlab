///<reference path="../IController.ts"/>

module templa.mvc.table {
    export class TableHeader {
        constructor(
            private _controller: templa.mvc.IController<templa.mvc.IModel>,
            private _fromIndex:number,
            private _span:number
        ) {

        }

        public getController(): templa.mvc.IController<templa.mvc.IModel> {
            return this._controller;
        }

        public getFromIndex():number {
            return this._fromIndex;
        }

        public getSpan(): number {
            return this._span;
        }
    }
}