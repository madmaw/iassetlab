///<reference path="ICommandControllerModel.ts"/>
///<reference path="../AbstractModel.ts"/>
///<reference path="../IController.ts"/>
///<reference path="../IModel.ts"/>
///<reference path="../ModelChangeEvent.ts"/>
///<reference path="../ControllerChangeEvent.ts"/>
///<reference path="../Command.ts"/>

// Module
module templa.mvc.command {

    // Class
    export class CommandControllerModelAdapter extends templa.mvc.AbstractModel implements ICommandControllerModel {

        private _listener: (source: IController, changeEvent: ControllerChangeEvent) => void;

        constructor(private _controller:IController) {
            super();
            this._listener = (source: IController, changeEvent: ControllerChangeEvent) => {
                if (changeEvent.getCommandsChanged()) {
                    this._fireModelChangeEvent(new ModelChangeEvent("commands"));
                }
            };
        }

        public getCommands(): templa.mvc.Command[] {
            return this._controller.getCommands();
        }

        public _startedListening() {
            this._controller.addOnChangeListener(this._listener);
        }

        public _stoppedListening() {
            this._controller.removeOnChangeListener(this._listener);
        }
    }

}
