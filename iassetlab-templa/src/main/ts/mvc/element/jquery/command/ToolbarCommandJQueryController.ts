///<reference path="../AbstractJQueryController.ts"/>
///<reference path="ICommandJQueryViewDescriptionFactory.ts"/>

// Module
module templa.mvc.element.jquery.command {

    // Class
    export class ToolbarCommandJQueryController extends AbstractJQueryController {

        private _backViews: IElementView[];
        private _generalViews: IElementView[];

        // Constructor
        constructor(
            _viewFactory: IElementViewFactory,
            private _commandViewDescriptionFactory:ICommandJQueryViewDescriptionFactory,
            private _backContainerSelector: string,
            private _generalContainerSelector: string
        ) {
            super(_viewFactory);

            this._backViews = [];
            this._generalViews = [];
        }

        public _doDestroy(detachView?: bool) {
            if (detachView == false) {
                // TODO disable onclicks
                this._backViews = [];
                this._generalViews = [];
            } else {
                this._clear();
            }
            var result = super._doDestroy(detachView);
            return result;
        }

        public _detachViews() {
            // remove all the existing commands
            for (var i in this._backViews) {
                var backView: IElementView = this._backViews[i];
                backView.detach();
            }

            // remove all the general commands
            for (var i in this._generalViews) {
                var generalView: IElementView = this._generalViews[i];
                generalView.detach();
            }
        }



        public _clear() {
            this._detachViews();
            this._backViews = [];
            this._generalViews = [];
        }

        public _doLoad(model: templa.mvc.IModel) {
            var commandControllerModel = <templa.mvc.command.ICommandControllerModel>model;
            var commands = commandControllerModel.getCommands();

            this._clear();

            // TODO should probably sort the commands
            for (var i in commands) {
                var command: Command = commands[i];
                var container: IElementReference;
                var views;
                if (command.commandType == CommandTypeBack) {
                    container = this.$reference(this._backContainerSelector);
                    views = this._backViews;
                } else {
                    container = this.$reference(this._generalContainerSelector);
                    views = this._generalViews;
                }
                var actionElementView: CommandJQueryViewDescription = this._commandViewDescriptionFactory.create(container, command);
                var actionElementSelector = actionElementView.actionElementSelector;
                var view = actionElementView.view;
                view.attach();
                var actionElements: JQuery = this.$(actionElementSelector, view.getRoots());
                actionElements.click(function {
                    // hope this works
                    command.action();
                });
                views.push(view);
            }

        }

    }

}
