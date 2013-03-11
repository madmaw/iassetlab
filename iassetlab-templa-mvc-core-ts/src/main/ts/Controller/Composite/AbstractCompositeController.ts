///<reference path="../AbstractElementViewController.ts"/>
///<reference path="../../IController.ts"/>
///<reference path="ICompositeControllerModel.ts"/>

module Templa.Controller.Composite {
    export class AbstractCompositeController extends Templa.Controller.AbstractElementViewController {

        private _controllers: Templa.IController[];

        constructor(viewFactory:Templa.Controller.IElementViewFactory) {
            super(viewFactory);
        }

        public _load(model:Templa.IModel) {
            // load up the controllers
            this.clear();
            var compositeControllerModel:ICompositeControllerModel = <ICompositeControllerModel>model;
            var controllers = compositeControllerModel.getControllers();
            for( var i in controllers ) {
                var controller = controllers[i];
                this.add(controller);
            }
        }

        public clear() {
            for( var i in this._controllers ) {
                var controller = this._controllers[i];
                // TODO check state
                controller.stop();
                // TODO check state
                controller.destroy();
            }
        }

        public add(controller:Templa.IController) {
            this._controllers.push(controller);
            // TODO check state
            var container:HTMLElement = <HTMLElement>this.getControllerContainer(controller);
            controller.init(container);
            controller.start();
        }

        public getControllerContainer(controller:Templa.IController):Node {
            return this._view.getRoots()[0];
        }
    }
}