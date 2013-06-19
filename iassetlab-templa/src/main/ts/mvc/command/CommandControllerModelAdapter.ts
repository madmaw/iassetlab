///<reference path="../AbstractModel.ts"/>
///<reference path="ICommandControllerModel.ts"/>
///<reference path="../IController.ts"/>

// Module
module templa.mvc.command {

    // Class
    export class CommandControllerModelAdapter extends AbstractModel implements ICommandControllerModel {

        private _listener: (source: IController<IModel>, changeEvent: ControllerChangeEvent) => void;

        constructor(private _controller:IController<IModel>) {
            super();
            this._listener = (source: IController<IModel>, changeEvent: ControllerChangeEvent) => {
                if (changeEvent.getCommandsChanged()) {
                    this._fireModelChangeEvent(new ModelChangeEvent("commands"));
                }
            };
        }

        public getCommands(): Command[] {
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
