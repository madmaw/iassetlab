///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="../../../../../build/defs/jquery.d.ts"/>

// Module
module iassetlab.client.core.mvc.template {

    // Class
    export interface ITemplateModel extends templa.mvc.IModel {
        getTitle(): string;
        getDescription(): string;
        // images how to deal with?!
        getImageURL(maxWidth:number, maxHeight:number): string;
    }

}