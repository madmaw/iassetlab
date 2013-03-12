///<reference path="IElementViewFactory.ts"/>
///<reference path="IElementView.ts"/>
///<reference path="../lib/templa-mvc-core.d.ts"/>

module Templa.MVC.Element {
    export class AbstractElementController implements Templa.MVC.IController {

        public _view:IElementView;
        public _model: Templa.MVC.IModel;
        private _viewFactory:IElementViewFactory;

        private _modelOnChangeListener: (model: Templa.MVC.IModel, event: Templa.MVC.ModelChangeEvent)=>void;

        constructor(_viewFactory:IElementViewFactory) {
            this._viewFactory = _viewFactory;
        }

        public setModel(model: Templa.MVC.IModel) {
            this._model = model;
        }

        public init(container:Element) {
            this._view = this._viewFactory.create(container);
            this._view.attach();
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
            this.load();
            // start listening on the model
            this._modelOnChangeListener = (model: Templa.MVC.IModel, event: Templa.MVC.ModelChangeEvent) => {
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