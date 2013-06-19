///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>
///<reference path="../controller/text_input/TextInputController.ts"/>
///<reference path="text_input/ITextInputModel.ts"/>


///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/> 
///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/> 

// Module
module templa.dom.samples.mvc.controller {

    export class ToolbarDecoratorModel extends templa.mvc.composite.AbstractCompositeControllerModel implements templa.mvc.composite.IKeyedControllerModel {

        constructor(private _toolbarController: templa.mvc.IController<templa.mvc.IModel>, private _toolbarControllerKey: string, private _otherControllers: templa.mvc.IController<templa.mvc.IModel>[], private _otherControllerKey: string) {
            super();
        }

        public getControllerKey(controller: templa.mvc.IController<templa.mvc.IModel>): string {
            var result: string;
            if (controller == this._toolbarController) {
                result = this._toolbarControllerKey;
            } else {
                result = this._otherControllerKey;
            }
            return result;
        }

        public _getDescribedControllers(): templa.mvc.IController<templa.mvc.IModel>[]{
            // assume the toolbar is stateless
            return this._otherControllers;
        }

        public getControllers(): templa.mvc.IController<templa.mvc.IModel>[]{
            var result = [this._toolbarController];
            templa.util.Arrays.pushAll(result, this._otherControllers);
            return result;
        }
    }

}
