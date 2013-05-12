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
        // TODO should probably replace this with a JQuery animation thing, that way it will be (more) cross-platform (but not hardware accelerated)
        // create the stack controller
        var stackViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory("<div class='content_slider'></div>");
        var relativePushAddAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-push-add", 1000);
        var relativePushRemoveAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-push-remove", 1000);
        var relativePopAddAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-pop-add", 1000);
        var relativePopRemoveAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-pop-remove", 1000);

        var absolutePushAddAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-push-add", 1000);
        var absolutePushRemoveAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-push-remove", 1000);
        var absolutePopAddAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-pop-add", 1000);
        var absolutePopRemoveAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-pop-remove", 1000);

        var stackController = new templa.mvc.element.jquery.composite.StackJQueryController(
            stackViewFactory,
            [{
               popAnimationFactory: relativePopAddAnimationFactory,
               pushAnimationFactory: relativePushRemoveAnimationFactory,
               selector: ".content_pane:nth-of-type(2)"
           }, {
               popAnimationFactory: absolutePopAddAnimationFactory,
               pushAnimationFactory: absolutePushRemoveAnimationFactory,
               selector: ".decorated_toolbar_container:nth-of-type(1)"
           }, {
               popAnimationFactory: absolutePopRemoveAnimationFactory,
               pushAnimationFactory: absolutePushAddAnimationFactory,
               selector: ".decorated_toolbar_container:nth-of-type(3)"
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
