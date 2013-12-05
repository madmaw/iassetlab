///<reference path="Template.ts"/>
///<reference path="TemplateVersion.ts"/>
///<reference path="User.ts"/>

// Module
module iassetlab.client.core.service {

    export interface ITemplateSearchResult {
        template: Template;
        version: TemplateVersion;
        owner: User;
    }

    export interface TemplateSearch {
        (value: string, index: number, quantity: number, retrieveTotalCount:boolean, resultHandler: (results: ITemplateSearchResult[], last: boolean, totalCount?:number, error?:any) => boolean):void;
    }
    
    // Class
    export interface ITemplateService {

        search: TemplateSearch;

    }

}