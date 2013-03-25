///<reference path="../../../../main/ts/mvc/IController.ts"/>
///<reference path="../../../../main/ts/mvc/composite/AbstractStackControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/composite/IStackControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/command/CommandControllerModelAdapter.ts"/>
///<reference path="../../../../main/ts/mvc/element/DirectElementReference.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/command/ICommandJQueryViewDescriptionFactory.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/command/ToolbarCommandJQueryController.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/composite/StackJQueryController.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/composite/KeyedJQueryController.ts"/>
///<reference path="../../../../main/ts/mvc/element/HandlebarsElementViewFactory.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/command/HandlebarsCommandJQueryViewDescriptionFactory.ts"/>
///<reference path="../../../../main/ts/animation/element/CSSElementClassAnimationFactory.ts"/>
///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>
///<reference path="../controller/label/ImmutableLabelModel.ts"/>
///<reference path="../controller/text_input/TextInputController.ts"/>
///<reference path="../controller/text_input/ITextInputModel.ts"/>
///<reference path="DecoratedStackToolbarDecoratorModel.ts"/>

// Module
module templa.samples.mvc.decorated_stack {

    // Class
    export class DecoratedStackModel extends templa.mvc.composite.AbstractStackControllerModel implements templa.samples.mvc.controller.text_input.ITextInputModel, templa.mvc.composite.IStackControllerModel {
        
        private labelViewKey: string;
        private labelViewFactory: templa.mvc.element.IElementViewFactory;
        private decoratorToolbarViewKey: string;
        private decoratorBodyViewKey: string;
        private decoratorViewFactory: templa.mvc.element.IElementViewFactory;
        private toolbarBackViewKey: string;
        private toolbarGeneralViewKey: string;
        private toolbarViewFactory: templa.mvc.element.IElementViewFactory;
        private toolbarCommandElementViewFactory: templa.mvc.element.jquery.command.ICommandJQueryViewDescriptionFactory;

        // Constructor
        constructor(private _topLevelController:templa.mvc.IController) {
            super();
            this.labelViewKey = "label";
            this.labelViewFactory = new templa.mvc.element.HandlebarsElementViewFactory(
                "<span key='{{label_key}}'></span>",
                { label_key: this.labelViewKey }
            );
            this.decoratorToolbarViewKey = "toolbar";
            this.decoratorBodyViewKey = "body";
            this.decoratorViewFactory = new templa.mvc.element.HandlebarsElementViewFactory(
                "<div key='{{toolbar_key}}'></div><div key='{{view_key}}'></div>", 
                { toolbar_key: this.decoratorToolbarViewKey, view_key: this.decoratorBodyViewKey }
            );
            this.toolbarBackViewKey = "back";
            this.toolbarGeneralViewKey = "general";
            this.toolbarViewFactory = new templa.mvc.element.HandlebarsElementViewFactory(
                "<div key='{{back_buttons}}'></div><div key='{{general_buttons}}'></div>",
                { back_buttons: this.toolbarBackViewKey, general_buttons: this.toolbarGeneralViewKey }
            );

            this.toolbarCommandElementViewFactory = new templa.mvc.element.jquery.command.HandlebarsCommandJQueryViewDescriptionFactory(
                "<a>{{command.id}}</a>"
            );
        }

        getValue(): string {
            return "";
        }

        requestSubmit(value: string) {
            // push a new controller
            if (value != null && value.length > 0) {
                var labelController = new templa.samples.mvc.controller.label.LabelController(this.labelViewFactory, "[key='"+this.labelViewKey+"']");
                labelController.setModel(new templa.samples.mvc.controller.label.ImmutableLabelModel(value));

                var toolbarController = new templa.mvc.element.jquery.command.ToolbarCommandJQueryController(
                    this.toolbarViewFactory,
                    this.toolbarCommandElementViewFactory,
                    "[key='"+this.toolbarBackViewKey+"']",
                    "[key='"+this.toolbarGeneralViewKey+"']"
                );
                toolbarController.setModel(new templa.mvc.command.CommandControllerModelAdapter(this._topLevelController));

                var map = <{ string: string; }>{};
                map[this.decoratorToolbarViewKey] = "[key='"+this.decoratorToolbarViewKey+"']";
                map[this.decoratorBodyViewKey] = "[key='"+this.decoratorBodyViewKey+"']";

                var decoratorController = new templa.mvc.element.jquery.composite.KeyedJQueryController(
                    this.decoratorViewFactory, 
                    map
                );
                decoratorController.setModel(new DecoratedStackToolbarDecoratorModel(toolbarController, this.decoratorToolbarViewKey, labelController, this.decoratorBodyViewKey));
                this._push(decoratorController);
            } else {
                // testing only
                this._push(null);
            }
        }
    }

}
