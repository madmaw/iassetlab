///<reference path="../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>

module templa.dom.loading.jquery {

    export class JQueryDeferredLoadable extends templa.loading.AbstractLoadable {

        constructor(private _deferred:JQueryDeferred) {
            super(1, false);
        }

        public _doStartLoading() {
            this._deferred.done(() => {
                this._setLoadingProgress(1);
            });
        }

    }
}