///<reference path="IElementViewFactory.ts"/>
///<reference path="DocumentFragmentElementView.ts"/>
///<reference path="../../../d.ts/handlebars.d.ts"/>

module templa.mvc.element {

    /**
     * constant to allow us to create unique ids for the divs
     */
    var templateElementCount: number = 0;

    // Class
    export class HandlebarsElementViewFactory implements templa.mvc.element.IElementViewFactory {

        private _compiledTemplate: (any) => string;

        // Constructor
        constructor(_template: string, private _options?:any) {
            this._compiledTemplate = Handlebars.compile(_template);
        }

        public create(container:IElementReference): templa.mvc.element.IElementView {
            var count = templateElementCount;
            templateElementCount++;
            var id = "__template_element_id_" + count;
            var options = {};
            //options[this._id] = id;
            if (this._options != null) {
                for (var key in this._options) {
                    var value = this._options[key];
                    options[key] = value;
                }
            }
            var html: string = this._compiledTemplate(options);
            return new DocumentFragmentElementView(html, container, id);
        }
    }

}