///<reference path="../AbstractElementController.ts"/>
///<reference path="../../lib/templa-mvc-core.d.ts"/>

module Templa.MVC.Element.Composite {
    export class AbstractCompositeElementController extends Templa.MVC.Element.AbstractElementController {

        private _controllers: Templa.MVC.IController[];

        constructor(viewFactory: Templa.MVC.Element.IElementViewFactory) {
            super(viewFactory);
        }

        public _load(model: Templa.MVC.IModel) {
            // load up the controllers
            this.clear();
            var compositeControllerModel: Templa.MVC.Composite.ICompositeControllerModel = <Templa.MVC.Composite.ICompositeControllerModel>model;
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

        public add(controller: Templa.MVC.IController) {
            this._controllers.push(controller);
            // TODO check state
            var container: Element = <Element><any>this.getControllerContainer(controller);
            controller.init(container);
            controller.start();
        }

        public getControllerContainer(controller: Templa.MVC.IController):Node {
            return this._view.getRoots()[0];
        }
    }
}