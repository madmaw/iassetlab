///<reference path="../AbstractElementController.ts"/>
///<reference path="ICommandElementViewFactory.ts"/>

// Module
module templa.mvc.element.command {

    // Class
    export class ToolbarCommandElementController extends AbstractElementController {

        private _backViews: IElementView[];
        private _generalViews: IElementView[];

        // Constructor
        constructor(
            _viewFactory: IElementViewFactory,
            private _commandViewFactory:ICommandElementViewFactory,
            private _backContainerKey: string,
            private _generalContainerKey: string
        ) {
            super(_viewFactory);

            this._backViews = [];
            this._generalViews = [];
        }

        public _clear() {
            // remove all the existing commands
            for (var i in this._backViews) {
                var backView: IElementView = this._backViews[i];
                backView.detach();
            }
            this._backViews = [];

            // remove all the general commands
            for (var i in this._generalViews) {
                var generalView: IElementView = this._generalViews[i];
                generalView.detach();
            }
            this._generalViews = [];
        }

        public _load(model: templa.mvc.IModel) {
            var commandControllerModel = <templa.mvc.command.ICommandControllerModel>model;
            var commands = commandControllerModel.getCommands();

            this._clear();

            // TODO should probably sort the commands
            for (var i in commands) {
                var command: Command = commands[i];
                var container: Element;
                var views;
                if (command.commandType == CommandTypeBack) {
                    container = this._find(this._backContainerKey);
                    views = this._backViews;
                } else {
                    container = this._find(this._generalContainerKey);
                    views = this._generalViews;
                }
                var actionElementView: ActionElementView = this._commandViewFactory.create(container, command);
                var actionElementKey = actionElementView.actionElementKey;
                var view = actionElementView.view;
                view.attach();
                var actionElement:HTMLElement = <HTMLElement><any>view.find(actionElementKey);
                actionElement.onclick = function {
                    // hope this works
                    command.action();
                };
                views.push(view);
            }

        }

    }

}
