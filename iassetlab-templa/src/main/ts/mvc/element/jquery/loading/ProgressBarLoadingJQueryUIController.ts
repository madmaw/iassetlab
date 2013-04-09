///<reference path="../AbstractJQueryController.ts"/>
///<reference path="../../../loading/ILoadingControllerModel.ts"/>
///<reference path="../../../../../d.ts/jqueryui.d.ts"/>

// Module
module templa.mvc.element.jquery.loading {

    // Class
    export class ProgressBarLoadingJQueryUIController extends AbstractJQueryController {
        // Constructor
        constructor(_viewFactory:IElementViewFactory, private _progressBarSelector?:string) {
            super(_viewFactory);
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

        public _doLoad(model: templa.mvc.IModel) {
            var loadingModel: templa.mvc.loading.ILoadingControllerModel = <any>model;

            // progressbar is hard coded to have a maximum of 100?
            var progress = loadingModel.getLoadingProgress();
            var maximum = loadingModel.getMaximumProgress();
            var effectiveProgress = Math.round((progress * 100) / maximum);

            this.$(this._progressBarSelector).progressbar({
                value: effectiveProgress
            });
        }
    }

}
