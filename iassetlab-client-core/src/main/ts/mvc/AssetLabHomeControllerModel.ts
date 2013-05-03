///<reference path="AssetLabStackControllerModel.ts"/>
///<reference path="home/IHomeControllerModel.ts"/>

///<reference path="../../../../../iassetlab-templa/src/main/ts/mvc/AbstractModel.ts"/>


// Module
module iassetlab.client.core.mvc {

    // Class
    export class AssetLabHomeControllerModel extends templa.mvc.AbstractModel implements iassetlab.client.core.mvc.home.IHomeControllerModel {

        private _displayedOption: string;

        // Constructor
        constructor(private _stackModel: AssetLabStackControllerModel, private _optionIdsToControllers: { string: templa.mvc.IController; }) {
            super();
        }

        public get displayedOption(): string {
            return this._displayedOption;
        }

        public requestDisplayOption(option: string) {
            // show the controller for this 
            var controller: templa.mvc.IController = this._optionIdsToControllers[option];
            if (controller != null) {
                if (this._stackModel._pushSafe(controller)) {
                    this._displayedOption = option;
                    this._fireModelChangeEvent();
                }
            }

        }
    }

}