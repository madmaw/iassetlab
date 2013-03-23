///<reference path="../../../../main/ts/mvc/composite/MappedKeyedControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/composite/KeyedJQueryController.ts"/>
///<reference path="DecoratedStackModel.ts"/>

// Module
module templa.samples.mvc.decorated_stack.DecoratedStackControllerFactory {

    // Class
    export function create(): templa.mvc.IController {
        // create the stack controller
        var stackViewFactory = new templa.mvc.element.HandlebarsElementViewFactory(
            "<div id='{{id}}' key='stack'></div>",
            "id"
        );
        var pushAddAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-stack-push-add", 2000);
        var pushRemoveAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-stack-push-remove", 2000);
        var popAddAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-stack-pop-add", 2000);
        var popRemoveAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-stack-pop-remove", 2000);
        var stackController = new templa.mvc.element.jquery.composite.StackJQueryController(
            stackViewFactory,
            popAddAnimationFactory,
            popRemoveAnimationFactory,
            pushAddAnimationFactory,
            pushRemoveAnimationFactory
        );
        var stackModel = new DecoratedStackModel(stackController);
        stackController.setModel(stackModel);

        // create the input controller
        var inputElementKey = "input_element";
        var inputButtonKey = "input_button";
        var inputViewFactory = new templa.mvc.element.HandlebarsElementViewFactory(
            "<div id='{{id}}'><input key='{{input_element}}'></input><br/><input type='button' key='{{input_button}}' value='Submit'></input></div>",
            "id",
            { input_element: inputElementKey, input_button: inputButtonKey }
        );
        var inputController = new templa.samples.mvc.controller.text_input.TextInputController(inputViewFactory, "[key='" + inputElementKey + "']", "[key='" + inputButtonKey + "']");
        inputController.setModel(stackModel);

        // create the containing controller
        var idInput = "decorated_input";
        var idStack = "decorated_stack";
        var controllers = {};
        controllers[idInput] = inputController;
        controllers[idStack] = stackController;
        var model = new templa.mvc.composite.MappedKeyedControllerModel(
            <{ string: templa.mvc.IController; }>controllers
        );

        var viewFactory = new templa.mvc.element.DivElementViewFactory(
            "<div id = '" + idInput + "' > </div><div id = '" + idStack + "' > </div>"
        );

        var controller = new templa.mvc.element.jquery.composite.KeyedJQueryController(
            viewFactory
        );
        controller.setModel(model);
        return controller;


    }

}
