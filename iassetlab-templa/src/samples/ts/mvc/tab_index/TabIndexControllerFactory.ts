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

// Module
module templa.samples.mvc.tab_index {

    // Class
    export class TabIndexControllerFactory {
        // Constructor
        constructor() {

        }

        public create(): templa.mvc.IController {

            // TODO we ignore this for now, but we shouldn't
            
            var loadables: templa.loading.ILoadable[] = [];

            var tabBarContainerId = "tab_bar_container";
            var tabBarKey = "tab_bar";

            var helloWorldControllerId = "hello_world";
            var helloWorldController = templa.samples.mvc.hello_world.HelloWorldControllerFactory.create();

            var helloYouControllerId = "hello_you";
            var helloYouControllerFactory = new templa.samples.mvc.hello_you.HelloYouControllerFactory();
            var helloYouController = helloYouControllerFactory.create();

            var basicStackControllerId = "basic_stack";
            var basicStackControllerFactory = new templa.samples.mvc.basic_stack.BasicStackControllerFactory();
            var basicStackController = basicStackControllerFactory.create();

            var decoratedStackControllerId = "decorated_stack";
            var decoratedStackController = templa.samples.mvc.decorated_stack.DecoratedStackControllerFactory.create(loadables, ["#" + tabBarKey]);

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
            var loadingSwitcherViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory();
            var loadingSwitcherController = new templa.mvc.element.jquery.composite.AbstractCompositeJQueryController(
                loadingSwitcherViewFactory
            );
            loadingSwitcherController.setModel(loadingSwitcherModel);

            //return tabController; 
            return loadingSwitcherController;
        }
    }

}