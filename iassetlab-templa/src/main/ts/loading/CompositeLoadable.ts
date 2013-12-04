///<reference path="ILoadable.ts"/>
///<reference path="../util/Arrays.ts"/>

// Module
module templa.loading {

    // Class
    export class CompositeLoadable implements ILoadable {

        private _synchronousLoadables: ILoadable[];
        private _loadables: ILoadable[];

            constructor(loadables?:ILoadable[]) {
            if (loadables == null) {
                this._loadables = [];
            } else {
                this._loadables = loadables;
            }

            this._synchronousLoadables = [];
        }

        getLoadingProgress(): number {
            var result = 0;
            // TODO should we cache progress instead of calculating
            for (var i in this._loadables) {
                var loadable: ILoadable = this._loadables[i];
                result += loadable.getLoadingProgress();
            }
            return result;
        }

        getMaximumProgress(): number {
            var result = 0;
            for (var i in this._loadables) {
                var loadable: ILoadable = this._loadables[i];
                result += loadable.getMaximumProgress();
            }
            return result;
        }

        getErrors(): string[]{
            var result = [];
            for (var i in this._loadables) {
                var loadable: ILoadable = this._loadables[i];
                var errors = loadable.getErrors();
                templa.util.Arrays.pushAll(result, errors);
            }
            return result;
        }

        isComplete(): boolean {
            var result = true;
            for (var i in this._loadables) {
                var loadable: ILoadable = this._loadables[i];
                var complete = loadable.isComplete();
                if (!complete) {
                    result = false;
                    break;
                }
            }
            return result;
        }

        update(): boolean {
            var result;
            if (this._synchronousLoadables.length > 0) {
                var synchronousLoader = this._synchronousLoadables[0];
                var synchronousLoaderResult = synchronousLoader.update();
                if (!synchronousLoaderResult) {
                    this._synchronousLoadables.splice(0, 1);
                    result = this._synchronousLoadables.length > 0;
                } else {
                    result = true;
                }
            } else {
                result = false;
            }
            return result;
        }

        requestStartLoading(callback?: (loadable: ILoadable, message: string) => void ): boolean {
            var result: boolean = false;
            var internalCallback;
            if (callback != null) {
                internalCallback = (loadable: ILoadable, message: string) => {
                    callback(this, message);
                };
            } else {
                internalCallback = null;
            }
            for (var i in this._loadables) {
                var loadable: ILoadable = this._loadables[i];
                var loadableResult = loadable.requestStartLoading(internalCallback);
                if (loadableResult) {
                    this._synchronousLoadables.push(loadable);
                }
                result = loadableResult || result;
            }
            return result;
        }
    }

}
