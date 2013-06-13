///<reference path="../../IElementView.ts"/>
///<reference path="CommandJQueryViewDescription.ts"/>

///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/> 

// Module
module templa.dom.mvc.jquery.command {
    export interface ICommandJQueryViewDescriptionFactory {
        create(container: IElementReference, command: templa.mvc.Command): CommandJQueryViewDescription;
    }
}