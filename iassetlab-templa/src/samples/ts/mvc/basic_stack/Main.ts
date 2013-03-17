///<reference path="../../../../main/ts/mvc/AbstractModel.ts"/>
///<reference path="../../../../main/ts/mvc/composite/IStackControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/element/IElementViewFactory.ts"/>
///<reference path="../../../../main/ts/mvc/element/DivElementViewFactory.ts"/>
///<reference path="../../../../main/ts/mvc/element/composite/StackElementController.ts"/>
///<reference path="../../../../main/ts/mvc/composite/AbstractStackControllerModel.ts"/>

///<reference path="../Controller/label/LabelController.ts"/>
///<reference path="../Controller/label/ILabelModel.ts"/>
///<reference path="../Controller/text_input/TextInputController.ts"/>
///<reference path="../Controller/text_input/ITextInputModel.ts"/>

// Module
module templa.samples.mvc.basic_stack {

    // Class
    export class BasicStackModel extends templa.mvc.composite.AbstractStackControllerModel implements templa.samples.mvc.controller.text_input.ITextInputModel {

        private labelViewKey: string;
        private labelViewFactory: templa.mvc.element.IElementViewFactory;

        // Constructor
        constructor() {
            super();
            this.labelViewKey = "label";
            this.labelViewFactory = new templa.mvc.element.DivElementViewFactory("<span key='"+this.labelViewKey+"'></span>");
        }

        getValue(): string {
            return "";
        }

        requestSubmit(value: string) {
            // push a new controller
            
            var labelController = new templa.samples.mvc.controller.label.LabelController(this.labelViewFactory, this.labelViewKey);
            labelController.setModel(new LabelModel(value));
            this._push(labelController);
        }
    }

    export class LabelModel extends templa.mvc.AbstractModel implements templa.samples.mvc.controller.label.ILabelModel {

        constructor(private _label: string) {
            super();
        }

        public getLabel(): string {
            return this._label;
        }
    }

    export function init(stackContainer: Element, inputContainer: Element) {
        var stackModel = new BasicStackModel();

        var stackViewFactory = new templa.mvc.element.DivElementViewFactory("<div key='stack'></div>");
        var stackController = new templa.mvc.element.composite.StackElementController(stackViewFactory);
        stackController.setModel(stackModel);
        stackController.init(stackContainer);
        stackController.start();

        var inputElementKey = "input_element";
        var inputButtonKey = "input_button";
        var inputViewFactory = new templa.mvc.element.DivElementViewFactory("<input key='"+inputElementKey+"'></input><br/><input type='button' key='"+inputButtonKey+"' value='Submit'></input>");
        var inputController = new templa.samples.mvc.controller.text_input.TextInputController(inputViewFactory, inputElementKey, inputButtonKey);
        inputController.setModel(stackModel);
        inputController.init(inputContainer);
        inputController.start();
    }

}