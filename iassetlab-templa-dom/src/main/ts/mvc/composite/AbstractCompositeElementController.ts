///<reference path="../AbstractElementController.ts"/>
///<reference path="../ViewRootElementReference.ts"/>
///<reference path="../IElementReference.ts"/>
///<reference path="../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/> 

// Module
module templa.dom.mvc.composite {
    export class AbstractCompositeElementController<ModelType extends templa.mvc.composite.ICompositeControllerModel> extends templa.dom.mvc.AbstractElementController<ModelType> {

        public _controllers: templa.mvc.IController[];
        private _controllerOnChangeListener: (controller: templa.mvc.IController, event:templa.mvc.ControllerChangeEvent) => void;

        constructor(viewFactory: templa.dom.mvc.IElementViewFactory) {
            super(viewFactory);
            this._controllers = [];
            this._controllerOnChangeListener = (controller: templa.mvc.IController, event: templa.mvc.ControllerChangeEvent) => {
                this._fireControllerChangeEvent(event);
            };
        }

        public _doLoad(model: templa.mvc.composite.ICompositeControllerModel) {
            // load up the controllers
            this.clear(false);
            var compositeControllerModel = model;
            var controllers = compositeControllerModel.getControllers();
            for (var i in controllers) {
                var controller: templa.dom.mvc.IElementController = <templa.dom.mvc.IElementController>controllers[i];
                this._add(controller, false, false);
            }
            this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, true));
            this.layout();
        }

        public clear(fireEvent?: boolean) {
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
                    this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, true));
                }
                this._controllers = [];
            }
        }

        public _doStart(): boolean {
            var result: boolean = super._doStart();
            for (var i in this._controllers) {
                var controller = this._controllers[i];
                result = result && controller.start();
            }
            return result;
        }

        public _doStop(): boolean {
            var result: boolean = super._doStop();
            for (var i in this._controllers) {
                var controller = this._controllers[i];
                result = result && controller.stop();
            }
            return result;
        }

        public _doInit(): boolean {
            var result: boolean = super._doInit();
            for (var i in this._controllers) {
                var controller:templa.dom.mvc.IElementController = <templa.dom.mvc.IElementController>this._controllers[i];
                var controllerContainer = this.getControllerContainer(controller);
                result = result && controller.init(controllerContainer, false);
            }
            return result;
        }

        public _doDestroy(detachView?: boolean): boolean {
            var result: boolean = true;
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

        public _add(controller: templa.dom.mvc.IElementController, fireEvent?: boolean, layout?:boolean, prepend?:boolean) {
            this._controllers.push(controller);

            var container: IElementReference = this.getControllerContainer(controller); 
            if (container == null) {
                throw "no container!";
            }
            var state: number = this.getState();
            if (state >= templa.mvc.ControllerStateInitialized) {
                controller.init(container, prepend);
                if (state >= templa.mvc.ControllerStateStarted) {
                    controller.addOnChangeListener(this._controllerOnChangeListener);
                    controller.start();
                }
            }
            if (fireEvent != false) {
                this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, true));
            }
            if (layout != false) {
                this.layout();
            }
        }

        public _remove(controller: templa.mvc.IController, detachView?: boolean, layout?:boolean) {
            var removed: boolean = templa.util.Arrays.removeElement(this._controllers, controller);
            if (removed) {
                var state: number = this.getState();
                if (state >= templa.mvc.ControllerStateInitialized) {
                    if (state >= templa.mvc.ControllerStateStarted) {
                        controller.stop();
                        controller.removeOnChangeListener(this._controllerOnChangeListener);
                    }
                    controller.destroy(detachView);
                }
                this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, true));
                if (layout != false) {
                    this.layout();
                }
            }
        }

        public _handleModelChangeEvent(event: templa.mvc.ModelChangeEvent) {
            super._handleModelChangeEvent(event);
            this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, true));
        }

        public getControllerContainer(controller: templa.mvc.IController): IElementReference {
            return new templa.dom.mvc.ViewRootElementReference(this._view);;
        }

        public getCommands(): templa.mvc.Command[] {
            var commands: templa.mvc.Command[] = [];
            for (var i in this._controllers) {
                var controller: templa.mvc.IController = this._controllers[i];
                var controllerCommands: templa.mvc.Command[] = controller.getCommands();
                if (controllerCommands != null) {
                    templa.util.Arrays.pushAll(commands, controllerCommands);
                }
            }
            return commands;
        }

        public getTitle(): string {
            var title: string = null;
            for (var i in this._controllers) {
                var controller: templa.mvc.IController = this._controllers[i];
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
                var controller: templa.mvc.IController = this._controllers[i];
                controller.layout();
            }
        }
    }
}