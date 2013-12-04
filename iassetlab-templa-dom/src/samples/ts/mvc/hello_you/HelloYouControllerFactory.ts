///<reference path="HelloYouModel.ts"/>

///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/> 
///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/> 

// Module  
module templa.dom.samples.mvc.hello_you {

    export class HelloYouControllerFactory {

        private _model: HelloYouModel;

        constructor () {
            this._model = new HelloYouModel("You");
        }

        public createLabelController(): templa.mvc.IController {

            var labelViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div>Hello <span key='name_element'></span>!</div>");
            var labelController = new templa.dom.samples.mvc.controller.label.LabelController(labelViewFactory, "[key='name_element']");
            labelController.setModel(this._model);
            return labelController;

        }

        public createInputController(): templa.mvc.IController {
            var textInputViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<input key='input_element'></input><br/><input type='button' key='input_button' value='Submit'></input>");
            var textInputController = new templa.dom.samples.mvc.controller.text_input.TextInputController(textInputViewFactory, "[key='input_element']", "[key='input_button']");
            textInputController.setModel(this._model);
            return textInputController;
        }

        public create(): templa.mvc.IController {
            var idInput = "helloyou_input";
            var idOutput = "helloyou_output";
            var controllers: { [_:string]: templa.mvc.IController; } = {};
            controllers["."+idInput] = this.createInputController();
            controllers["."+idOutput] = this.createLabelController();
            var model = new templa.mvc.composite.MappedKeyedControllerModel(    
                controllers
            );

            var viewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory(
                "<div class = '" + idOutput + "' > </div><div class = '" + idInput + "' > </div>"
            );

            var controller = new templa.dom.mvc.jquery.composite.KeyedJQueryController(
                viewFactory
            );
            controller.setModel(model);
            return controller;
        }

    }

}