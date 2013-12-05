///<reference path="ITemplateSummaryModel.ts"/>
///<reference path="../TemplateController.ts"/>

///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa-dom.d.ts"/>

// Module
module iassetlab.client.core.mvc.template.summary {

    // Class
    export class TemplateSummaryController extends TemplateController<ITemplateSummaryModel> {

        private _detailRequestHandler: (event: JQueryEventObject) => any;

        // Constructor
        constructor(viewFactory:templa.dom.mvc.IElementViewFactory) {
            super(viewFactory);
            this._detailRequestHandler = (event: JQueryEventObject) => {
                this._requestDetail();
            };
        }

        public _doStart(): boolean {
            var result: boolean = super._doStart();

            this.$(".detail").click(this._detailRequestHandler);

            return result;
        }

        public _doStop(): boolean {
            var result = super._doStop();

            this.$(".detail").unbind("click", this._detailRequestHandler);

            return result;
        }

        private _requestDetail() {
            var model: ITemplateSummaryModel = <ITemplateSummaryModel>this.getModel();
            model.requestDetail();
        }
    }

}