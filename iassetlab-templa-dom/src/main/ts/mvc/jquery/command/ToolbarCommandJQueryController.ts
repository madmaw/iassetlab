///<reference path="../AbstractJQueryController.ts"/>
///<reference path="ICommandJQueryViewDescriptionFactory.ts"/>

///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/> 

// Module
module templa.dom.mvc.jquery.command {

    // Class
    export class ToolbarCommandJQueryController<ModelType extends templa.mvc.command.ICommandControllerModel> extends AbstractJQueryController<ModelType> {

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

        public _doLoad(model: templa.mvc.command.ICommandControllerModel) {
            var commandControllerModel = model;
            var commands = commandControllerModel.getCommands();

            this._clear();

            // TODO should probably sort the commands
            for (var i in commands) {
                var command: templa.mvc.Command = commands[i];
                var container: IElementReference;
                var selector: string;
                var views;
                if (command.getCommandType() == templa.mvc.CommandTypeBack) {
                    selector = this._backContainerSelector;
                    views = this._backViews;
                } else {
                    selector = this._generalContainerSelector;
                    views = this._generalViews;
                }
                container = this.$reference(selector);
                if (container == null) {
                    throw "no container for selector " + selector;
                }
                var actionElementView: CommandJQueryViewDescription = this._commandViewDescriptionFactory.create(container, command);
                var actionElementSelector = actionElementView.getActionElementSelector();
                var view = actionElementView.getView();
                view.attach();
                var actionElements: JQuery = this.$(actionElementSelector, view.getRoots());
                actionElements.click(() => {
                    // hope this works
                    (command.getAction())();
                });
                views.push(view);
            }

        }

    }

}
