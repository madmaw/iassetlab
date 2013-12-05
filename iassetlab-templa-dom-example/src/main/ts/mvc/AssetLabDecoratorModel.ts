///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="../../../../build/defs/jquery.d.ts"/>

// Module
module iassetlab.client.core.mvc {

    export class AssetLabDecoratorModel extends templa.mvc.composite.AbstractCompositeControllerModel implements templa.mvc.composite.IKeyedControllerModel {

        constructor(private _decorationController: templa.mvc.IController, private _decorationControllerKey: string, private _otherControllers: templa.mvc.IController[], private _otherControllerKey: string) {
            super();
        }

        public getControllerKey(controller: templa.mvc.IController): string {
            var result: string;
            if (controller == this._decorationController) {
                result = this._decorationControllerKey;
            } else {
                result = this._otherControllerKey;
            }
            return result;
        }

        public _getDescribedControllers(): templa.mvc.IController[] {
            // assume the toolbar is stateless
            return this._otherControllers;
        }

        public getControllers(): templa.mvc.IController[] {
            var result = [this._decorationController];
            templa.util.Arrays.pushAll(result, this._otherControllers);
            return result;
        }
    }

}
