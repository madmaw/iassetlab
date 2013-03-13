///<reference path="IElementViewFactory.ts"/>
///<reference path="IElementView.ts"/>
///<reference path="../lib/templa-mvc-core.d.ts"/>
///<reference path="../lib/templa-util.d.ts"/>

module Templa.MVC.Element {


    export class AbstractElementController implements Templa.MVC.IController {

        public _view:IElementView;
        public _model: Templa.MVC.IModel;
        private _viewFactory: IElementViewFactory;
        private _commands: Templa.MVC.Command[];
        private _state: number;

        private _modelOnChangeListener: (model: Templa.MVC.IModel, event: Templa.MVC.ModelChangeEvent)=>void;
        private _controllerOnChangeListeners: { (source: Templa.MVC.IController, changeEvent: Templa.MVC.ControllerChangeEvent): void; }[];

        constructor(_viewFactory:IElementViewFactory) {
            this._viewFactory = _viewFactory;
            this._state = Templa.MVC.ControllerStateUninitialized;
        }

        public setModel(model: Templa.MVC.IModel) {
            this._model = model;
        }

        public init(container: Element) {
            if (this._state == Templa.MVC.ControllerStateUninitialized) {
                this._state = Templa.MVC.ControllerStateInitialized;
                this._view = this._viewFactory.create(container);
                this._view.attach();
            }
        }

        public load() {
            this._load(this._model);
        }

        public _load(model: Templa.MVC.IModel) {

        }

        public handleModelChangeEvent(event: Templa.MVC.ModelChangeEvent) {
            // override to get more fine-grained updates
            this._load(this._model);
        }

        public start() {
            if (this._state == Templa.MVC.ControllerStateInitialized) {
                this._state = Templa.MVC.ControllerStateStarted;
                this.load();
                // start listening on the model
                this._modelOnChangeListener = (model: Templa.MVC.IModel, event: Templa.MVC.ModelChangeEvent) => {
                    this.handleModelChangeEvent(event);
                };
                this._model.addOnChangeListener(this._modelOnChangeListener);
            }
        }

        public stop() {
            if (this._state == Templa.MVC.ControllerStateStarted) {
                this._state = Templa.MVC.ControllerStateInitialized;
                // stop listening on the model
                this._model.removeOnChangeListener(this._modelOnChangeListener);
                this._modelOnChangeListener = null;
            }
        }

        public destroy() {
            if (this._state == Templa.MVC.ControllerStateInitialized) {
                this._state = Templa.MVC.ControllerStateUninitialized;
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

        public getCommands(): Templa.MVC.Command[]{
            return this._commands;
        }

        public setCommands(commands: Templa.MVC.Command[]) {
            this._commands = commands;
            this._fireControllerChangeEvent(new Templa.MVC.ControllerChangeEvent(true, false));
        }

        public getTitle(): string {
            return null;
        }

        public addOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void ) {
            this._controllerOnChangeListeners.push(listener);
        }

        public removeOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void ) {
            Templa.Util.Arrays.removeElement(this._controllerOnChangeListeners, listener);
        }

        public _fireControllerChangeEvent(controllerChangeEvent: Templa.MVC.ControllerChangeEvent) {
            for (var i in this._controllerOnChangeListeners) {
                var controllerOnChangeListener = this._controllerOnChangeListeners[i];
                controllerOnChangeListener(this, controllerChangeEvent);
            }
        }

    }
}