///<reference path="../../../../main/ts/mvc/IController.ts"/>
///<reference path="../../../../main/ts/mvc/composite/MappedTabControllerModel.ts"/>
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

            var helloWorldControllerId = "hello_world";
            var helloWorldController = templa.samples.mvc.hello_world.HelloWorldControllerFactory.create();

            var helloYouControllerId = "hello_you";
            var helloYouControllerFactory = new templa.samples.mvc.hello_you.HelloYouControllerFactory();
            var helloYouController = helloYouControllerFactory.create();

            var basicStackControllerId = "basic_stack";
            var basicStackControllerFactory = new templa.samples.mvc.basic_stack.BasicStackControllerFactory();
            var basicStackController = basicStackControllerFactory.create();

            var decoratedStackControllerId = "decorated_stack";
            var decoratedStackController = templa.samples.mvc.decorated_stack.DecoratedStackControllerFactory.create();

            var tabbedControllers = {};
            tabbedControllers[helloWorldControllerId] = helloWorldController;
            tabbedControllers[helloYouControllerId] = helloYouController;
            tabbedControllers[basicStackControllerId] = basicStackController;
            tabbedControllers[decoratedStackControllerId] = decoratedStackController;

            var tabBarContainerId = "tab_bar_container";
            var tabBarIdsToViewFactories = {};
            tabBarIdsToViewFactories[helloWorldControllerId] = new templa.mvc.element.DocumentFragmentElementViewFactory("<div class='tab_bar_button tab_bar_button_root'>Hello World</div>");
            tabBarIdsToViewFactories[helloYouControllerId] = new templa.mvc.element.DocumentFragmentElementViewFactory("<div class='tab_bar_button tab_bar_button_root'>Hello You</div>");
            tabBarIdsToViewFactories[basicStackControllerId] = new templa.mvc.element.DocumentFragmentElementViewFactory("<div class='tab_bar_button tab_bar_button_root'>Basic Stack</div>");
            tabBarIdsToViewFactories[decoratedStackControllerId] = new templa.mvc.element.DocumentFragmentElementViewFactory("<div class='tab_bar_button tab_bar_button_root'>Decorated Stack</div>");

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
            var tabBarKey = "tab_bar";
            var tabControllers = {};
            tabControllers[tabBarKey] = tabBarController;

            var tabModel = new templa.mvc.composite.MappedTabControllerModel(
                helloWorldControllerId,
                <any>tabbedControllers,
                tabPaneKey,
                <any>tabControllers
            );


            var tabViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory(
                "<div id = '" + tabBarKey + "' > </div><div id = '" + tabPaneKey + "' > </div>"
            );
            var tabController = new templa.mvc.element.jquery.composite.KeyedJQueryController(
                tabViewFactory
            );

            tabBarController.setModel(tabModel);
            tabController.setModel(tabModel);

            return tabController;
        }
    }

}