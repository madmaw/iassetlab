///<reference path="IBackForwardStackControllerModel.ts"/>

///<reference path="../../../../../../iassetlab-templa/src/main/ts/mvc/element/jquery/composite/StackJQueryController.ts"/>


// Module
module iassetlab.client.core.mvc.stack {

    // Class
    export class BackForwardStackController extends templa.mvc.element.jquery.composite.StackJQueryController {

        private _backClickHandler: (eventObject: JQueryEventObject) => void;
        private _forwardClickHandler: (eventObject: JQueryEventObject) => void;

        // Constructor
        constructor(
                viewFactory: templa.mvc.element.IElementViewFactory,
                bundles: templa.mvc.element.jquery.composite.IStackAnimationFactoryBundle[],
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

        }

        public _doStart(): bool {
            var result: bool = super._doStart();
            this.$(this._leftWingSelector).click(this._backClickHandler);
            this.$(this._rightWingSelector).click(this._forwardClickHandler);
            return result;
        }

        public _doStop(): bool {
            var result: bool = super._doStop();
            this.$(this._leftWingSelector).off("click");
            this.$(this._rightWingSelector).off("click");

            return result;
        }

        private _requestBack() {
            var model: IBackForwardStackControllerModel = <any>this.getModel();
            if (model.canPop()) {
                model.requestPop();
            }
        }

        private _requestForward() {
            var model: IBackForwardStackControllerModel = <any>this.getModel();
            if (model.canPush()) {
                model.requestPush();
            }
        }
    }

}
