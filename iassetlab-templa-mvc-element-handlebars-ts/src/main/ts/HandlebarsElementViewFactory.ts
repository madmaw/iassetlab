///<reference path="../lib/templa-mvc-core.d.ts"/>
///<reference path="../lib/templa-mvc-element.d.ts"/>
///<reference path="../d.ts/handlebars.d.ts"/>

// Module (ends in 'z' to avoid naming conflict with handlebars main module)
module Templa.MVC.Element.Handlebarz {

    /**
     * constant to allow us to create unique ids for the divs
     */
    var templateElementCount: number = 0;

    // Class
    export class HandlebarsElementViewFactory implements Templa.MVC.Element.IElementViewFactory {

        private _compiledTemplate: (any) => string;

        // Constructor
        constructor(_template: string, private _id: string, private _options?:any) {
            this._compiledTemplate = Handlebars.compile(_template);
        }

        public create(container:Element): Templa.MVC.Element.IElementView {
            var count = templateElementCount;
            templateElementCount++;
            var id = "__template_element_id_" + count;
            var options = {};
            options[this._id] = id;
            if (this._options != null) {
                for (var key in this._options) {
                    var value = this._options[key];
                    options[key] = value;
                }
            }
            var html: string = this._compiledTemplate(options);
            return new HTMLElementView(html, <HTMLElement><any>container, id);
        }
    }

}