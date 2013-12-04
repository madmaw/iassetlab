///<reference path="ILoadable.ts"/>

// Module
module templa.loading {

    // Class
    export class AbstractLoadable implements ILoadable {
        private _loadingProgress: number;
        private _errors: string[];
        private _callback: (source: ILoadable, message: string) => void;

        constructor(private _maximumProgress: number, private _synchronous:boolean) {
            this._loadingProgress = 0;
            this._errors = [];
        }

        public getLoadingProgress(): number {
            return this._loadingProgress;
        }

        public getMaximumProgress(): number {
            return this._maximumProgress;
        }

        public getErrors(): string[]{
            return this._errors;
        }

        public isComplete(): boolean {
            return this._loadingProgress == this._maximumProgress;
        }

        public update(): boolean {
            return false;
        }

        public requestStartLoading(callback?: (source: ILoadable, message: string) => void ): boolean {
            this._callback = callback;
            this._doStartLoading();
            return this._synchronous;
        }

        public _doStartLoading() {
            // override
        }

        public _pushError(error: string) {
            this._errors.push(error);
            this._fireLoadingEvent(error);
        }

        public _setLoadingProgress(loadingProgress: number, message?:string, maximumProgress?: number) {
            this._loadingProgress = loadingProgress;
            if (maximumProgress != null) {
                this._maximumProgress = maximumProgress;
            }
            this._fireLoadingEvent(message);
        }

        public _fireLoadingEvent(message?: string) {
            if (this._callback != null) {
                this._callback(this, message);
            }
        }
    }

}