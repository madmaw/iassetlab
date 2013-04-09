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

        public _setSelectedTabId(tabId: string, suppressModelChangeEvent?:bool) {
            if (this._selectedTabId != tabId) {
                this._selectedTabId = tabId;
                var selectedTabController = this._tabIdsToControllers[tabId];
                this.setController(this._tabControllerKey, selectedTabController, true);
                if (suppressModelChangeEvent != true) {
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

        public createStateDescription(models?: IModel[]): any {
            var result = super.createStateDescription(models);

            result["_selectedTabId"] = this._selectedTabId;

            return result;
        }

        public loadStateDescription(description: any) {
            super.loadStateDescription(description);
            this._setSelectedTabId(description["_selectedTabId"], true);
        }

        public _getDescribedControllers(): IController[] {
            var result = super._getDescribedControllers();
            for (var tabId in this._tabIdsToControllers) {
                var controller = this._tabIdsToControllers[tabId];
                if (result.indexOf(controller) < 0) {
                    result.push(controller);
                }
            }
            return result;
        }

        public _getDescribedControllerKey(controller: IController): string {
            var result = super._getDescribedControllerKey(controller);
            if (result == this._tabControllerKey || result == null) {
                // need to differentiate
                for (var key in this._tabIdsToControllers) {
                    var tabController = this._tabIdsToControllers[key];
                    if (tabController == controller) {
                        result = key;
                        break;
                    }
                }
            }
            return result;
        }

        public _getDescribedController(key: string): IController {
            var result = super._getDescribedController(key);
            if (result == null) {
                result = this._tabIdsToControllers[key];
            }
            return result;
        }

    }

}