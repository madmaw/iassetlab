///<reference path="AssetLabStackControllerModel.ts"/>
///<reference path="home/IHomeControllerModel.ts"/>

///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="../../../../build/defs/jquery.d.ts"/>


// Module
module iassetlab.client.core.mvc {

    // Class
    export class AssetLabHomeControllerModel extends templa.mvc.AbstractModel implements iassetlab.client.core.mvc.home.IHomeControllerModel {

        private _displayedOption: string;

        // Constructor
        constructor(private _owner: templa.mvc.IController, private _stackModel: AssetLabStackControllerModel, private _optionIdsToControllers: { [_: string]: templa.mvc.IController; }) {
            super();
        }

        public getDisplayedOption(): string {
            return this._displayedOption;
        }

        public requestDisplayOption(option: string, suppressDescriptionChangeEvent?:boolean): templa.mvc.IController {
            // show the controller for this 
            var controller: templa.mvc.IController;
            if (option != null) {
                controller = this._optionIdsToControllers[option];
                if (controller != null) {

                    var isOnTop = this._stackModel.peek() == this._owner;
                    var change: templa.mvc.IModelStateChange = this._stackModel._pushPair(this._owner, controller, null, false);
                    var oldDisplayedOption = this._displayedOption;
                    change = {
                        undo: () => {
                            if (isOnTop) {
                                // TODO ensure that the owner controller is visible, do nothing else
                                this._stackModel._ensureVisible(this._owner, true);
                            } else {
                                this.requestDisplayOption(oldDisplayedOption, true);
                            }
                        },
                        redo: () => {
                            this.requestDisplayOption(option, true);
                        }
                    };
                    this._displayedOption = option;

                    this._fireModelChangeEvent(null, true);
                    if (suppressDescriptionChangeEvent != true) {
                        this._fireStateDescriptionChangeEvent(this, change);
                    }
                }
            } else {
                controller = null;
                // pop back to the start
                while (this._stackModel.peek() != this._owner && this._stackModel.peek != null) {
                    this._stackModel._pop(false, suppressDescriptionChangeEvent);
                }
            }
            return controller;
        }

        public createStateDescription(models?: templa.mvc.IModel[]): any {
            models = this._checkModels(models);
            // are we ontop of the stack?
            var result;
            if (this._stackModel.peek() == this._owner) {
                // oh well
                result = null;
            } else {
                // obtain controller's model's description
                var controller: templa.mvc.IController = this._optionIdsToControllers[this._displayedOption];
                var optionData = controller.getModel().createStateDescription(models);
                result = {
                    option: this._displayedOption,
                    optionData: optionData
                };
            }

            return result;
        }

        public loadStateDescription(description: any) {
            // TODO load controller's model's description
            if (description != null) {
                var option = description["option"];
                var controller = this.requestDisplayOption(option, true);
                if (controller != null) {
                    var optionData = description["optionData"];
                    controller.getModel().loadStateDescription(optionData);
                }
            }
        }

    }

}