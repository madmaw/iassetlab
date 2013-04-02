///<reference path="ITemplateSource.ts"/>
///<reference path="../loading/AbstractLoadable.ts"/>
///<reference path="../../d.ts/handlebars.d.ts"/>

// Module
module templa.template {

    // Class
    export class StringHandlebarsTemplateSource extends templa.loading.AbstractLoadable implements ITemplateSource {

        private _template: (any) => string;

        constructor(private _inputTemplate: string) {
            super(1, true);
        }

        public resolve(): (any) => string {
            if (this._template == null) {
                this.compile();
            }
            return this._template;
        }

        public update(): bool {
            this.compile();
            this._setLoadingProgress(1);
            return false;
        }

        private compile() {
            this._template = Handlebars.compile(this._inputTemplate);
        }
    }

}