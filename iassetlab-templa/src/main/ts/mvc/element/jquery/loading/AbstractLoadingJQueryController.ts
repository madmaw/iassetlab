///<reference path="../AbstractJQueryController.ts"/>
///<reference path="../../../../../d.ts/jqueryui.d.ts"/>

// Module
module templa.mvc.element.jquery.loading {

    // Class
    export class AbstractLoadingJQueryController extends AbstractJQueryController {
        constructor(viewFactory: templa.mvc.element.IElementViewFactory) {
            super(viewFactory);
        }

        public _doStart(): bool {
            var loadingModel: templa.mvc.loading.ILoadingControllerModel = <any>this._model;
            var updateRequired: bool = loadingModel.requestStartLoading();
            if (updateRequired) {
                // increment load
                this._increment();
            }
            return super._doStart();
        }

        public _increment() {
            // TODO safe setTimeout 
            this._safeTimeout(() => {
                var loadingModel: templa.mvc.loading.ILoadingControllerModel = <any>this._model;
                var updateRequired = loadingModel.update();
                if (updateRequired) {
                    this._increment();
                }
            }, 0);
        }
    }
}