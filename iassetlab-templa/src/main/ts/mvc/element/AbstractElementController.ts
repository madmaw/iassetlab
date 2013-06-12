///<reference path="IElementViewFactory.ts"/>
///<reference path="IElementView.ts"/>
///<reference path="AttributeElementReference.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../AbstractController.ts"/>
///<reference path="../../util/Arrays.ts"/>
///<reference path="../../util/Elements.ts"/>
///<reference path="../IView.ts"/>

module templa.mvc.element {


    export class AbstractElementController extends AbstractController {

        public _view: IElementView;

        constructor(private _viewFactory: IElementViewFactory) {
            super();
        }

        public getView(): templa.mvc.IView {
            return this._view;
        }

        public _doInit(container: IElementReference, prepend: bool): bool {
            this._view = this._viewFactory.create(container, prepend);
            this._view.attach();
            return true;
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