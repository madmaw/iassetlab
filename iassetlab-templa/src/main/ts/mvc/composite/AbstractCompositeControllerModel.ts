///<reference path="../AbstractModel.ts"/>
///<reference path="../IController.ts"/>
///<reference path="ICompositeControllerModel.ts"/>

///<reference path="../../util/Arrays.ts"/>

// Module
module templa.mvc.composite {

    // Class
    export class AbstractCompositeControllerModel extends AbstractModel implements ICompositeControllerModel {

        public _stateDescriptionChangeListener: (source: IModel, change: IModelStateChange) => void;
        private _controllerChangeListener: (source: templa.mvc.IController, change: templa.mvc.ControllerChangeEvent) => void;
        private _previouslyDescribedControllers: templa.mvc.IController[];

        constructor() {
            super();
            this._stateDescriptionChangeListener = (source: IModel, change: IModelStateChange) => {
                if (source != this) {
                    // models can be shared between controllers so we need to be careful we don't propogate our own events 
                    this._fireStateDescriptionChangeEvent(source, change);
                }
            };
            this._controllerChangeListener = (source: templa.mvc.IController, change: templa.mvc.ControllerChangeEvent) => {
                if (change.modelChanged) {
                    var previousModel: templa.mvc.IModel = change.previousModel;
                    if (previousModel != null) {
                        previousModel.removeStateDescriptionChangeListener(this._stateDescriptionChangeListener);
                    }
                    // listen on the new modle
                    var currentModel = source.getModel();
                    if (currentModel != null) {
                        currentModel.addStateDescriptionChangeListener(this._stateDescriptionChangeListener);
                    }
                }
            }
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

        public _startedListeningForStateDescriptionChanges() {
            super._startedListeningForStateDescriptionChanges();
            this._startListeningForStateDescriptionChanges();
        }

        private _startListeningForStateDescriptionChanges() {
            var controllers = this._getDescribedControllers();
            this._previouslyDescribedControllers = [];
            if (controllers != null) {
                // listen on the models for all the controllers
                for (var i in controllers) {
                    var controller: templa.mvc.IController = controllers[i];
                    controller.addOnChangeListener(this._controllerChangeListener);
                    this._previouslyDescribedControllers.push(controller);
                    var model: IModel = controller.getModel();
                    if (model != null) {
                        model.addStateDescriptionChangeListener(this._stateDescriptionChangeListener);
                    }
                }
            }
        }

        public _stoppedListeningForStateDescriptionChanges() {
            super._stoppedListeningForStateDescriptionChanges();
            this._stopListeningForStateDescriptionChanges();
            this._previouslyDescribedControllers = null;
        }

        private _stopListeningForStateDescriptionChanges() {
            var controllers = this._previouslyDescribedControllers;
            if (controllers != null) {
                for (var i in controllers) {
                    var controller: templa.mvc.IController = controllers[i];
                    controller.removeOnChangeListener(this._controllerChangeListener);
                    var model: IModel = controller.getModel();
                    if (model != null) {
                        model.removeStateDescriptionChangeListener(this._stateDescriptionChangeListener);
                    }
                }
            }
        }

        public _updateListeningForStateDescriptionChanges() {
            this._stopListeningForStateDescriptionChanges();
            this._startListeningForStateDescriptionChanges();
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