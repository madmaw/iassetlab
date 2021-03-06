///<reference path="ITabBarTabJQueryViewDescriptionFactory.ts"/>
///<reference path="../../IElementViewFactory.ts"/>
///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc.jquery.tab {

    // Class
    export class MappedTabBarTabJQueryViewDescriptionFactory implements ITabBarTabJQueryViewDescriptionFactory {



        // Constructor
        constructor(private _tabBarIdsToViewFactories: { [_:string]: IElementViewFactory; }, private _clickableElementSelector:string, private _styleableElementSelector:string) {

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