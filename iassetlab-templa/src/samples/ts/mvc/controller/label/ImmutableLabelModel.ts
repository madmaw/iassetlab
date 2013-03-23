///<reference path="../../../../../main/ts/mvc/AbstractModel.ts"/>
///<reference path="../../../../../main/ts/mvc/composite/IStackControllerModel.ts"/>
///<reference path="../../../../../main/ts/mvc/element/DirectElementReference.ts"/>
///<reference path="../../../../../main/ts/mvc/element/IElementViewFactory.ts"/>
///<reference path="../../../../../main/ts/mvc/element/DivElementViewFactory.ts"/>
///<reference path="../../../../../main/ts/mvc/element/jquery/composite/StackJQueryController.ts"/>
///<reference path="../../../../../main/ts/mvc/composite/AbstractStackControllerModel.ts"/>
///<reference path="ILabelModel.ts"/>


// Module
module templa.samples.mvc.controller.label {

    // Class
    export class ImmutableLabelModel extends templa.mvc.AbstractModel implements templa.samples.mvc.controller.label.ILabelModel {

        constructor(private _label: string) {
            super();
        }

        public getLabel(): string {
            return this._label;
        }
    }

}