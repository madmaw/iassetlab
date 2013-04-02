///<reference path="../../../../main/ts/mvc/composite/MappedKeyedControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/composite/KeyedJQueryController.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/HeightSettingElementViewProxyFactory.ts"/>
///<reference path="../../../../main/ts/mvc/element/DocumentFragmentElementViewFactory.ts"/>
///<reference path="../../../../main/ts/mvc/element/TemplateElementViewFactory.ts"/>
///<reference path="../../../../main/ts/loading/ILoadable.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/command/TemplateCommandJQueryViewDescriptionFactory.ts"/>
///<reference path="DecoratedStackModel.ts"/>

// Module
module templa.samples.mvc.decorated_stack.DecoratedStackControllerFactory {

    // Class
    export function create(loadables:templa.loading.ILoadable[], fixedHeightSelectors?:string[]): templa.mvc.IController {
        // create the stack controller
        var stackViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory();
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

        var labelViewKey = "label";
        var labelViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
            "src/samples/handlebars/decorated_stack/label.html",
            loadables,
            { label_key: labelViewKey }
        );

        var decoratorToolbarContainerKey = "decorated_toolbar_container";
        var decoratorToolbarControllerKey = "decorated_toolbar";
        var decoratorBodyControllerKey = "decorated_body";
        var decoratorViewFactory:templa.mvc.element.IElementViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
            "src/samples/handlebars/decorated_stack/decorator.html",
            loadables,
            { toolbar_key: decoratorToolbarControllerKey, view_key: decoratorBodyControllerKey, toolbar_container_key: decoratorToolbarContainerKey }
        );
        var localFixedHeightSelectors = ["#" + decoratorToolbarContainerKey];
        if (fixedHeightSelectors != null) {
            templa.util.Arrays.pushAll(localFixedHeightSelectors, fixedHeightSelectors);
        }
        decoratorViewFactory = new templa.mvc.element.jquery.HeightSettingElementViewProxyFactory(decoratorViewFactory, "#" + decoratorBodyControllerKey, localFixedHeightSelectors);


        var toolbarBackViewKey = "back";
        var toolbarGeneralViewKey = "general";
        var toolbarViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
            "src/samples/handlebars/decorated_stack/toolbar.html",
            loadables,
            { back_buttons: toolbarBackViewKey, general_buttons: toolbarGeneralViewKey }
        );

        var toolbarCommandElementViewFactory = templa.mvc.element.jquery.command.TemplateCommandJQueryViewDescriptionFactory.createFromURL(
            "src/samples/handlebars/decorated_stack/command.html",
            loadables
        );

        // create the input controller
        var inputElementKey = "input_element";
        var inputButtonKey = "input_button";
        var inputViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
            "src/samples/handlebars/decorated_stack/input.html",
            loadables,
            { input_element: inputElementKey, input_button: inputButtonKey }
        );

        var stackModel = new DecoratedStackModel(
            stackController,
            labelViewFactory,
            "[key='" + labelViewKey + "']",
            inputViewFactory,
            "[key='" + inputElementKey + "']",
             "[key='" + inputButtonKey + "']",
            decoratorViewFactory,
            decoratorBodyControllerKey,
            decoratorToolbarControllerKey,
            toolbarViewFactory,
            "[key='" + toolbarBackViewKey + "']",
            "[key='" + toolbarGeneralViewKey + "']",
            toolbarCommandElementViewFactory
        );
        stackModel.requestSubmit("Hello Decorated Stack!!");
        stackController.setModel(stackModel);

        return stackController;

    }

}
