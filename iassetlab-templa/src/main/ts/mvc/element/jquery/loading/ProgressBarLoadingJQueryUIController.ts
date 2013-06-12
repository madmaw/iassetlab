///<reference path="AbstractLoadingJQueryController.ts"/>
///<reference path="../../../loading/ILoadingControllerModel.ts"/>
///<reference path="../../../../../d.ts/jqueryui.d.ts"/>

// Module
module templa.mvc.element.jquery.loading {

    // Class
    export class ProgressBarLoadingJQueryUIController extends AbstractLoadingJQueryController {
        // Constructor
        constructor(viewFactory:IElementViewFactory, private _progressBarSelector?:string) {
            super(viewFactory);
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
