///<reference path="../IController.ts"/>
///<reference path="../ModelChangeDescription.ts"/>

// Module
module templa.mvc.composite {

    // Class
    export class StackControllerModelChangeDescription extends ModelChangeDescription {

        // Constructor
        constructor(
            changeType: string,
            private _removedController: templa.mvc.IController,
            private _addedController: templa.mvc.IController,
            private _silentRemovedControllers?: templa.mvc.IController[],
            private _silentAddedControllers?: templa.mvc.IController[]
        ) {
            super(changeType);
        }

        public getRemovedController(): templa.mvc.IController {
            return this._removedController;
        }

        public getAddedController(): templa.mvc.IController {
            return this._addedController;
        }

        public getSilentRemovedControllers(): templa.mvc.IController[]{
            return this._silentRemovedControllers;
        }

        public getSilentAddedControllers(): templa.mvc.IController[]{
            return this._silentAddedControllers;
        }
    }

}
