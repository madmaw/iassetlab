///<reference path="../hello_world/HelloWorldControllerFactory.ts"/>
///<reference path="../hello_you/HelloYouControllerFactory.ts"/>
///<reference path="../basic_stack/BasicStackControllerFactory.ts"/>
///<reference path="../decorated_stack/DecoratedStackControllerFactory.ts"/>
///<reference path="../controller/ToolbarDecoratorModel.ts"/>


///<reference path="../../../../../build/defs/jquery.d.ts"/> 
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/> 
///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/> 

// Module  
module templa.dom.samples.mvc.tab_index {

    // Class
    export class TabIndexControllerFactory {
        // Constructor
        constructor() {

        }

        public create(): templa.mvc.IController {

            var loadingSwitcherViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/samples/handlebars/tab_index/loading_container.html"
            );
            var loadingSwitcherController = new templa.dom.mvc.jquery.composite.AbstractCompositeJQueryController(
                loadingSwitcherViewFactory
            );

            var loadables: templa.loading.ILoadable[] = [];

            var tabBarContainerId = "tab_bar_container";
            var tabBarKey = ".tab_bar";

            // create toolbar decorator

            // TODO pass the decorator in as a parameter
            var decoratorToolbarContainerKey = "decorated_toolbar_container";
            var decoratorToolbarControllerKey = "decorated_toolbar";
            var decoratorBodyControllerKey = "decorated_body";
            var decoratorViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/samples/handlebars/decorated_stack/decorator.html",
                loadables,
                { toolbar_key: decoratorToolbarControllerKey, view_key: decoratorBodyControllerKey, toolbar_container_key: decoratorToolbarContainerKey }
                
            );
            //var localFixedHeightSelectors = ["." + decoratorToolbarContainerKey, "." + tabBarKey];
            // for the height
            //decoratorViewFactory = new templa.mvc.element.jquery.DimensionSettingElementViewProxyFactory(decoratorViewFactory, "#" + decoratorBodyControllerKey, null, localFixedHeightSelectors);
            // for the width
            //decoratorViewFactory = new templa.mvc.element.jquery.DimensionSettingElementViewProxyFactory(decoratorViewFactory, null, [], null);


