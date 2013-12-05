///<reference path="ITemplateModel.ts"/>

///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="../../../../../build/defs/jquery.d.ts"/>

// Module
module iassetlab.client.core.mvc.template {

    // Class
    export class TemplateController<ModelType extends ITemplateModel> extends templa.dom.mvc.jquery.AbstractJQueryController<ModelType> {
        // Constructor
        constructor(viewFactory:templa.dom.mvc.IElementViewFactory) {
            super(viewFactory);
        }

        public _doLoad(model: templa.mvc.IModel) {
            var templateModel: ITemplateModel = <ITemplateModel>model;
            this.$(".title").text(templateModel.getTitle());
            this.$(".description").text(templateModel.getDescription());
            this._setImage(templateModel);
        }

        private _setImage(templateModel: ITemplateModel) {
            // TODO keep old image until new one is loaded
            var image: JQuery = this.$(".image");
            var width: number = image.innerWidth();
            var height: number = image.innerHeight();
            var imageURL = templateModel.getImageURL(width, height);
            image.attr("src", imageURL);
        }

        public layout(): void {
            super.layout();
            // set the image of appropriate size
            var templateModel: ITemplateModel = <ITemplateModel>this.getModel();
            this._setImage(templateModel);
        }
    }
}