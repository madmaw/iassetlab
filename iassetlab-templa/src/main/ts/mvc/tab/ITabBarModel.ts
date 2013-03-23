///<reference path="../IModel.ts"/>

// Module
module templa.mvc.tab {
    
    export var tabBarModelEventSelectedTabChange = "selectedTabId";
    export var tabBarModelEventAvailableTabChange = "availableTabIds";

    // Class
    export interface ITabBarModel extends IModel {
        getSelectedTabId(): string;

        getAvailableTabIds(): string[];

        requestSelectTabId(tabId: string);
    }
}