            var toolbarBackViewKey = "toolbar_buttons_back";
            var toolbarGeneralViewKey = "toolbar_buttons_general";
            var toolbarViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/samples/handlebars/toolbar/toolbar.html",
                loadables,
                { toolbar_buttons_back_class: toolbarBackViewKey, toolbar_buttons_general_class: toolbarGeneralViewKey }
            );

            var toolbarNormalCommandElementViewFactory = templa.dom.mvc.jquery.command.TemplateCommandJQueryViewDescriptionFactory.createFromURL(
                "src/samples/handlebars/toolbar/button_normal.html",
                loadables
            );
            var toolbarBackCommandElementViewFactory = templa.dom.mvc.jquery.command.TemplateCommandJQueryViewDescriptionFactory.createFromURL(
                "src/samples/handlebars/toolbar/button_back.html",
                loadables
            );

            var toolbarCommandElementViewFactory = new templa.dom.mvc.jquery.command.IdDelegatingCommandJQueryViewDescriptionFactory(
                toolbarNormalCommandElementViewFactory,
                <any>{ back: toolbarBackCommandElementViewFactory }
            );
             
            var decoratorFactory = function(controllers: templa.mvc.IController<templa.mvc.IModel>[]):templa.mvc.IController<templa.mvc.IModel> {
                var toolbarController = new templa.dom.mvc.jquery.command.ToolbarCommandJQueryController(
                    toolbarViewFactory,
                    toolbarCommandElementViewFactory,
                    "." + toolbarBackViewKey,
                    "." + toolbarGeneralViewKey
                );
                toolbarController.setModel(new templa.mvc.command.CommandControllerModelAdapter(loadingSwitcherController));

                var decoratorController = new templa.dom.mvc.jquery.composite.KeyedJQueryController(
                    decoratorViewFactory
                );
                decoratorController.setModel(
                    new templa.dom.samples.mvc.controller.ToolbarDecoratorModel(
                        toolbarController,
                        "." + decoratorToolbarControllerKey,
                        controllers,
                        "." + decoratorBodyControllerKey
                    )
                );
                return decoratorController;
            };


            // create stuff


            var helloWorldControllerId = "hello_world";
            var helloWorldController: templa.mvc.IController<templa.mvc.IModel> = templa.dom.samples.mvc.hello_world.HelloWorldControllerFactory.create();
            helloWorldController = decoratorFactory([helloWorldController]);

            var helloYouControllerId = "hello_you";
            var helloYouControllerFactory = new templa.dom.samples.mvc.hello_you.HelloYouControllerFactory();
            var helloYouController: templa.mvc.IController<templa.mvc.IModel> = helloYouControllerFactory.create();
            helloYouController = decoratorFactory([helloYouController]);

            var basicStackControllerId = "basic_stack";
            var basicStackControllerFactory = new templa.dom.samples.mvc.basic_stack.BasicStackControllerFactory();
            var basicStackController: templa.mvc.IController<templa.mvc.IModel> = basicStackControllerFactory.create();
            basicStackController = decoratorFactory([basicStackController]);

            var decoratedStackControllerId = "decorated_stack";
            var decoratedStackController = templa.dom.samples.mvc.decorated_stack.DecoratedStackControllerFactory.create(loadables, decoratorFactory);

            var tabbedControllers = <{ string: templa.mvc.IController<templa.mvc.IModel>; }>{};
            tabbedControllers[helloWorldControllerId] = helloWorldController;
            tabbedControllers[helloYouControllerId] = helloYouController;
            tabbedControllers[basicStackControllerId] = basicStackController;
            tabbedControllers[decoratedStackControllerId] = decoratedStackController;

            var tabBarIdsToViewFactories = {};
            tabBarIdsToViewFactories[helloWorldControllerId] = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/samples/handlebars/tab_index/tab_button.html",
                loadables,
                { title: "Hello World" }
            );
            tabBarIdsToViewFactories[helloYouControllerId] = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/samples/handlebars/tab_index/tab_button.html",
                loadables,
                { title: "Hello You" }
            );
            tabBarIdsToViewFactories[basicStackControllerId] = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/samples/handlebars/tab_index/tab_button.html",
                loadables,
                { title: "Basic Stack" } 
            );
            tabBarIdsToViewFactories[decoratedStackControllerId] = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/samples/handlebars/tab_index/tab_button.html",
                loadables, 
                { title: "Decorated Stack" }
            );

            var tabBarViewDescriptionFactory = new templa.dom.mvc.jquery.tab.MappedTabBarTabJQueryViewDescriptionFactory(
                tabBarIdsToViewFactories,
                ".tab_bar_button",
                ".tab_bar_button_root"
            );
            var tabBarViewFactory = new templa.dom.mvc.jquery.BorrowedElementViewFactory(null);
            var tabBarController = new templa.dom.mvc.jquery.tab.TabBarJQueryController(
                tabBarViewFactory,
                tabBarViewDescriptionFactory,
                null,
                "selected"
            );

            var tabPaneKey = ".tab_pane";
            var tabControllers = <{ string: templa.mvc.IController<templa.mvc.IModel>; }>{};
            tabControllers[tabBarKey] = tabBarController;

            var tabModel = new templa.mvc.composite.MappedTabControllerModel( 
                helloWorldControllerId,
                tabbedControllers,
                tabPaneKey,
                tabControllers
            );


            var tabViewFactoryHorizontal = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/samples/handlebars/tab_index/tab_container_horizontal.html",
                loadables
            );
            var tabViewFactoryVertical = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/samples/handlebars/tab_index/tab_container_vertical.html",
                loadables
            );
            var tabViewFactory = new templa.dom.mvc.ModeElementViewFactoryProxy(
                function () {
                    var result;
                    if (window.innerWidth > window.innerHeight) {
                        result = "wide";
                    } else {
                        result = "narrow";
                    }
                    return result;
                },
                <any>{
                    wide: tabViewFactoryVertical,
                    narrow: tabViewFactoryHorizontal
                }
            );
            /*
            var tabViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory(
                "<div id = '" + tabBarKey + "' > </div><div id = '" + tabPaneKey + "' > </div>"
            );
            */
            var tabController = new templa.dom.mvc.jquery.composite.KeyedJQueryController(
                tabViewFactory
            );

            tabBarController.setModel(tabModel);
            tabController.setModel(tabModel);

            var loadingViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory();
            var loadingController = new templa.dom.mvc.jquery.loading.ProgressBarLoadingJQueryUIController(
                loadingViewFactory
            );

            var compositeLoadable = new templa.loading.CompositeLoadable(loadables);
            var loadingModel: templa.mvc.loading.LoadableProxyingLoadingControllerModel = new templa.mvc.loading.LoadableProxyingLoadingControllerModel(compositeLoadable);
            loadingController.setModel(loadingModel);

            var loadingSwitcherModel = new templa.mvc.loading.SwitchOnLoadingCompositeControllerModel(loadingController, tabController, loadingModel);
            loadingSwitcherController.setModel(loadingSwitcherModel);

            //return tabController; 
            return loadingSwitcherController;
        }
    }

}