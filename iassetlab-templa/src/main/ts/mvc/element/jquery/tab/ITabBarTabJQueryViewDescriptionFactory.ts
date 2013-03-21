///<reference path="TabBarTabJQueryViewDescription.ts"/>

// Module
module templa.mvc.element.jquery.tab {

    // Class
    export interface ITabBarTabJQueryViewDescriptionFactory {

        create(container: IElementReference, tabBarId: string): TabBarTabJQueryViewDescription;

    }

}