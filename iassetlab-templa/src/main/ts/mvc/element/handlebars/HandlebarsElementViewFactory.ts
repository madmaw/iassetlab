///<reference path="../IElementViewFactory.ts"/>
///<reference path="../HTMLElementView.ts"/>
///<reference path="../../../../d.ts/handlebars.d.ts"/>

// Module (ends in 'z' to avoid naming conflict with handlebars main module)
module templa.mvc.element.handlebars {

    /**
     * constant to allow us to create unique ids for the divs
     */
    var templateElementCount: number = 0;

    // Class
    export class HandlebarsElementViewFactory implements templa.mvc.element.IElementViewFactory {

        private _compiledTemplate: (any) => string;

        // Constructor
        constructor(_template: string, private _id: string, private _options?:any) {
            this._compiledTemplate = Handlebars.compile(_template);
        }

        public create(container:Element): templa.mvc.element.IElementView {
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