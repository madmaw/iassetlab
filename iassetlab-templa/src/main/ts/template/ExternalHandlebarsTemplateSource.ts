///<reference path="ITemplateSource.ts"/>
///<reference path="../loading/AbstractLoadable.ts"/>
///<reference path="../../d.ts/jquery.d.ts"/>
///<reference path="../../d.ts/handlebars.d.ts"/>

// Module
module templa.template {

    // Class
    export class ExternalHandlebarsTemplateSource extends templa.loading.AbstractLoadable implements ITemplateSource {

        private _template: (any) => string;

        // Constructor
        constructor(private _url:string) {
            super(2, false);
        }

        public resolve():(any)=>string {
            if (this._template == null) {
                // synchronously load (not recommended)
                var raw = $.ajax(this._url, { async: false }).responseText;
                this._template = Handlebars.compile(raw);
                this._setLoadingProgress(2, this._url);
            }
            return this._template;
        }

        public _doStartLoading() {
            // asynchronously load
            var jqxhr = $.get(this._url, null, (raw:string) => {
                this._setLoadingProgress(1, this._url);
                //sleep
                window.setTimeout(() => {
                    this._template = Handlebars.compile(raw);
                    this._setLoadingProgress(2, this._url);
                }, 0);
            });
            jqxhr.fail((header, status:string, errorThrown) => {
                this._pushError("unable to load "+this._url+" : "+status);
            });
        }
    }

}