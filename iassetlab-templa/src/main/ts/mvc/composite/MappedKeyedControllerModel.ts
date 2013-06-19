///<reference path="AbstractCompositeControllerModel.ts"/>
///<reference path="IKeyedControllerModel.ts"/>

// Module
module templa.mvc.composite {

    // Class
    /**
     * basic implementation of a generic mapped controller
     */
    export class MappedKeyedControllerModel extends AbstractCompositeControllerModel implements IKeyedControllerModel {

        // TODO remove this alternate constructor once compiler gets fixed
        constructor(public _controllerMap?: { [_:string]: IController<IModel>; }) {
            super();
            this._listeningForTokenChanges = false;
            if (this._controllerMap == null) {
                this._controllerMap = <{ string: IController<IModel>; } >{};
            }
        }

        public getControllerKey(controller: IController<IModel>): string {
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

        public getControllers(): IController<IModel>[]{
            var result = [];
            for (var key in this._controllerMap) {
                var controller = this._controllerMap[key];
                result.push(controller);
            }
            return result;
        }

        public setController(key: string, controller: IController<IModel>, doNotFireEvent?: bool) {
            if (this._listeningForTokenChanges) {
                var oldController: IController<IModel> = this._controllerMap[key];
                if (oldController != null) {
                    var oldModel = oldController.getModel();
                    if (oldModel != null) {
                        oldModel.removeStateDescriptionChangeListener(this._stateDescriptionChangeListener);
                    }
                }
            }
            this._controllerMap[key] = controller;
            if (controller != null) {
                var model = controller.getModel();
                if (model != null) {
                    model.addStateDescriptionChangeListener(this._stateDescriptionChangeListener);
                }
            }
            if (doNotFireEvent != true) {
                this._fireModelChangeEvent(compositeControllerModelEventControllersChanged);
            }
        }

        public _getDescribedControllerKey(controller: IController<templa.mvc.IModel>): string {
            return this.getControllerKey(controller);
        }

        public _getDescribedController(key: string): IController<templa.mvc.IModel> {
            return this._controllerMap[key];
        }


        public createStateDescription(models?: IModel[]): any {
            models = this._checkModels(models);

            var result = {};
            var controllers = this._getDescribedControllers();
            for (var i in controllers) {
                var controller: IController<IModel> = controllers[i];
                var model = controller.getModel();

                if (model != null && models.indexOf(model) < 0) {
                    var key = this._getDescribedControllerKey(controller);
                    var description = model.createStateDescription(models);
                    if (description != null) {
                        result[key] = description;
                    }
                }
            }
            return result;
        }

        public loadStateDescription(description: any) {
            var result = {};
            for (var key in description) {
                var controller: IController<IModel> = this._getDescribedController(key);
                if (controller != null) {
                    var model = controller.getModel();
                    if (model != null) {
                        var modelDescription = description[key];
                        model.loadStateDescription(modelDescription);
                    }
                }
            }
        }
    }
}