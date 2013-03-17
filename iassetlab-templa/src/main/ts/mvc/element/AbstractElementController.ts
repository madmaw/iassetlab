///<reference path="IElementViewFactory.ts"/>
///<reference path="IElementView.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../AbstractController.ts"/>
///<reference path="../../util/Arrays.ts"/>

module templa.mvc.element {


    export class AbstractElementController extends AbstractController {

        public _view: IElementView;
        private _viewFactory: IElementViewFactory;

        constructor(_viewFactory: IElementViewFactory) {
            super();
            this._viewFactory = _viewFactory;
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

        public init(container:Element): bool {
            if (super.init(container)) {
                this._view = this._viewFactory.create(container);
                this._view.attach();
                return true;
            } else {
                return false;
            }
        }

        public destroy(): bool {
            if (super.destroy()) {
                this._view.detach();
                this._view = null;
                return true;
            } else {
                return false;
            }
        }
    }
}