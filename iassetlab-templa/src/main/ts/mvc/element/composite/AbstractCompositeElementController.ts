///<reference path="../AbstractElementController.ts"/>
///<reference path="../../composite/ICompositeControllerModel.ts"/>

module templa.mvc.element.composite {
    export class AbstractCompositeElementController extends templa.mvc.element.AbstractElementController {

        private _controllers: templa.mvc.IController[];

        constructor(viewFactory: templa.mvc.element.IElementViewFactory) {
            super(viewFactory);
            this._controllers = [];
        }

        public _load(model: templa.mvc.IModel) {
            // load up the controllers
            this.clear(false);
            var compositeControllerModel: templa.mvc.composite.ICompositeControllerModel = <templa.mvc.composite.ICompositeControllerModel>model;
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

        public add(controller: templa.mvc.IController, fireEvent?:bool) {
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

        public remove(controller: templa.mvc.IController) {
            var removed: bool = templa.util.Arrays.removeElement(this._controllers, controller);
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

        public getControllerContainer(controller: templa.mvc.IController):Node {
            return this._view.getRoots()[0];
        }

        public getCommands(): templa.mvc.Command[] {
            var commands: templa.mvc.Command[] = [];
            for (var i in this._controllers) {
                var controller: IController = this._controllers[i];
                var controllerCommands: Command[] = controller.getCommands();
                if (controllerCommands != null) {
                    templa.util.Arrays.pushAll(commands, controllerCommands);
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