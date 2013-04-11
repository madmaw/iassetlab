///<reference path="../../../../main/ts/mvc/composite/MappedKeyedControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/composite/KeyedJQueryController.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/DimensionSettingElementViewProxyFactory.ts"/>
///<reference path="../../../../main/ts/mvc/element/DocumentFragmentElementViewFactory.ts"/>
///<reference path="../../../../main/ts/mvc/element/TemplateElementViewFactory.ts"/>
///<reference path="../../../../main/ts/loading/ILoadable.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/command/TemplateCommandJQueryViewDescriptionFactory.ts"/>
///<reference path="DecoratedStackModel.ts"/>

// Module
module templa.samples.mvc.decorated_stack.DecoratedStackControllerFactory {

    // Class
    export function create(loadables: templa.loading.ILoadable[], toolbarDecoratorFactory: (controllers: templa.mvc.IController[]) => templa.mvc.IController): templa.mvc.IController {
        // create the stack controller
        var stackViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory("<div class='content_slider'></div>");
        var relativePushAddAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-push-add", 2000);
        var relativePushRemoveAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-push-remove", 2000);
        var relativePopAddAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-pop-add", 2000);
        var relativePopRemoveAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-pop-remove", 2000);

        var absolutePushAddAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-push-add", 2000);
        var absolutePushRemoveAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-push-remove", 2000);
        var absolutePopAddAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-pop-add", 2000);
        var absolutePopRemoveAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-pop-remove", 2000);

        var stackController = new templa.mvc.element.jquery.composite.StackJQueryController(
            stackViewFactory,
            [{
                popAddAnimationFactory: relativePopAddAnimationFactory,
                popRemoveAnimationFactory: relativePopRemoveAnimationFactory,
                pushAddAnimationFactory: relativePushAddAnimationFactory,
                pushRemoveAnimationFactory: relativePushRemoveAnimationFactory,
                selector: ".content_pane"
            }, {
                popAddAnimationFactory: absolutePopAddAnimationFactory,
                popRemoveAnimationFactory: absolutePopRemoveAnimationFactory,
                pushAddAnimationFactory: absolutePushAddAnimationFactory,
                pushRemoveAnimationFactory: absolutePushRemoveAnimationFactory,
                selector: ".decorated_toolbar_container "
            }]
        );

        var labelViewKey = "label";
        var labelViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
            "src/samples/handlebars/decorated_stack/label.html",
            loadables,
            { label_key: labelViewKey }
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
            toolbarDecoratorFactory
            /*,
            decoratorViewFactory,
            decoratorBodyControllerKey,
            decoratorToolbarControllerKey,
            toolbarViewFactory,
            "[key='" + toolbarBackViewKey + "']",
            "[key='" + toolbarGeneralViewKey + "']",
            toolbarCommandElementViewFactory*/
        );
        stackModel.requestSubmit("Hello Decorated Stack!!");
        stackController.setModel(stackModel);

        return stackController;

    }

}
