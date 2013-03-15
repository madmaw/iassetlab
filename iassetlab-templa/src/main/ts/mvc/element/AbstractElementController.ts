///<reference path="IElementViewFactory.ts"/>
///<reference path="IElementView.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../../util/Arrays.ts"/>

module templa.mvc.element {


    export class AbstractElementController implements templa.mvc.IController {

        public _view:IElementView;
        public _model: templa.mvc.IModel;
        private _viewFactory: IElementViewFactory;
        private _commands: templa.mvc.Command[];
        private _state: number;

        private _modelOnChangeListener: (model: templa.mvc.IModel, event: templa.mvc.ModelChangeEvent)=>void;
        private _controllerOnChangeListeners: { (source: templa.mvc.IController, changeEvent: templa.mvc.ControllerChangeEvent): void; }[];

        constructor(_viewFactory:IElementViewFactory) {
            this._viewFactory = _viewFactory;
            this._state = templa.mvc.ControllerStateUninitialized;
        }

        public setModel(model: templa.mvc.IModel) {
            this._model = model;
        }

        public init(container: Element) {
            if (this._state == templa.mvc.ControllerStateUninitialized) {
                this._state = templa.mvc.ControllerStateInitialized;
                this._view = this._viewFactory.create(container);
                this._view.attach();
            }
        }

        public load() {
            this._load(this._model);
        }

        public _load(model: templa.mvc.IModel) {

        }

        public handleModelChangeEvent(event: templa.mvc.ModelChangeEvent) {
            // override to get more fine-grained updates
            this._load(this._model);
        }

        public start() {
            if (this._state == templa.mvc.ControllerStateInitialized) {
                this._state = templa.mvc.ControllerStateStarted;
                this.load();
                // start listening on the model
                this._modelOnChangeListener = (model: templa.mvc.IModel, event: templa.mvc.ModelChangeEvent) => {
                    this.handleModelChangeEvent(event);
                };
                this._model.addOnChangeListener(this._modelOnChangeListener);
            }
        }

        public stop() {
            if (this._state == templa.mvc.ControllerStateStarted) {
                this._state = templa.mvc.ControllerStateInitialized;
                // stop listening on the model
                this._model.removeOnChangeListener(this._modelOnChangeListener);
                this._modelOnChangeListener = null;
            }
        }

        public destroy() {
            if (this._state == templa.mvc.ControllerStateInitialized) {
                this._state = templa.mvc.ControllerStateUninitialized;
                this._view.detach();
                this._view = null;
            }
        }

        public getState(): number {
            return this._state;
        }

        public _find(key: string): Element {
            var result: Element;
            if (this._view != null) {
                result = this._view.find(key);
            } else {
                result = null;
            }
            return result;
        }

        public getCommands(): templa.mvc.Command[]{
            return this._commands;
        }

        public setCommands(commands: templa.mvc.Command[]) {
            this._commands = commands;
            this._fireControllerChangeEvent(new templa.mvc.ControllerChangeEvent(true, false));
        }

        public getTitle(): string {
            return null;
        }

        public addOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void ) {
            if (this._controllerOnChangeListeners == null) {
                this._controllerOnChangeListeners = [];
            }
            this._controllerOnChangeListeners.push(listener);
        }

        public removeOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void ) {
            if (this._controllerOnChangeListeners != null) {
                templa.util.Arrays.removeElement(this._controllerOnChangeListeners, listener);
                if (this._controllerOnChangeListeners.length == 0) {
                    this._controllerOnChangeListeners = null;
                }
            }
        }

        public _fireControllerChangeEvent(controllerChangeEvent: templa.mvc.ControllerChangeEvent) {
            if (this._controllerOnChangeListeners != null) {
                for (var i in this._controllerOnChangeListeners) {
                    var controllerOnChangeListener = this._controllerOnChangeListeners[i];
                    controllerOnChangeListener(this, controllerChangeEvent);
                }
            }
        }

    }
}