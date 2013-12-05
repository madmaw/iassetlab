///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>

// Module
module iassetlab.client.core.mvc.filter {

    // Class
    export class FilteringKeyedControllerModelProxy extends templa.mvc.AbstractModelProxy implements templa.mvc.composite.IKeyedControllerModel {

        // Constructor
        constructor(
            private _keyedControllerModel: templa.mvc.composite.IKeyedControllerModel,
            private _filter: (controller: templa.mvc.IController)=>boolean
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