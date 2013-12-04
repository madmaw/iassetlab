///<reference path="../AbstractJQueryController.ts"/>
///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc.jquery.loading {

    // Class
    export class AbstractLoadingJQueryController<ModelType extends templa.mvc.loading.ILoadingControllerModel> extends AbstractJQueryController<ModelType> {
        constructor(viewFactory: templa.dom.mvc.IElementViewFactory) {
            super(viewFactory);
        }

        public _doStart(): boolean {
            var loadingModel = this._model;
            var updateRequired: boolean = loadingModel.requestStartLoading();
            if (updateRequired) {
                // increment load
                this._increment();
            }
            return super._doStart();
        }

        public _increment() {
            // TODO safe setTimeout 
            this._safeTimeout(() => {
                var loadingModel = this._model;
                var updateRequired = loadingModel.update();
                if (updateRequired) {
                    this._increment();
                }
            }, 0);
        }
    }
}