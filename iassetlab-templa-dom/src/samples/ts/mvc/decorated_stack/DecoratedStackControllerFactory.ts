///<reference path="DecoratedStackModel.ts"/>

///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/> 
///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/> 

// Module  
module templa.dom.samples.mvc.decorated_stack.DecoratedStackControllerFactory { 

    // Class
    export function create(loadables: templa.loading.ILoadable[], toolbarDecoratorFactory: (controllers: templa.mvc.IController<templa.mvc.IModel>[]) => templa.mvc.IController<templa.mvc.IModel>): templa.mvc.IController<templa.mvc.IModel> {
        // TODO should probably replace this with a JQuery animation thing, that way it will be (more) cross-platform (but not hardware accelerated)
        // create the stack controller
        var stackViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div class='content_slider'></div>");
        var relativePushAddAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-push-add", 1000);
        var relativePushRemoveAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-push-remove", 1000);
        var relativePopAddAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-pop-add", 1000);
        var relativePopRemoveAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-pop-remove", 1000);

        var absolutePushAddAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-push-add", 1000);
        var absolutePushRemoveAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-push-remove", 1000);
        var absolutePopAddAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-pop-add", 1000);
        var absolutePopRemoveAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-pop-remove", 1000);

        var stackController = new templa.dom.mvc.jquery.composite.StackJQueryController<templa.mvc.composite.IStackControllerModel>(
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
        var labelViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
            "src/samples/handlebars/decorated_stack/label.html",
            loadables,
            { label_key: labelViewKey }
        );

        // create the input controller
        var inputElementKey = "input_element";
        var inputButtonKey = "input_button";
        var inputViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
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
