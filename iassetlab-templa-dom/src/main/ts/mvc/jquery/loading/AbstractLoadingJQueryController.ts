///<reference path="../AbstractJQueryController.ts"/>
///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc.jquery.loading {

    // Class
    export class AbstractLoadingJQueryController extends AbstractJQueryController {
        constructor(viewFactory: templa.dom.mvc.IElementViewFactory) {
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