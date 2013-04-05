///<reference path="../AbstractModel.ts"/>

// Module
module templa.mvc.composite {

    // Class
    export class AbstractCompositeControllerModel extends AbstractModel implements ICompositeControllerModel {

        public _stateTokenChangeListener: (source: IModel) => void;

        constructor() {
            super();
            this._stateTokenChangeListener = (source: IModel) => {
                if (source != this) {
                    // models can be shared between controllers so we need to be careful we don't propogate our own events 
                    this._fireStateDescriptionChangeEvent(source);
                }
            };
        }

        public _getDescribedControllers(): IController[] {
            var controllers = this.getControllers();
            var result = [];
            // TODO should be a better way
            for (var i in controllers) {
                var controller:IController = controllers[i];
                if (controller.getModel() != this) {
                    result.push(controller);
                }
            }
            return result;
        }

        public getControllers(): IController[]{
            return [];
        }

        public _startedListeningForTokenChanges() {
            super._startedListeningForTokenChanges();
            var controllers = this._getDescribedControllers();
            if (controllers != null) {
                // listen on the models for all the controllers
                for (var i in controllers) {
                    var controller = controllers[i];
                    var model: IModel = controller.getModel();
                    if (model != null) {
                        model.addStateDescriptionChangeListener(this._stateTokenChangeListener);
                    }
                }
            }
        }

        public _stoppedListeningForTokenChanges() {
            super._startedListeningForTokenChanges();
            var controllers = this._getDescribedControllers();
            if (controllers != null) {
                for (var i in controllers) {
                    var controller = controllers[i];
                    var model: IModel = controller.getModel();
                    if (model != null) {
                        model.removeStateDescriptionChangeListener(this._stateTokenChangeListener);
                    }
                }
            }
        }

        public createStateDescription(models?: IModel[]): any {
            models = this._checkModels(models);
            var controllers = this._getDescribedControllers();
            var result = [];
            if (controllers != null) {
                for (var i in controllers) {
                    var controller = controllers[i];
                    var model = controller.getModel();
                    var entry;
                    if (model != null) {
                        entry = model.createStateDescription(models);
                    } else {
                        entry = null;
                    }
                    result.push(entry);
                }
            }
            return result;
        }

        public loadStateDescription(description: any) {
            var controllers = this._getDescribedControllers();
            var descriptions = <any[]>description;
            for (var i in descriptions) {
                var entry = descriptions[i];
                var controller:IController = controllers[i];
                var model = controller.getModel();
                if (model != null) {
                    model.loadStateDescription(entry);
                }
            }
        }
    }

}