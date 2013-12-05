///<reference path="AssetLabSearchResultsControllerModel.ts"/>
///<reference path="AssetLabStackControllerModel.ts"/>
///<reference path="search/ISearchControllerModel.ts"/>

///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="../../../../build/defs/jquery.d.ts"/>

// Module
module iassetlab.client.core.mvc {

    // Class
    export class AssetLabSearchControllerModel extends templa.mvc.AbstractModel implements iassetlab.client.core.mvc.search.ISearchControllerModel {

        private _searchString: string;
        // TODO probably want to just look this up from the actual search model
        private _activeSearch: string;

        // Constructor
        constructor(
            private _stackModel: iassetlab.client.core.mvc.AssetLabStackControllerModel,
            private _owner: templa.mvc.IController,
            private _searchResultsController: templa.mvc.IController,
            private _searchResultsModel: iassetlab.client.core.mvc.AssetLabSearchResultsControllerModel
        ) {
            super();
            this._searchString = null;
            this._activeSearch = null;
        }

        public requestSearch(searchString: string, suppressDescriptionChangeEvent?: boolean) {
            // TODO set the search data on the search results model
            var oldSearchString = this._activeSearch;
            this._activeSearch = searchString;
            this._searchString = searchString;
            // push the search controller
            var isOnTop = this._stackModel.peek() == this._owner;
            var change: templa.mvc.IModelStateChange = this._stackModel._pushPair(this._owner, this._searchResultsController, null, false);
            change = {
                undo: () => {
                    if (isOnTop) {
                        // TODO ensure that the owner controller is visible, do nothing else
                        this._stackModel._popTo(this._owner, true);
                    } else {
                        this.requestSearch(oldSearchString, true);
                    }
                },
                redo: () => {
                    this.requestSearch(searchString, true);
                }
            };
            this._searchResultsModel._search(searchString);
            this._fireModelChangeEvent(null, true);
            if (suppressDescriptionChangeEvent != true) {
                this._fireStateDescriptionChangeEvent(this, change);
            }
        }

        getSearchString(): string {
            return this._searchString;
        }

        public stashSearch(searchString: string) {
            this._searchString = searchString;
            // TODO fire a model change event?
        }

        public createStateDescription(models?: templa.mvc.IModel[]): any {
            models = this._checkModels(models);
            // are we ontop of the stack?
            var result = {
                search: this._searchString
            };
            if (this._stackModel.peek() != this._owner) {
                // just pass it through to the root controller and let it deal
                // TODO obtain controller's model's description
                var controller: templa.mvc.IController = this._searchResultsController;
                var searchData = controller.getModel().createStateDescription(models);
                result["searchData"] = searchData;
                result["searchActive"] = true;
            }

            return result;
        }

        public loadStateDescription(description: any) {
            // TODO load controller's model's description
            if (description != null) {
                var search = description["search"];
                var searchData = description["searchData"];
                var searchActive = description["searchActive"];
                if (searchActive) {
                    this.requestSearch(search);
                    this._searchResultsController.getModel().loadStateDescription(searchData);
                } else {
                    this._searchString = search;
                }
                this._fireModelChangeEvent(null, true);
            }
        }

    }

}
