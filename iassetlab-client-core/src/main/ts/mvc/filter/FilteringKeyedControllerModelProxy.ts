///<reference path="../../../../../../iassetlab-templa/src/main/ts/mvc/AbstractModelProxy.ts"/>
///<reference path="../../../../../../iassetlab-templa/src/main/ts/mvc/composite/IKeyedControllerModel.ts"/>

// Module
module iassetlab.client.core.mvc.filter {

    // Class
    export class FilteringKeyedControllerModelProxy extends templa.mvc.AbstractModelProxy implements templa.mvc.composite.IKeyedControllerModel {

        // Constructor
        constructor(
            private _keyedControllerModel: templa.mvc.composite.IKeyedControllerModel,
            private _filter:(controller:templa.mvc.IController)=>bool
        ) {
            super(_keyedControllerModel);
        }


        public getControllerKey(controller: templa.mvc.IController): string {
            return this._keyedControllerModel.getControllerKey(controller);
        }

        public getControllers(): templa.mvc.IController[]{
            var result = [];
            var controllers = this._keyedControllerModel.getControllers();
            for (var i in controllers) {
                var controller: templa.mvc.IController = controllers[i];
                if (this._filter(controller)) {
                    result.push(controller);
                }
            }
            return result;
        }
    }

}