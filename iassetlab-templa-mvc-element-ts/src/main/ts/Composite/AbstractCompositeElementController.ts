///<reference path="../AbstractElementController.ts"/>
///<reference path="../../lib/templa-mvc-core.d.ts"/>
///<reference path="../../lib/templa-util.d.ts"/>

module Templa.MVC.Element.Composite {
    export class AbstractCompositeElementController extends Templa.MVC.Element.AbstractElementController {

        private _controllers: Templa.MVC.IController[];

        constructor(viewFactory: Templa.MVC.Element.IElementViewFactory) {
            super(viewFactory);
            this._controllers = [];
        }

        public _load(model: Templa.MVC.IModel) {
            // load up the controllers
            this.clear(false);
            var compositeControllerModel: Templa.MVC.Composite.ICompositeControllerModel = <Templa.MVC.Composite.ICompositeControllerModel>model;
            var controllers = compositeControllerModel.getControllers();
            for( var i in controllers ) {
                var controller = controllers[i];
                this.add(controller, false);
            }
            this._fireControllerChangeEvent(new ControllerChangeEvent(true, true));
        }

        public clear(fireEvent?:bool) {
            if (this._controllers.length > 0) {

                for (var i in this._controllers) {
                    var controller = this._controllers[i];
                    // TODO check state
                    controller.stop();
                    // TODO check state
                    controller.destroy();
                }
                if (fireEvent) {
                    this._fireControllerChangeEvent(new ControllerChangeEvent(true, true));
                }
                this._controllers = [];
            }
        }

        public add(controller: Templa.MVC.IController, fireEvent?:bool) {
            this._controllers.push(controller);
            // TODO check state
            var container: Element = <Element><any>this.getControllerContainer(controller);
            var state: number = this.getState();
            if (state >= ControllerStateInitialized) {
                controller.init(container);
                if (state >= ControllerStateStarted) {
                    controller.start();
                }
            }
            if (fireEvent) {
                this._fireControllerChangeEvent(new ControllerChangeEvent(true, true));
            }
        }

        public remove(controller: Templa.MVC.IController) {
            var removed: bool = Templa.Util.Arrays.removeElement(this._controllers, controller);
            if (removed) {
                var state: number = this.getState();
                if (state >= ControllerStateInitialized) {
                    if (state >= ControllerStateStarted) {
                        controller.stop();
                    }
                    controller.destroy();
                }
                this._fireControllerChangeEvent(new ControllerChangeEvent(true, true));
            }
        }

        public getControllerContainer(controller: Templa.MVC.IController):Node {
            return this._view.getRoots()[0];
        }

        public getCommands(): Templa.MVC.Command[] {
            var commands: Templa.MVC.Command[] = [];
            for (var i in this._controllers) {
                var controller: IController = this._controllers[i];
                var controllerCommands: Command[] = controller.getCommands();
                if (controllerCommands != null) {
                    Templa.Util.Arrays.pushAll(commands, controllerCommands);
                }
            }
            return commands;
        }

        public getTitle(): string {
            var title: string = null;
            for (var i in this._controllers) {
                var controller: IController = this._controllers[i];
                title = controller.getTitle();
                if (title != null) {
                    break;
                }
            }
            return title;
        }

    }
}