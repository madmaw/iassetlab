///<reference path="../AbstractJQueryController.ts"/>
///<reference path="ITabBarTabJQueryViewDescriptionFactory.ts"/>
///<reference path="TabBarTabJQueryViewDescription.ts"/>
///<reference path="../../../tab/ITabBarModel.ts"/>

// Module
module templa.mvc.element.jquery.tab {

    // Class
    export class TabBarJQueryController extends AbstractJQueryController {

        private _tabIdsToDescriptions: { string: TabBarTabJQueryViewDescription; };

        // Constructor
        constructor(_viewFactory: IElementViewFactory, private _tabBarTabViewDescriptionFactory: ITabBarTabJQueryViewDescriptionFactory, private _tabButtonContainerSelector:string, private _selectedTabClass:string) {
            super(_viewFactory);
            this._tabIdsToDescriptions = <{ string: TabBarTabJQueryViewDescription; }>{};
        }

        public _doLoad(model: IModel) {

            // unload existing views
            this._removeAllTabs();

            var tabBarModel: templa.mvc.tab.ITabBarModel = <templa.mvc.tab.ITabBarModel>model;

            var tabIds = tabBarModel.getAvailableTabIds();
            var selectedTabId = tabBarModel.getSelectedTabId();
            var tabButtonContainer = this.$reference(this._tabButtonContainerSelector);
            for (var i in tabIds) {
                var tabId = tabIds[i];
                var description: TabBarTabJQueryViewDescription = this._tabBarTabViewDescriptionFactory.create(tabButtonContainer, tabId);

                var view = description.view;
                view.attach();

                if (tabId == selectedTabId) {
                    // add the class
                    var styleableElements: JQuery = this.$(description.styleableElementSelector, view.getRoots());
                    styleableElements.addClass(this._selectedTabClass);
                }
                // add in the onclick listener
                var clickableElements: JQuery = this.$(description.clickableElementSelector, view.getRoots());
                clickableElements.click(tabId, (e:JQueryEventObject) => {
                    this._requestSelectTabId(e.data);
                });
                this._tabIdsToDescriptions[tabId] = description;
            }
        }

        private _removeAllTabs(): void {
            for (var tabId in this._tabIdsToDescriptions) {
                var description: TabBarTabJQueryViewDescription = this._tabIdsToDescriptions[tabId];
                description.view.detach();
            }
            this._tabIdsToDescriptions = <{ string: TabBarTabJQueryViewDescription; }>{};
        }

        private _requestSelectTabId(tabId: string) {
            var tabBarModel: templa.mvc.tab.ITabBarModel = <templa.mvc.tab.ITabBarModel>this._model;
            tabBarModel.requestSelectTabId(tabId);
        }

        private _selectTab(selectedTabId: string) {
            // deselect any other selected tabs
            for (var tabId in this._tabIdsToDescriptions) {
                var description: TabBarTabJQueryViewDescription = this._tabIdsToDescriptions[tabId];
                var view: IElementView = description.view;
                var styleableElements: JQuery = this.$(description.styleableElementSelector, view.getRoots());
                if (tabId == selectedTabId) {
                    // add the class
                    styleableElements.addClass(this._selectedTabClass);
                } else {
                    // remove the class
                    styleableElements.removeClass(this._selectedTabClass);
                }
            }

        }

        public _handleModelChangeEvent(event: ModelChangeEvent) {
            if (event.lookup(templa.mvc.tab.tabBarModelEventSelectedTabChange)) {
                // special case for the selected tab changing (avoids reloading everything)
                var tabBarModel: templa.mvc.tab.ITabBarModel = <templa.mvc.tab.ITabBarModel>this._model;
                this._selectTab(tabBarModel.getSelectedTabId());
            } else {
                super._handleModelChangeEvent(event);
            }
        }
    }

}
