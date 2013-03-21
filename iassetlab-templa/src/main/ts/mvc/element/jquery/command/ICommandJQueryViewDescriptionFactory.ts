///<reference path="../../IElementView.ts"/>
///<reference path="CommandJQueryViewDescription.ts"/>
///<reference path="../../../Command.ts"/>

module templa.mvc.element.jquery.command {
    export interface ICommandJQueryViewDescriptionFactory {
        create(container: IElementReference, command: Command): CommandJQueryViewDescription;
    }
}