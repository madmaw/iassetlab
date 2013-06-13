///<reference path="AbstractLoadingJQueryController.ts"/>
///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/jqueryui.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc.jquery.loading {

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
