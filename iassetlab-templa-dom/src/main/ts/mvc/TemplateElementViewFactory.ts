///<reference path="IElementViewFactory.ts"/>
///<reference path="DocumentFragmentElementViewFactory.ts"/>
///<reference path="IElementReference.ts"/>

///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc {

    // Class  
    export class TemplateElementViewFactory extends DocumentFragmentElementViewFactory {

        public static createFromString(templateString: string, loadables?: templa.loading.ILoadable[], options?:any) {
            var templateSource = new templa.template.StringHandlebarsTemplateSource(templateString);
            if (loadables != null) {
                loadables.push(templateSource);
            }
            return new TemplateElementViewFactory(templateSource, options);
        }

        public static createFromURL(templateURL: string, loadables?: templa.loading.ILoadable[], options?: any) {
            var templateSource = new templa.template.ExternalHandlebarsTemplateSource(templateURL);
            if (loadables != null) {
                loadables.push(templateSource);
            }
            return new TemplateElementViewFactory(templateSource, options);
        }

        // Constructor
        constructor(private _templateSource: templa.template.ITemplateSource, private _options: any) {
            super(null);
        }

        public create(container:IElementReference, prepend?:bool, extraOptions?:any): IElementView {
            var options = {};
            if (this._options != null) {
                for (var key in this._options) {
                    var value = this._options[key];
                    options[key] = value;
                }
            }
            if (extraOptions != null) {
                for (var key in extraOptions) {
                    var value = extraOptions[key];
                    options[key] = value;
                }
            }
            var template = this._templateSource.resolve();
            var html: string = template(options);
            return this._createDiv(container, prepend, html);
        }
    }

}