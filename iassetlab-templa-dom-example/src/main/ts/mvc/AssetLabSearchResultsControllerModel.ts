///<reference path="../service/ITemplateService.ts"/>

///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="../../../../build/defs/jquery.d.ts"/>


// Module
module iassetlab.client.core.mvc {

    // Class
    export class AssetLabSearchResultsControllerModel extends templa.mvc.AbstractModel implements templa.mvc.list.IListControllerModel, templa.mvc.loading.ILoadingControllerModel {

        private _controllerCount: number;
        
        private _currentBlock;
        private _blocks: { [_:number]: templa.mvc.IController[]; };
        private _loadingComplete: boolean;
        private _loadingProgress: number;
        private _loadingMaximumProgress: number;
        private _loadingErrors: string[];
        


        // Constructor
        constructor(
            private _blockSize: number,
            private _templateService: iassetlab.client.core.service.ITemplateService,
            private _searchResultControllerFactory:(searchResult:iassetlab.client.core.service.ITemplateSearchResult) => templa.mvc.IController
        ) {
            super();
            this._controllerCount = null;
        }

        public _search(searchString: string) {
            // TODO cancel any existing requests

            // start loading
            this._loadingComplete = false;
            // no meaningful description change
            this._fireModelChangeEvent(null, true);
            // immediately start loading
            // TODO cancel previous loading request
            this._blocks = <any>{};
            this._controllerCount = 0;
            this._currentBlock = 0;

            // set state to loading
            this._fireModelChangeEvent(null, true);

            this._templateService.search(searchString, 0, this._blockSize, this._controllerCount == null, (results: iassetlab.client.core.service.ITemplateSearchResult[], done: boolean, totalCount?: number, error?:any) => {
                if (totalCount != null) {
                    this._controllerCount = totalCount;
                }
                // create controllers and append
                var block = this._blocks[0];
                if (block == null) {
                    block = <templa.mvc.IController[]>[];
                    this._blocks[0] = block;
                }

                // create appropriate controllers and push to block
                for (var i in results) {
                    var searchResult: iassetlab.client.core.service.ITemplateSearchResult = results[i];
                    var searchResultController = this._searchResultControllerFactory(searchResult);
                    block.push(searchResultController);
                }

                if (done) {
                    this._loadingComplete = true;
                }
                this._fireModelChangeEvent(null, true);
                return done;
            });
        } 

        // from list controller

        getController(index: number, reuseController: templa.mvc.IController): templa.mvc.IController {
            var blockNumber = Math.floor(index / this._blockSize);
            var blockIndex = index % this._blockSize;
            var block: templa.mvc.IController[] = this._blocks[blockNumber];
            return block[blockIndex];
        }

        getControllerType(index: number): string {
            // all the same type
            return "template";
        }

        getControllerCount(): number {
            // TODO : perhaps controller count should just be the number of blocks, with the option to keep loading if we scroll down?
            return this._controllerCount;
        }

        // from loading controller (which activates whenever we are loading up new values)
        getLoadingProgress(): number {
            return this._loadingProgress;
        }

        getMaximumProgress(): number {
            return this._loadingMaximumProgress;
        }

        getErrors(): string[]{
            return this._loadingErrors;
        }

        isComplete(): boolean {
            return this._loadingComplete;
        }

        /**
         * update a synchronous loading thing, return true if it isn't finished (requires another call), false if it is
         */
        update(): boolean {
            return false;
        }

        /**
         * return true if the loading requires calls to update, false if it is asynchronous 
         */
        requestStartLoading(callback?: (loadable: templa.loading.ILoadable, message: string) => void ): boolean {
            // we don't worry about that, do we?
            return false;
        }
    }

}
