///<reference path="../IController.ts"/>
///<reference path="../ModelChangeDescription.ts"/>

// Module
module templa.mvc.composite {

    // Class
    export class StackControllerModelChangeDescription extends ModelChangeDescription {

        // Constructor
        constructor(changeType: string, private _removedController: templa.mvc.IController<templa.mvc.IModel>, private _addedController: templa.mvc.IController<templa.mvc.IModel>, private _silentRemovedControllers?: templa.mvc.IController<templa.mvc.IModel>[], private _silentAddedControllers?: templa.mvc.IController<templa.mvc.IModel>[]) {
            super(changeType);
        }

        public getRemovedController(): templa.mvc.IController<templa.mvc.IModel> {
            return this._removedController;
        }

        public getAddedController(): templa.mvc.IController<templa.mvc.IModel> {
            return this._addedController;
        }

        public getSilentRemovedControllers(): templa.mvc.IController<templa.mvc.IModel>[]{
            return this._silentRemovedControllers;
        }

        public getSilentAddedControllers(): templa.mvc.IController<templa.mvc.IModel>[]{
            return this._silentAddedControllers;
        }
    }

}
