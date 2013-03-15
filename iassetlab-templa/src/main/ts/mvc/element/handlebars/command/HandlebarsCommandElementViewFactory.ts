///<reference path="../../../../../d.ts/handlebars.d.ts"/>
///<reference path="../../command/ICommandElementViewFactory.ts"/>
///<reference path="../../command/ActionElementView.ts"/>
///<reference path="../../HTMLElementView.ts"/>
///<reference path="../../../Command.ts"/>

// Module
module templa.mvc.element.handlebars.commands {

    /**
     * constant to allow us to create unique ids for the divs
     */
    var templateCommandElementCount: number = 0;

    // Class
    export class HandlebarsCommandElementViewFactory implements templa.mvc.element.command.ICommandElementViewFactory {

        private _compiledTemplate: (any) => string;

        // Constructor
        constructor(_template: string, private _id: string, private _key?: string, private _options?: any) {
            this._compiledTemplate = Handlebars.compile(_template);
        }

        public create(container: Element, command: Command): templa.mvc.element.command.ActionElementView {
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
            return new templa.mvc.element.command.ActionElementView(view, id);
        }
    }

}