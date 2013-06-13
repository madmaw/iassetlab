///<reference path="../../IElementReference.ts"/>
///<reference path="ICommandJQueryViewDescriptionFactory.ts"/>

///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/> 

// Module
module templa.dom.mvc.jquery.command {

    // Class
    export class IdDelegatingCommandJQueryViewDescriptionFactory implements ICommandJQueryViewDescriptionFactory {

        // Constructor
        constructor(
            private _defaultDescriptionFactory: ICommandJQueryViewDescriptionFactory,
            private _idsToDescriptionFactories: { string: ICommandJQueryViewDescriptionFactory; }
        ) {

        }

        public create(container: templa.dom.mvc.IElementReference, command: templa.mvc.Command): CommandJQueryViewDescription {
            var factory = this._idsToDescriptionFactories[command.id];
            if (factory == null) {
                factory = this._defaultDescriptionFactory;
            }
            return factory.create(container, command);
        }

    }

}
