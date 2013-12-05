///<reference path="template/summary/ITemplateSummaryModel.ts"/>
///<reference path="../service/ITemplateService.ts"/>

///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="../../../../build/defs/jquery.d.ts"/>

// Module
module iassetlab.client.core.mvc {

    // Class
    export class AssetLabSearchResultTemplateSummaryModel extends templa.mvc.AbstractModel implements iassetlab.client.core.mvc.template.summary.ITemplateSummaryModel {

        // Constructor
        constructor(private _searchResult:iassetlab.client.core.service.ITemplateSearchResult) {
            super();
        }

        getTitle(): string {
            return this._searchResult.template.name;
        }

        getDescription(): string {
            return this._searchResult.template.description;
        }

        getImageURL(maxWidth: number, maxHeight: number): string {
            // TODO format the max width and height in there somehow
            return this._searchResult.version.imageUrl;
        }

        requestDetail(): void {
            // do nothing...for now
        }
    }

}
