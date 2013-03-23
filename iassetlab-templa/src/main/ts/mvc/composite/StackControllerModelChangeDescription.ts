///<reference path="../IController.ts"/>
///<reference path="../ModelChangeDescription.ts"/>

// Module
module templa.mvc.composite {

    // Class
    export class StackControllerModelChangeDescription extends ModelChangeDescription {

        // Constructor
        constructor(changeType:string, private _previousController: templa.mvc.IController, private _topController: templa.mvc.IController) {
            super(changeType);
        }

        public get previousController(): templa.mvc.IController {
            return this._previousController;
        }

        public get topController(): templa.mvc.IController {
            return this._topController;
        }

    }

}
