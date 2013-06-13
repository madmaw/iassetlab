///<reference path="IElementController.ts"/>
///<reference path="IElementViewFactory.ts"/>
///<reference path="IElementView.ts"/>
///<reference path="AttributeElementReference.ts"/>

///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc {


    export class AbstractElementController extends templa.mvc.AbstractController implements IElementController {

        public _view: IElementView;
        public _viewContainer: IElementReference;
        private _viewPrepend: bool;


        constructor(private _viewFactory: IElementViewFactory) {
            super();
        }

        public getView(): templa.mvc.IView {
            return this._view;
        }

        public init(container: IElementReference, prepend?: bool): bool {
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


        public _doDestroy(detachView?: bool): bool {
            if (detachView != false) {
                this._view.detach();
            }
            this._view = null;
            return true;
        }
    }
}