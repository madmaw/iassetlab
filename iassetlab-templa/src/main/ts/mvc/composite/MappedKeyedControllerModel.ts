///<reference path="../AbstractModel.ts"/>
///<reference path="IKeyedControllerModel.ts"/>

// Module
module templa.mvc.composite {

    // Class
    /**
     * basic implementation of a generic mapped controller
     */
    export class MappedKeyedControllerModel extends AbstractModel implements IKeyedControllerModel {
        constructor(private _controllerMap?: { string: IController; }) {
            super();
            if (this._controllerMap == null) {
                this._controllerMap = <{ string: IController; } >{};
            }
        }

        public getControllerKey(controller: IController): string {
            var result = null;
            for (var key in this._controllerMap) {
                var found = this._controllerMap[key];
                if (found == controller) {
                    result = key;
                    break;
                }
            }
            return result;
        }

        public getControllers(): IController[]{
            var result = [];
            for (var key in this._controllerMap) {
                var controller = this._controllerMap[key];
                result.push(controller);
            }
            return result;
        }

        public setController(key: string, controller: IController) {
            this._controllerMap[key] = controller;
            this._fireModelChangeEvent(compositeControllerModelEventControllersChanged);
        }
    }

}