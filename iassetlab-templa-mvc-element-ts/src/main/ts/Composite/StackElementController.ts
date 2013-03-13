///<reference path="AbstractCompositeElementController.ts"/>
///<reference path="../../lib/templa-mvc-core.d.ts"/>

module Templa.MVC.Element.Composite {
    export class StackElementController extends AbstractCompositeElementController {

        private _backCommand: Command;

        constructor(viewFactory: Templa.MVC.Element.IElementViewFactory) {
            super(viewFactory);
            this._backCommand = new Command(
                "back",
                CommandTypeBack,
                1,
                () => {
                    this._back();
                }
            );
        }

        public _back() {
            var stackControllerModel: Templa.MVC.Composite.IStackControllerModel = <Templa.MVC.Composite.IStackControllerModel>this._model;
            stackControllerModel.requestPop();
        }


    }
}