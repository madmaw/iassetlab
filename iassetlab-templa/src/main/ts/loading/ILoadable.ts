// Module
module templa.loading {

    // Class
    export interface ILoadable {
        
        getLoadingProgress(): number;

        getMaximumProgress(): number;

        getErrors(): string[];

        isComplete(): bool;

        /**
         * update a synchronous loading thing, return true if it isn't finished (requires another call), false if it is
         */
        update(): bool;

        /**
         * return true if the loading requires calls to update, false if it is asynchronous 
         */
        requestStartLoading(callback?: (loadable:ILoadable, message:string) => void): bool;
    }

}
