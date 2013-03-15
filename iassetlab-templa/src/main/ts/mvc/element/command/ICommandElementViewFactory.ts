///<reference path="../IElementView.ts"/>
///<reference path="ActionElementView.ts"/>
///<reference path="../../Command.ts"/>

module templa.mvc.element.command {
    export interface ICommandElementViewFactory {
        create(container: Element, command: Command): ActionElementView;
    }
}