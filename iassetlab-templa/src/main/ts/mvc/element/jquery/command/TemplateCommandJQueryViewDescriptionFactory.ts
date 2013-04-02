///<reference path="../../../../../d.ts/handlebars.d.ts"/>
///<reference path="ICommandJQueryViewDescriptionFactory.ts"/>
///<reference path="CommandJQueryViewDescription.ts"/>
///<reference path="../../../../template/ITemplateSource.ts"/>
///<reference path="../../../../template/StringHandlebarsTemplateSource.ts"/>
///<reference path="../../../../template/ExternalHandlebarsTemplateSource.ts"/>
///<reference path="../../../../loading/ILoadable.ts"/>
///<reference path="../../DocumentFragmentElementView.ts"/>
///<reference path="../../../Command.ts"/>

// Module
module templa.mvc.element.jquery.command {

    /**
     * constant to allow us to create unique ids for the divs
     */
    var templateCommandElementCount: number = 0;

    // Class
    export class TemplateCommandJQueryViewDescriptionFactory implements ICommandJQueryViewDescriptionFactory {

        public static createFromString(templateString: string, loadables?: templa.loading.ILoadable[], options?: any): TemplateCommandJQueryViewDescriptionFactory {
            var templateSource = new templa.template.StringHandlebarsTemplateSource(templateString);
            if (loadables != null) {
                loadables.push(templateSource);
            }
            return new TemplateCommandJQueryViewDescriptionFactory(templateSource, options);
        }

        public static createFromURL(templateURL: string, loadables?: templa.loading.ILoadable[], options?: any): TemplateCommandJQueryViewDescriptionFactory {
            var templateSource = new templa.template.ExternalHandlebarsTemplateSource(templateURL);
            if (loadables != null) {
                loadables.push(templateSource);
            }
            return new TemplateCommandJQueryViewDescriptionFactory(templateSource, options);
        }

        // Constructor
        constructor(private _templateSource:templa.template.ITemplateSource, private _options?: any) {

        }

        public create(_container: IElementReference, _command: Command): CommandJQueryViewDescription {
            var count = templateCommandElementCount;
            templateCommandElementCount++;
            var id = "__command_template_element_id_"+count;
            var options = { command: _command };
            //options[this._idAttributeName] = id;
            if (this._options != null) {
                for (var key in this._options) {
                    var value = this._options[key];
                    options[key] = value;
                }
            }
            var template: (any) => string = this._templateSource.resolve();
            var html = template(options);
            var view = DocumentFragmentElementView.createFromHTML(html, _container, id);
            return new CommandJQueryViewDescription(view, "#" + id);
        }
    }

}