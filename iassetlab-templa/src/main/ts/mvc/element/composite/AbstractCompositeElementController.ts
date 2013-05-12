///<reference path="../AbstractElementController.ts"/>
///<reference path="../ViewRootElementReference.ts"/>
///<reference path="../../composite/ICompositeControllerModel.ts"/>

module templa.mvc.element.composite {
    export class AbstractCompositeElementController extends templa.mvc.element.AbstractElementController {

        public _controllers: templa.mvc.IController[];
        private _controllerOnChangeListener: (controller:IController, event:ControllerChangeEvent) => void;

        constructor(viewFactory: templa.mvc.element.IElementViewFactory) {
            super(viewFactory);
            this._controllers = [];
            this._controllerOnChangeListener = (controller: IController, event: ControllerChangeEvent) => {
                this._fireControllerChangeEvent(event);
            };
        }

        public _doLoad(model: templa.mvc.IModel) {
            // load up the controllers
            this.clear(false);
            var compositeControllerModel: templa.mvc.composite.ICompositeControllerModel = <templa.mvc.composite.ICompositeControllerModel>model;
            var controllers = compositeControllerModel.getControllers();
            for (var i in controllers) {
                var controller = controllers[i];
                this._add(controller, false, false);
            }
            this._fireControllerChangeEvent(new ControllerChangeEvent(true, true));
            this.layout();
        }

        public clear(fireEvent?: bool) {
            if (this._controllers.length > 0) {
                var state = this.getState();
                for (var i in this._controllers) {
                    var controller = this._controllers[i];

                    // check state
                    if (state >= templa.mvc.ControllerStateInitialized) {
                        if (state >= templa.mvc.ControllerStateStarted) {
                            controller.removeOnChangeListener(this._controllerOnChangeListener);
                            controller.stop();
                        }
                        controller.destroy();
                    }
                }
                if (fireEvent) {
                    this._fireControllerChangeEvent(new ControllerChangeEvent(true, true));
                }
                this._controllers = [];
            }
        }

        public _doStart(): bool {
            var result: bool = super._doStart();
            for (var i in this._controllers) {
                var controller = this._controllers[i];
                result = result && controller.start();
            }
            return result;
        }

        public _doStop(): bool {
            var result: bool = super._doStop();
            for (var i in this._controllers) {
                var controller = this._controllers[i];
                result = result && controller.stop();
            }
            return result;
        }

        public _doInit(container: IElementReference, prepend: bool): bool {
            var result: bool = super._doInit(container, prepend);
            for (var i in this._controllers) {
                var controller = this._controllers[i];
                var controllerContainer = this.getControllerContainer(controller);
                result = result && controller.init(<any>controllerContainer, false);
            }
            return result;
        }

        public _doDestroy(detachView?: bool): bool {
            var result: bool = true;
            for (var i in this._controllers) {
                var controller = this._controllers[i];
                // NOTE setting detach view to false will yield some performance benefits since we will just trim the entire tree in one hit (at the parent)
                // TODO are there cases where the view heirarchy does not reflect the controller heirarchy? (I hope not)
                result = controller.destroy(false) && result;
            }
            // destroy our view at the end, otherwise the children cannot remove themselves from an empty view
            result = super._doDestroy(detachView) && result;
            return result;
        }

        public _add(controller: templa.mvc.IController, fireEvent?: bool, layout?:bool, prepend?:bool) {
            this._controllers.push(controller);

            var container: IElementReference = this.getControllerContainer(controller);
            if (container == null) {
                throw "no container!";
            }
            var state: number = this.getState();
            if (state >= ControllerStateInitialized) {
                controller.init(container, prepend);
                if (state >= ControllerStateStarted) {
                    controller.addOnChangeListener(this._controllerOnChangeListener);
                    controller.start();
                }
            }
            if (fireEvent != false) {
                this._fireControllerChangeEvent(new ControllerChangeEvent(true, true));
            }
            if (layout != false) {
                this.layout();
            }
        }

        public _remove(controller: templa.mvc.IController, detachView?: bool, layout?:bool) {
            var removed: bool = templa.util.Arrays.removeElement(this._controllers, controller);
            if (removed) {
                var state: number = this.getState();
                if (state >= ControllerStateInitialized) {
                    if (state >= ControllerStateStarted) {
                        controller.stop();
                        controller.removeOnChangeListener(this._controllerOnChangeListener);
                    }
                    controller.destroy(detachView);
                }
                this._fireControllerChangeEvent(new ControllerChangeEvent(true, true));
                if (layout != false) {
                    this.layout();
                }
            }
        }

        public _handleModelChangeEvent(event: templa.mvc.ModelChangeEvent) {
            super._handleModelChangeEvent(event);
            this._fireControllerChangeEvent(new ControllerChangeEvent(true, true));
        }

        public getControllerContainer(controller: templa.mvc.IController): IElementReference {
            return new ViewRootElementReference(this._view);;
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

        public layout(): void {
            super.layout();
            // layout the children
            for (var i in this._controllers) {
                var controller: IController = this._controllers[i];
                controller.layout();
            }
        }
    }
}