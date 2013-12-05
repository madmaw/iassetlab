///<reference path="ISearchControllerModel.ts"/>

///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="../../../../../build/defs/jquery.d.ts"/>

// Module
module iassetlab.client.core.mvc.search {

    // Class
    export class SearchController extends templa.dom.mvc.jquery.AbstractJQueryController<ISearchControllerModel> {

        private _searchButtonClickHandler: (eventObject: JQueryEventObject) => void;
        private _searchFieldEnterHandler: (eventObject: JQueryEventObject) => void;
        private _searchFieldChangeHandler: (eventObject: JQueryEventObject) => void;

        // Constructor
        constructor(viewFactory: templa.dom.mvc.IElementViewFactory) {
            super(viewFactory);
            this._searchButtonClickHandler = (eventObject: JQueryEventObject) => {
                this._requestSearch();
            };
            this._searchFieldEnterHandler = (eventObject: JQueryKeyEventObject) => {
                if (eventObject.which == 13) {
                    this._requestSearch();
                }
            }
            this._searchFieldChangeHandler = (eventObject: JQueryEventObject) => {
                this._stashSearch();
            }
        }


        public _doStart(): boolean {
            var searchButton = this.$(".search-button");
            searchButton.click(this._searchButtonClickHandler);
            var searchInput = this.$(".search-input");
            searchInput.keypress(this._searchFieldEnterHandler);
            searchInput.change(this._searchFieldChangeHandler);
            searchInput.focus();
            return true;
        }

        public _doStop(): boolean {
            var searchButton = this.$(".search-button");
            searchButton.off("click", this._searchButtonClickHandler);
            var searchInput = this.$(".search-input");
            searchInput.off('keypress', this._searchFieldEnterHandler);
            searchInput.off('change', this._searchFieldChangeHandler);
            return true;
        }

        public _doLoad(model: ISearchControllerModel) {
            var searchModel = <ISearchControllerModel>model;
            var searchInput = this.$(".search-input");
            searchInput.val(searchModel.getSearchString());
        }

        private _requestSearch() {
            var searchInput = this.$(".search-input");
            var searchString = searchInput.val();
            var searchModel = <ISearchControllerModel>this.getModel();
            searchModel.requestSearch(searchString);
        }

        private _stashSearch() {
            var searchInput = this.$(".search-input");
            var searchString = searchInput.val();
            var searchModel = <ISearchControllerModel>this.getModel();
            searchModel.stashSearch(searchString);
        }
    }

}