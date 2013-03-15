///<reference path="../IModel.ts"/>
///<reference path="../Command.ts"/>

module templa.mvc.command {

    export interface ICommandControllerModel extends IModel {
        getCommands(): Command[];
    }

}
