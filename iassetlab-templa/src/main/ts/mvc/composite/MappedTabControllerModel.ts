///<reference path="ICompositeControllerModel.ts"/>
///<reference path="../AbstractModel.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../ModelChangeEvent.ts"/>
///<reference path="../ModelChangeDescription.ts"/>
///<reference path="../tab/ITabBarModel.ts"/>

// Module
module templa.samples.mvc.tab_index {

    // Class
    export class IndexTabControllerModel extends templa.mvc.AbstractModel implements templa.mvc.tab.ITabBarModel, templa.mvc.composite.ICompositeControllerModel {

        // Constructor
        constructor(private _selectedTabId: string, private _tabIdsToControllers: { string: templa.mvc.IController; }) {
            super();
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
            this._selectedTabId = tabId;
            this._fireModelChangeEvent(
                new templa.mvc.ModelChangeEvent(
                    [
                        new templa.mvc.ModelChangeDescription(templa.mvc.tab.tabBarModelEventSelectedTabChange),
                        new templa.mvc.ModelChangeDescription(templa.mvc.composite.compositeControllerModelEventControllersChanged)
                    ]
                )
            );
        }

        public getControllers(): templa.mvc.IController[]{
            var selectedController = this._tabIdsToControllers[this._selectedTabId];
            var result: templa.mvc.IController[];
            if (selectedController != null) {
                result = [selectedController];
            } else {
                result = [];
            }
            return result;
        }
    }

}