///<reference path="../../../../main/ts/mvc/composite/MappedKeyedControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/composite/KeyedJQueryController.ts"/>
///<reference path="BasicStackModel.ts"/>

// Module
module templa.samples.mvc.basic_stack {

    // Class
    export class BasicStackControllerFactory {

        private _model: BasicStackModel;

        // Constructor
        constructor() {
            this._model = new BasicStackModel();
        }

        public createStackController(): templa.mvc.IController {
            var stackViewFactory = new templa.mvc.element.DivElementViewFactory("<div key='stack'></div>");
            var stackController = new templa.mvc.element.jquery.composite.StackJQueryController(stackViewFactory);
            stackController.setModel(this._model);
            return stackController;
        }

        public createInputController(): templa.mvc.IController {
            var inputElementKey = "input_element";
            var inputButtonKey = "input_button";
            var inputViewFactory = new templa.mvc.element.DivElementViewFactory("<input key='" + inputElementKey + "'></input><br/><input type='button' key='" + inputButtonKey + "' value='Submit'></input>");
            var inputController = new templa.samples.mvc.controller.text_input.TextInputController(inputViewFactory, "[key='" + inputElementKey + "']", "[key='" + inputButtonKey + "']");
            inputController.setModel(this._model);
            return inputController;
        }

        public create(): templa.mvc.IController {
            var idInput = "basic_input";
            var idStack = "basic_stack";
            var controllers = {};
            controllers[idInput] = this.createInputController();
            controllers[idStack] = this.createStackController();
            var model = new templa.mvc.composite.MappedKeyedControllerModel(
                <{ string: templa.mvc.IController; }>controllers
            );
            
            var viewFactory = new templa.mvc.element.DivElementViewFactory(
                "<div id = '" + idInput +"' > </div><div id = '"+idStack+"' > </div>"
            );

            var controller = new templa.mvc.element.jquery.composite.KeyedJQueryController(
                viewFactory
            );
            controller.setModel(model);
            return controller;
        }
    }

}