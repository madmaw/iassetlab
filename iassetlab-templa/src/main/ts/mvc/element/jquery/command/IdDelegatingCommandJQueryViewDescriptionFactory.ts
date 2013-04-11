///<reference path="ICommandJQueryViewDescriptionFactory.ts"/>

// Module
module templa.mvc.element.jquery.command {

    // Class
    export class IdDelegatingCommandJQueryViewDescriptionFactory implements ICommandJQueryViewDescriptionFactory {

        // Constructor
        constructor(
            private _defaultDescriptionFactory: ICommandJQueryViewDescriptionFactory,
            private _idsToDescriptionFactories: { string: ICommandJQueryViewDescriptionFactory; }
        ) {

        }

        public create(container: IElementReference, command: Command): CommandJQueryViewDescription {
            var factory = this._idsToDescriptionFactories[command.id];
            if (factory == null) {
                factory = this._defaultDescriptionFactory;
            }
            return factory.create(container, command);
        }

    }

}
