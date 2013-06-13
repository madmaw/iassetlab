///<reference path="BasicStackModel.ts"/>

///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/> 
///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/> 

// Module
module templa.dom.samples.mvc.basic_stack {

    // Class
    export class BasicStackControllerFactory {

        private _model: BasicStackModel;

        // Constructor
        constructor() {
            this._model = new BasicStackModel();
        }

        public createStackController(): templa.mvc.IController {
            var stackViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div key='stack'></div>");
            var stackController = new templa.dom.mvc.jquery.composite.StackJQueryController(stackViewFactory, []);
            stackController.setModel(this._model);
            return stackController;
        }

        public createInputController(): templa.mvc.IController {
            var inputElementKey = "input_element";
            var inputButtonKey = "input_button";
            var inputViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<input key='" + inputElementKey + "'></input><br/><input type='button' key='" + inputButtonKey + "' value='Submit'></input>");
            var inputController = new templa.dom.samples.mvc.controller.text_input.TextInputController(inputViewFactory, "[key='" + inputElementKey + "']", "[key='" + inputButtonKey + "']");
            inputController.setModel(this._model);
            return inputController;
        }

        public create(): templa.mvc.IController {
            var idInput = "basic_input";
            var idStack = "basic_stack";
            var controllers = {};
            controllers["."+idInput] = this.createInputController();
            controllers["."+idStack] = this.createStackController();
            var model = new templa.mvc.composite.MappedKeyedControllerModel(
                <{ string: templa.mvc.IController; }>controllers
            );
            
            var viewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory(
                "<div class = '" + idInput +"' > </div><div class = '"+idStack+"' > </div>"
            );

            var controller = new templa.dom.mvc.jquery.composite.KeyedJQueryController(
                viewFactory
            );
            controller.setModel(model);
            return controller;
        }
    }

}