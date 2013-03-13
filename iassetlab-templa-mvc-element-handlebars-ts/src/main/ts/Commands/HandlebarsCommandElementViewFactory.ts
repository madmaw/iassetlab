///<reference path="../../lib/templa-mvc-core.d.ts"/>
///<reference path="../../lib/templa-mvc-element.d.ts"/>
///<reference path="../../d.ts/handlebars.d.ts"/>

// Module
module Templa.MVC.Element.Handlebarz.Commands {

    /**
     * constant to allow us to create unique ids for the divs
     */
    var templateCommandElementCount: number = 0;

    // Class
    export class HandlebarsCommandElementViewFactory implements Templa.MVC.Element.Commands.ICommandElementViewFactory {

        private _compiledTemplate: (any) => string;

        // Constructor
        constructor(_template: string, private _id: string, private _key?: string, private _options?: any) {
            this._compiledTemplate = Handlebars.compile(_template);
        }

        public create(container: Element, command: Command): Templa.MVC.Element.Commands.ActionElementView {
            var count = templateCommandElementCount;
            templateCommandElementCount++;
            var id = "__command_template_element_id_"+count;
            var options = { command: command };
            options[this._id] = id;
            if (this._key != null) {
                options[this._key] = id;
            }
            if (this._options != null) {
                for (var key in this._options) {
                    var value = this._options[key];
                    options[key] = value;
                }
            }
            var html = this._compiledTemplate(options);
            var view = new HTMLElementView(html, <HTMLElement><any>container, id);
            return new Templa.MVC.Element.Commands.ActionElementView(view, id);
        }
    }

}