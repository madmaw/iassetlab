///<reference path="IElementViewFactory.ts"/>
///<reference path="IElementView.ts"/>
///<reference path="../IModel.ts"/>
///<reference path="../IController.ts"/>

module Templa.Controller {
    export class AbstractElementViewController implements Templa.IController {

        public _view:IElementView;
        public _model:Templa.IModel;
        private _viewFactory:IElementViewFactory;

        private _modelOnChangeListener:(model:Templa.IModel, event:Templa.ModelChangeEvent)=>void;

        constructor(_viewFactory:IElementViewFactory) {
            this._viewFactory = _viewFactory;
        }

        public setModel(model:Templa.IModel) {
            this._model = model;
        }

        public init(container:Element) {
            this._view = this._viewFactory.create(container);
            this._view.attach();
        }

        public load() {
            this._load(this._model);
        }

        public _load(model:Templa.IModel) {

        }

        public handleModelChangeEvent(event:Templa.ModelChangeEvent) {
            // override to get more fine-grained updates
            this._load(this._model);
        }

        public start() {
            this.load();
            // start listening on the model
            this._modelOnChangeListener = (model:Templa.IModel, event:Templa.ModelChangeEvent) => {
                this.handleModelChangeEvent(event);
            };
            this._model.addOnChangeListener(this._modelOnChangeListener);
        }

        public stop() {
            // stop listening on the model
            this._model.removeOnChangeListener(this._modelOnChangeListener);
            this._modelOnChangeListener = null;
        }

        public destroy() {
            this._view.detach();
            this._view = null;
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
    }
}