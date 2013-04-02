///<reference path="MappedKeyedControllerModel.ts"/>
///<reference path="ICompositeControllerModel.ts"/>
///<reference path="../AbstractModel.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../ModelChangeEvent.ts"/>
///<reference path="../ModelChangeDescription.ts"/>
///<reference path="../tab/ITabBarModel.ts"/>

// Module
module templa.mvc.composite {

    // Class
    /**
     * combined tab bar and composite model for common tab-bar behavior
     */
    export class MappedTabControllerModel extends MappedKeyedControllerModel implements templa.mvc.tab.ITabBarModel {

        private _selectedTabId: string;

        // Constructor
        constructor(selectedTabId: string, private _tabIdsToControllers: { string: templa.mvc.IController; }, private _tabControllerKey:string, _controllerMap?: { string: IController; }) {
            super(_controllerMap);
            this._setSelectedTabId(selectedTabId);
        }

        public getSelectedTabId(): string {
            return this._selectedTabId;
        }

        public getAvailableTabIds(): string[]{
            // TODO sort this (platform dependent otherwise)
            var result = [];
            for (var tabId in this._tabIdsToControllers) {
                result.push(tabId);
            }
            return result;
        }

        public requestSelectTabId(tabId: string) {
            this._setSelectedTabId(tabId);
        }

        public _setSelectedTabId(tabId: string) {
            if (this._selectedTabId != tabId) {
                this._selectedTabId = tabId;
                var selectedTabController = this._tabIdsToControllers[tabId];
                this.setController(this._tabControllerKey, selectedTabController, true);
                this._fireModelChangeEvent(
                    new templa.mvc.ModelChangeEvent(
                        [
                            new templa.mvc.ModelChangeDescription(templa.mvc.tab.tabBarModelEventSelectedTabChange),
                            new templa.mvc.ModelChangeDescription(templa.mvc.composite.compositeControllerModelEventControllersChanged)
                        ]
                    )
                );
            }
        }
    }

}