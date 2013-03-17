///<reference path="AbstractCompositeElementController.ts"/>
///<reference path="../../composite/IStackControllerModel.ts"/>
///<reference path="../../../animation/element/IElementAnimationFactory.ts"/>

module templa.mvc.element.composite {
    export class StackElementController extends AbstractCompositeElementController {

        private _backCommand: Command;

        constructor(
            viewFactory: templa.mvc.element.IElementViewFactory,
            private _popAddAnimationFactory?: templa.animation.element.IElementAnimationFactory,
            private _popRemoveAnimationFactory?: templa.animation.element.IElementAnimationFactory,
            private _pushAddAnimationFactory?: templa.animation.element.IElementAnimationFactory,
            private _pushRemoveAnimationFactory?: templa.animation.element.IElementAnimationFactory
        ) {
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
            var stackControllerModel: templa.mvc.composite.IStackControllerModel = <templa.mvc.composite.IStackControllerModel>this._model;
            stackControllerModel.requestPop();
        }

        public getCommands(): Command[]{
            var commands = super.getCommands();
            if (commands == null) {
                commands = [];
            }
            commands.push(this._backCommand);
            return commands;
        }
    }
}