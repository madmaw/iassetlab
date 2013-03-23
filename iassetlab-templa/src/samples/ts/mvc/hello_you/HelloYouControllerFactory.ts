///<reference path="../../../../main/ts/mvc/composite/MappedKeyedControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/composite/KeyedJQueryController.ts"/>
///<reference path="HelloYouModel.ts"/>

// Module
module templa.samples.mvc.hello_you {

    export class HelloYouControllerFactory {

        private _model: HelloYouModel;

        constructor () {
            this._model = new HelloYouModel("You");
        }

        public createLabelController(): templa.mvc.IController {

            var labelViewFactory = new templa.mvc.element.DivElementViewFactory("Hello <span key='name_element'></span>!");
            var labelController = new templa.samples.mvc.controller.label.LabelController(labelViewFactory, "[key='name_element']");
            labelController.setModel(this._model);
            return labelController;

        }

        public createInputController(): templa.mvc.IController {
            var textInputViewFactory = new templa.mvc.element.DivElementViewFactory("<input key='input_element'></input><br/><input type='button' key='input_button' value='Submit'></input>");
            var textInputController = new templa.samples.mvc.controller.text_input.TextInputController(textInputViewFactory, "[key='input_element']", "[key='input_button']");
            textInputController.setModel(this._model);
            return textInputController;
        }

        public create(): templa.mvc.IController {
            var idInput = "helloyou_input";
            var idOutput = "helloyou_output";
            var controllers = {};
            controllers[idInput] = this.createInputController();
            controllers[idOutput] = this.createLabelController();
            var model = new templa.mvc.composite.MappedKeyedControllerModel(
                <{ string: templa.mvc.IController; }>controllers
            );

            var viewFactory = new templa.mvc.element.DivElementViewFactory(
                "<div id = '" + idOutput + "' > </div><div id = '" + idInput + "' > </div>"
            );

            var controller = new templa.mvc.element.jquery.composite.KeyedJQueryController(
                viewFactory
            );
            controller.setModel(model);
            return controller;
        }

    }

}