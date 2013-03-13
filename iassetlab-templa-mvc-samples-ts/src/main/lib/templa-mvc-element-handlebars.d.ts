module Templa.MVC.Element.Handlebarz.Commands {
    class HandlebarsCommandElementViewFactory implements Templa.MVC.Element.Commands.ICommandElementViewFactory {
        private _id;
        private _key;
        private _options;
        private _compiledTemplate;
        constructor(_template: string, _id: string, _key?: string, _options?: any);
        public create(container: Element, command: Command): Templa.MVC.Element.Commands.ActionElementView;
    }
}
module Templa.MVC.Element.Handlebarz {
    class HandlebarsElementViewFactory implements IElementViewFactory {
        private _id;
        private _options;
        private _compiledTemplate;
        constructor(_template: string, _id: string, _options?: any);
        public create(container: Element): IElementView;
    }
}
