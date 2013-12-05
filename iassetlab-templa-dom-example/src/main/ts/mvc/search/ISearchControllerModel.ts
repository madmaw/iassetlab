///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>


// Module
module iassetlab.client.core.mvc.search {

    // Class
    export interface ISearchControllerModel extends templa.mvc.IModel {

        requestSearch(searchString: string): void;

        getSearchString(): string;

        // stores the current search, but does not execute it
        stashSearch(searchString: string): void;
    }

}
