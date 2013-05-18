///<reference path="AssetLabStackControllerModel.ts"/>
///<reference path="home/IHomeControllerModel.ts"/>

///<reference path="../../../../../iassetlab-templa/src/main/ts/mvc/AbstractModel.ts"/>


// Module
module iassetlab.client.core.mvc {

    // Class
    export class AssetLabHomeControllerModel extends templa.mvc.AbstractModel implements iassetlab.client.core.mvc.home.IHomeControllerModel {

        private _displayedOption: string;

        // Constructor
        constructor(private _owner:templa.mvc.IController, private _stackModel: AssetLabStackControllerModel, private _optionIdsToControllers: { string: templa.mvc.IController; }) {
            super();
        }

        public get displayedOption(): string {
            return this._displayedOption;
        }

        public requestDisplayOption(option: string, suppressDescriptionChangeEvent?:bool) {
            // show the controller for this 
            if (option != null) {
                var controller: templa.mvc.IController = this._optionIdsToControllers[option];
                if (controller != null) {

                    var isOnTop = this._stackModel.peek == this._owner;
                    var change: templa.mvc.IModelStateChange = this._stackModel._pushPair(this._owner, controller, option, false);
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
                    // TODO need to aggregate these two events..somehow
                    this._fireModelChangeEvent(null, true);
                    if (suppressDescriptionChangeEvent != true) {
                        this._fireStateDescriptionChangeEvent(this, change);
                    }
                }
            } else {
                // pop back to the start
                while (this._stackModel.peek != this._owner && this._stackModel.peek != null) {
                    this._stackModel._pop(false, suppressDescriptionChangeEvent);
                }
            }

        }

        public createStateDescription(models?: templa.mvc.IModel[]): any {
            // are we ontop of the stack?
            var result;
            if (this._stackModel.peek == this._owner) {
                // oh well
                result = null;
            } else {
                // just pass it through to the root controller and let it deal
                // TODO obtain controller's model's description
                result = this._displayedOption;
            }

            return result;
        }

        public loadStateDescription(description: any) {
            // TODO load controller's model's description
            this.requestDisplayOption(description, true);
        }

    }

}