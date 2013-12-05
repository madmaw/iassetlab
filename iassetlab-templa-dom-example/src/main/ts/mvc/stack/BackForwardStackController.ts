///<reference path="IBackForwardStackControllerModel.ts"/>

///<reference path="../../../d.ts/hammerjs.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="../../../../../build/defs/jquery.d.ts"/>


// Module
module iassetlab.client.core.mvc.stack {

    // Class
    export class BackForwardStackController extends templa.dom.mvc.jquery.composite.StackJQueryController<IBackForwardStackControllerModel> {

        private _backClickHandler: (eventObject: JQueryEventObject) => void;
        private _forwardClickHandler: (eventObject: JQueryEventObject) => void;
        private _backSwipeHandler: (event: HammerEvent) => void;
        private _forwardSwipeHandler: (event: HammerEvent) => void;
        private _hammer: Hammer;

        // Constructor
        constructor(
                viewFactory: templa.dom.mvc.IElementViewFactory,
                bundles: templa.dom.mvc.jquery.composite.IStackAnimationFactoryBundle[],
                private _leftWingSelector: string,
                private _rightWingSelector: string
        ) {
            super(viewFactory, bundles);

            this._backClickHandler = () => {
                this._requestBack();
            }

            this._forwardClickHandler = () => {
                this._requestForward();
            }

            this._backSwipeHandler = (event: HammerEvent) => {
                if (this._isAnimating()) {
                    this._clearAnimations();
                }
                this._requestBack();
            };

            this._forwardSwipeHandler = (event: HammerEvent) => {
                if (this._isAnimating()) {
                    this._clearAnimations();
                }
                this._requestForward();
            };

        }

        public _doInit():boolean {
            var result = super._doInit();
            if (result) {
                var containerElement = this._viewContainer.resolve();
                var options: HammerOptions = {
                    prevent_default: true,
                    swipe: true,
                    tap: false,
                    drag: false,
                    hold: false,
                    tap_double: false
                };
                this._hammer = new Hammer(containerElement);
            }
            return result;
        }

        public _doDestroy(detachView?:boolean):boolean {
            var result = super._doDestroy(detachView);
            if (result) {
                this._hammer = null;
            }
            return result;
        }

        public _doStart(): boolean {
            var result: boolean = super._doStart();

            // listen for swipe events
            this._hammer.on('swipeleft', this._forwardSwipeHandler);
            this._hammer.on('swiperight', this._backSwipeHandler);
            this.$(this._leftWingSelector).click(this._backClickHandler);
            this.$(this._rightWingSelector).click(this._forwardClickHandler);
            return result;
        }

        public _doStop(): boolean {
            var result: boolean = super._doStop();

            // stop listening for swipe events
            this._hammer.off('swipeleft', this._forwardSwipeHandler);
            this._hammer.off('swiperight', this._backSwipeHandler);
            this.$(this._leftWingSelector).off("click");
            this.$(this._rightWingSelector).off("click");

            return result;
        }

        private _requestBack() {
            var model: IBackForwardStackControllerModel = this.getModel();
            if (model.canPop()) {
                model.requestPop();
            }
        }

        private _requestForward() {
            var model: IBackForwardStackControllerModel = this.getModel();
            if (model.canPush()) {
                model.requestPush();
            }
        }
    }

}
