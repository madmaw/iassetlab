///<reference path="IElementController.ts"/>
///<reference path="IElementViewFactory.ts"/>
///<reference path="IElementView.ts"/>
///<reference path="AttributeElementReference.ts"/>
///<reference path="IElementReference.ts"/>

///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc {

    
    export class AbstractElementController<ModelType extends templa.mvc.IModel> extends templa.mvc.AbstractController<ModelType> implements IElementController {

        public _view: IElementView;
        public _viewContainer: IElementReference;
        private _viewPrepend: boolean;


        constructor(private _viewFactory: IElementViewFactory) {
            super();
        }

        public getView(): templa.mvc.IView {
            return this._view;
        }

        public init(container: IElementReference, prepend?: boolean): boolean {
            this._viewContainer = container;
            this._viewPrepend = prepend;
            this._view = this._viewFactory.create(container, prepend);
            this._view.attach();
            return super._init();
        }

        public _reinitialize() {
            this.init(this._viewContainer, this._viewPrepend);
        }

        public load() {
            super.load();
            this.layout();
        }


        public _doDestroy(detachView?: boolean): boolean {
            if (detachView != false) {
                this._view.detach();
            }
            this._view = null;
            return true;
        }
    }
}