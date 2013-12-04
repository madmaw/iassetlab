///<reference path="ILoadingControllerModel.ts"/>
///<reference path="../AbstractModel.ts"/>

// Module
module templa.mvc.loading {

    // Class
    export class LoadableProxyingLoadingControllerModel extends AbstractModel implements ILoadingControllerModel {
        // Constructor
        constructor(private _loadable:templa.loading.ILoadable) {
            super();
        }

        getLoadingProgress(): number {
            return this._loadable.getLoadingProgress();
        }

        getMaximumProgress(): number {
            return this._loadable.getMaximumProgress();
        }

        getErrors(): string[]{
            return this._loadable.getErrors();
        }

        isComplete(): boolean {
            return this._loadable.isComplete();
        }

        update(): boolean {
            return this._loadable.update();
        }

        requestStartLoading(callback?: (loadable: templa.loading.ILoadable, message: string) => void): boolean {
            return this._loadable.requestStartLoading((loadable: templa.loading.ILoadable, message: string) => {
                if (callback) {
                    return callback(this, message);
                }
                this._fireModelChangeEvent();
            });
        }
    }

}