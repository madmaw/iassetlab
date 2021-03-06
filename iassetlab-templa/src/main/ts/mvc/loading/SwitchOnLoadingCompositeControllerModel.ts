///<reference path="ILoadingControllerModel.ts"/>
///<reference path="../IModel.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../ModelChangeEvent.ts"/>
///<reference path="../composite/AbstractCompositeControllerModel.ts"/>
///<reference path="../composite/ICompositeControllerModel.ts"/>

// Module
module templa.mvc.loading {

    // Class
    export class SwitchOnLoadingCompositeControllerModel extends templa.mvc.composite.AbstractCompositeControllerModel implements templa.mvc.composite.ICompositeControllerModel {

        private _currentControllers: IController[];
        private _onChangeListener: (source: IModel, event: ModelChangeEvent) => void;

        

        // Constructor
        constructor(private _loadingController: IController, private _contentController: IController, private _loadingModel:ILoadingControllerModel) {
            super();
            this._currentControllers = [];
            this._onChangeListener = (source: IModel, event: ModelChangeEvent) => {
                this._checkCurrentController();
            };
        }

        public _startedListening() {
            this._checkCurrentController();
            this._loadingModel.addOnChangeListener(this._onChangeListener);
        }

        public _stoppedListening() {
            this._loadingModel.removeOnChangeListener(this._onChangeListener);
        }

        public getControllers(): IController[]{
            return this._currentControllers;
        }

        public _getDescribedControllers(): IController[]{
            return [this._contentController];
        }

        public createStateDescription(models?: IModel[]): any {
            return this._contentController.getModel().createStateDescription();
        }

        public loadStateDescription(description: any) {
            return this._contentController.getModel().loadStateDescription(description);
        }


        public _checkCurrentController() {
            var currentController;
            if (this._loadingModel.isComplete()) {
                currentController = this._contentController;
            } else {
                currentController = this._loadingController;
            }
            var changed;
            if (this._currentControllers.length == 0) {
                this._currentControllers.push(currentController);
                changed = true;
            } else {
                if (this._currentControllers[0] != currentController) {
                    this._currentControllers[0] = currentController;
                    changed = true;
                } else {
                    changed = false;
                }
            }
            if (changed) {
                this._fireModelChangeEvent(templa.mvc.composite.compositeControllerModelEventControllersChanged, true);
            }
        }


    }

}