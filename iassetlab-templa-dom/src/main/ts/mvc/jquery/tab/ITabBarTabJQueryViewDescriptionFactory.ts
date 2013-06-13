///<reference path="TabBarTabJQueryViewDescription.ts"/>
///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc.jquery.tab {

    // Class
    export interface ITabBarTabJQueryViewDescriptionFactory {

        create(container: IElementReference, tabBarId: string): TabBarTabJQueryViewDescription;

    }

}