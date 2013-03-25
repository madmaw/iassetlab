///<reference path="ITabBarTabJQueryViewDescriptionFactory.ts"/>
///<reference path="../../IElementViewFactory.ts"/>

// Module
module templa.mvc.element.jquery.tab {

    // Class
    export class MappedTabBarTabJQueryViewDescriptionFactory implements ITabBarTabJQueryViewDescriptionFactory {



        // Constructor
        constructor(private _tabBarIdsToViewFactories: { string: IElementViewFactory; }, private _clickableElementSelector:string, private _styleableElementSelector:string) {

        }

        public create(container: IElementReference, tabBarId: string): TabBarTabJQueryViewDescription {
            var viewFactory: IElementViewFactory = this._tabBarIdsToViewFactories[tabBarId];
            var result;
            if (viewFactory != null) {
                var view = viewFactory.create(container);
                result = new TabBarTabJQueryViewDescription(this._clickableElementSelector, this._styleableElementSelector, view);
            } else {
                result = null;
            }
            return result;
        }

    }

}