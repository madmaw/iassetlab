///<reference path="../../../../../d.ts/handlebars.d.ts"/>
///<reference path="ICommandJQueryViewDescriptionFactory.ts"/>
///<reference path="CommandJQueryViewDescription.ts"/>
///<reference path="../../HTMLElementView.ts"/>
///<reference path="../../../Command.ts"/>

// Module
module templa.mvc.element.jquery.command {

    /**
     * constant to allow us to create unique ids for the divs
     */
    var templateCommandElementCount: number = 0;

    // Class
    export class HandlebarsCommandJQueryViewDescriptionFactory implements ICommandJQueryViewDescriptionFactory {

        private _compiledTemplate: (any) => string;

        // Constructor
        constructor(_template: string, private _idAttributeName: string, private _options?: any) {
            this._compiledTemplate = Handlebars.compile(_template);
        }

        public create(_container: IElementReference, _command: Command): CommandJQueryViewDescription {
            var count = templateCommandElementCount;
            templateCommandElementCount++;
            var id = "__command_template_element_id_"+count;
            var options = { command: _command };
            options[this._idAttributeName] = id;
            if (this._options != null) {
                for (var key in this._options) {
                    var value = this._options[key];
                    options[key] = value;
                }
            }
            var html = this._compiledTemplate(options);
            var view = new HTMLElementView(html, _container, id);
            return new CommandJQueryViewDescription(view, "["+this._idAttributeName+"='"+id+"']");
        }
    }

}