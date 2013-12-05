///<reference path="../ITemplateService.ts"/>
///<reference path="../Template.ts"/>
///<reference path="../TemplateVersion.ts"/>
///<reference path="../User.ts"/>

// Module
module iassetlab.client.core.service.json {

    // Class
    export class JSONTemplateServiceFunctionFactory {
        // Constructor
        constructor() {
        }

        public createSearch(): iassetlab.client.core.service.TemplateSearch {
            return (value: string, index: number, quantity: number, retrieveTotalCount: boolean, resultHandler: (results: ITemplateSearchResult[], last: boolean, totalCount:number) => boolean) => {
                window.setTimeout(() => {
                    var results: iassetlab.client.core.service.ITemplateSearchResult[] = [];
                    for (var i = 0; i < quantity; i++) {

                        var template = new iassetlab.client.core.service.Template();
                        template.name = "Template " + i;
                        template.description = "description "+i;

                        var version = new iassetlab.client.core.service.TemplateVersion();
                        version.versionNumber = 1;
                        version.imageUrl = "https://si0.twimg.com/profile_images/57758916/mouth_normal.gif";

                        var owner = new iassetlab.client.core.service.User();
                        owner.displayName = "User " + i;

                        var result: iassetlab.client.core.service.ITemplateSearchResult = {
                            template: template,
                            version: version,
                            owner: owner
                        };
                        results.push(result);
                    }
                    resultHandler(results, true, quantity);
                }, 1000);
            };
        }

    }

}