///<reference path="../../../../main/ts/mvc/IController.ts"/>
///<reference path="../../../../main/ts/mvc/composite/AbstractStackControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/composite/IStackControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/command/CommandControllerModelAdapter.ts"/>
///<reference path="../../../../main/ts/mvc/element/DirectElementReference.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/command/ICommandJQueryViewDescriptionFactory.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/command/ToolbarCommandJQueryController.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/composite/StackJQueryController.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/composite/KeyedJQueryController.ts"/>
///<reference path="../../../../main/ts/mvc/element/TemplateElementViewFactory.ts"/>
///<reference path="../../../../main/ts/animation/element/CSSElementClassAnimationFactory.ts"/>
///<reference path="../../../../main/ts/util/Arrays.ts"/>
///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>
///<reference path="../controller/text_input/TextInputController.ts"/>
///<reference path="text_input/ITextInputModel.ts"/>


// Module
module templa.samples.mvc.controller {

    export class ToolbarDecoratorModel extends templa.mvc.composite.AbstractCompositeControllerModel implements templa.mvc.composite.IKeyedControllerModel {

        constructor(private _toolbarController: templa.mvc.IController, private _toolbarControllerKey: string, private _otherControllers: templa.mvc.IController[], private _otherControllerKey: string) {
            super();
        }

        public getControllerKey(controller: templa.mvc.IController): string {
            var result: string;
            if (controller == this._toolbarController) {
                result = this._toolbarControllerKey;
            } else {
                result = this._otherControllerKey;
            }
            return result;
        }

        public _getDescribedControllers(): templa.mvc.IController[]{
            // assume the toolbar is stateless
            return this._otherControllers;
        }

        public getControllers(): templa.mvc.IController[]{
            var result = [this._toolbarController];
            templa.util.Arrays.pushAll(result, this._otherControllers);
            return result;
        }
    }

}
