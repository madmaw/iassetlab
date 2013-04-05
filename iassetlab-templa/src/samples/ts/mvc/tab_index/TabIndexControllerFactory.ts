///<reference path="../../../../main/ts/loading/CompositeLoadable.ts"/>
///<reference path="../../../../main/ts/mvc/IController.ts"/>
///<reference path="../../../../main/ts/mvc/composite/MappedTabControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/loading/LoadableProxyingLoadingControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/loading/SwitchOnLoadingCompositeControllerModel.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/loading/ProgressBarLoadingJQueryUIController.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/tab/TabBarJQueryController.ts"/>
///<reference path="../../../../main/ts/mvc/element/jquery/tab/MappedTabBarTabJQueryViewDescriptionFactory.ts"/>
///<reference path="../hello_world/HelloWorldControllerFactory.ts"/>
///<reference path="../hello_you/HelloYouControllerFactory.ts"/>
///<reference path="../basic_stack/BasicStackControllerFactory.ts"/>
///<reference path="../decorated_stack/DecoratedStackControllerFactory.ts"/>
///<reference path="../controller/ToolbarDecoratorModel.ts"/>

// Module
module templa.samples.mvc.tab_index {

    // Class
    export class TabIndexControllerFactory {
        // Constructor
        constructor() {

        }

        public create(): templa.mvc.IController {

            var loadingSwitcherViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory();
            var loadingSwitcherController = new templa.mvc.element.jquery.composite.AbstractCompositeJQueryController(
                loadingSwitcherViewFactory
            );

            var loadables: templa.loading.ILoadable[] = [];

            var tabBarContainerId = "tab_bar_container";
            var tabBarKey = "tab_bar";

            // create toolbar decorator

            // TODO pass the decorator in as a parameter
            var decoratorToolbarContainerKey = "decorated_toolbar_container";
            var decoratorToolbarControllerKey = "decorated_toolbar";
            var decoratorBodyControllerKey = "decorated_body";
            var decoratorViewFactory: templa.mvc.element.IElementViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/samples/handlebars/decorated_stack/decorator.html",
                loadables,
                { toolbar_key: decoratorToolbarControllerKey, view_key: decoratorBodyControllerKey, toolbar_container_key: decoratorToolbarContainerKey },
                "content_pane"
            );
            var localFixedHeightSelectors = ["#" + decoratorToolbarContainerKey, "#" + tabBarKey];
            // for the height
            decoratorViewFactory = new templa.mvc.element.jquery.DimensionSettingElementViewProxyFactory(decoratorViewFactory, "#" + decoratorBodyControllerKey, null, localFixedHeightSelectors);
            // for the width
            decoratorViewFactory = new templa.mvc.element.jquery.DimensionSettingElementViewProxyFactory(decoratorViewFactory, null, [], null);


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

            var decoratorFactory = function(controllers: templa.mvc.IController[]):templa.mvc.IController {
                var toolbarController = new templa.mvc.element.jquery.command.ToolbarCommandJQueryController(
                    toolbarViewFactory,
                    toolbarCommandElementViewFactory,
                    "[key='" + toolbarBackViewKey + "']",
                    "[key='" + toolbarGeneralViewKey + "']"
                );
                toolbarController.setModel(new templa.mvc.command.CommandControllerModelAdapter(loadingSwitcherController));

                var decoratorController = new templa.mvc.element.jquery.composite.KeyedJQueryController(
                    decoratorViewFactory
                );
                decoratorController.setModel(
                    new templa.samples.mvc.controller.ToolbarDecoratorModel(
                        toolbarController,
                        decoratorToolbarControllerKey,
                        controllers,
                        decoratorBodyControllerKey
                    )
                );
                return decoratorController;
            };


            // create stuff


            var helloWorldControllerId = "hello_world";
            var helloWorldController: templa.mvc.IController = templa.samples.mvc.hello_world.HelloWorldControllerFactory.create();
            helloWorldController = decoratorFactory([helloWorldController]);

            var helloYouControllerId = "hello_you";
            var helloYouControllerFactory = new templa.samples.mvc.hello_you.HelloYouControllerFactory();
            var helloYouController: templa.mvc.IController = helloYouControllerFactory.create();
            helloYouController = decoratorFactory([helloYouController]);

            var basicStackControllerId = "basic_stack";
            var basicStackControllerFactory = new templa.samples.mvc.basic_stack.BasicStackControllerFactory();
            var basicStackController:templa.mvc.IController = basicStackControllerFactory.create();
            basicStackController = decoratorFactory([basicStackController]);

            var decoratedStackControllerId = "decorated_stack";
            var decoratedStackController = templa.samples.mvc.decorated_stack.DecoratedStackControllerFactory.create(loadables, decoratorFactory);

            var tabbedControllers = {};
            tabbedControllers[helloWorldControllerId] = helloWorldController;
            tabbedControllers[helloYouControllerId] = helloYouController;
            tabbedControllers[basicStackControllerId] = basicStackController;
            tabbedControllers[decoratedStackControllerId] = decoratedStackController;

            var tabBarIdsToViewFactories = {};
            tabBarIdsToViewFactories[helloWorldControllerId] = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/samples/handlebars/tab_index/tab_button.html",
                loadables,
                { title: "Hello World" }
            );
            tabBarIdsToViewFactories[helloYouControllerId] = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/samples/handlebars/tab_index/tab_button.html",
                loadables,
                { title: "Hello You" }
            );
            tabBarIdsToViewFactories[basicStackControllerId] = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/samples/handlebars/tab_index/tab_button.html",
                loadables,
                { title: "Basic Stack" }
            );
            tabBarIdsToViewFactories[decoratedStackControllerId] = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/samples/handlebars/tab_index/tab_button.html",
                loadables,
                { title: "Decorated Stack" }
            );

            var tabBarViewDescriptionFactory = new templa.mvc.element.jquery.tab.MappedTabBarTabJQueryViewDescriptionFactory(
                <any>tabBarIdsToViewFactories,
                ".tab_bar_button",
                ".tab_bar_button_root"
            );
            var tabBarViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory(
                "<div id = '" + tabBarContainerId + "' > </div>"
            );
            var tabBarController = new templa.mvc.element.jquery.tab.TabBarJQueryController(
                tabBarViewFactory,
                tabBarViewDescriptionFactory,
                "#" + tabBarContainerId,
                "selected"
            );

            var tabPaneKey = "tab_pane";
            var tabControllers = {};
            tabControllers[tabBarKey] = tabBarController;

            var tabModel = new templa.mvc.composite.MappedTabControllerModel(
                helloWorldControllerId,
                <any>tabbedControllers,
                tabPaneKey,
                <any>tabControllers
            );


            var tabViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/samples/handlebars/tab_index/tab_container.html",
                loadables
            );
            /*
            var tabViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory(
                "<div id = '" + tabBarKey + "' > </div><div id = '" + tabPaneKey + "' > </div>"
            );
            */
            var tabController = new templa.mvc.element.jquery.composite.KeyedJQueryController(
                tabViewFactory
            );

            tabBarController.setModel(tabModel);
            tabController.setModel(tabModel);

            var loadingViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory();
            var loadingController = new templa.mvc.element.jquery.loading.ProgressBarLoadingJQueryUIController(
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