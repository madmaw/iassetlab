///<reference path="../../../../../iassetlab-templa/src/main/ts/mvc/IController.ts"/>
///<reference path="../../../../../iassetlab-templa/src/main/ts/mvc/composite/AbstractStackControllerModel.ts"/>
///<reference path="../../../../../iassetlab-templa/src/main/ts/mvc/composite/IStackControllerModel.ts"/>
///<reference path="../../../../../iassetlab-templa/src/main/ts/mvc/command/CommandControllerModelAdapter.ts"/>
///<reference path="../../../../../iassetlab-templa/src/main/ts/mvc/element/DirectElementReference.ts"/>
///<reference path="../../../../../iassetlab-templa/src/main/ts/mvc/element/jquery/command/ICommandJQueryViewDescriptionFactory.ts"/>
///<reference path="../../../../../iassetlab-templa/src/main/ts/mvc/element/jquery/command/ToolbarCommandJQueryController.ts"/>
///<reference path="../../../../../iassetlab-templa/src/main/ts/mvc/element/jquery/composite/StackJQueryController.ts"/>
///<reference path="../../../../../iassetlab-templa/src/main/ts/mvc/element/jquery/composite/KeyedJQueryController.ts"/>
///<reference path="../../../../../iassetlab-templa/src/main/ts/mvc/element/TemplateElementViewFactory.ts"/>
///<reference path="../../../../../iassetlab-templa/src/main/ts/animation/element/CSSElementClassAnimationFactory.ts"/>
///<reference path="../../../../../iassetlab-templa/src/main/ts/util/Arrays.ts"/>

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
