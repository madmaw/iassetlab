///<reference path="mvc/AssetLabHomeControllerModel.ts"/>
///<reference path="mvc/AssetLabDecoratorModel.ts"/>
///<reference path="mvc/home/HomeController.ts"/>
///<reference path="mvc/about/AboutController.ts"/>
///<reference path="mvc/about/IAboutControllerModel.ts"/>
///<reference path="mvc/statusbar/StatusbarController.ts"/>
///<reference path="mvc/statusbar/IStatusbarControllerModel.ts"/>
///<reference path="mvc/filter/FilteringKeyedControllerModelProxy.ts"/>

///<reference path="../../../../iassetlab-templa/src/main/ts/loading/ILoadable.ts"/>
///<reference path="../../../../iassetlab-templa/src/main/ts/loading/CompositeLoadable.ts"/>
///<reference path="../../../../iassetlab-templa/src/main/ts/mvc/IController.ts"/>
///<reference path="../../../../iassetlab-templa/src/main/ts/mvc/composite/AbstractStackControllerModel.ts"/>
///<reference path="../../../../iassetlab-templa/src/main/ts/mvc/composite/MappedKeyedControllerModel.ts"/>
///<reference path="../../../../iassetlab-templa/src/main/ts/mvc/command/CommandControllerModelAdapter.ts"/>
///<reference path="../../../../iassetlab-templa/src/main/ts/mvc/loading/LoadableProxyingLoadingControllerModel.ts"/>
///<reference path="../../../../iassetlab-templa/src/main/ts/mvc/loading/SwitchOnLoadingCompositeControllerModel.ts"/>
///<reference path="../../../../iassetlab-templa/src/main/ts/mvc/element/ModeElementViewFactoryProxy.ts"/>
///<reference path="../../../../iassetlab-templa/src/main/ts/mvc/element/TemplateElementViewFactory.ts"/>
///<reference path="../../../../iassetlab-templa/src/main/ts/mvc/element/jquery/composite/AbstractCompositeJQueryController.ts"/>
///<reference path="../../../../iassetlab-templa/src/main/ts/mvc/element/jquery/composite/StackJQueryController.ts"/>
///<reference path="../../../../iassetlab-templa/src/main/ts/mvc/element/jquery/composite/KeyedJQueryController.ts"/>
///<reference path="../../../../iassetlab-templa/src/main/ts/mvc/element/jquery/loading/ProgressBarLoadingJQueryUIController.ts"/>
///<reference path="../../../../iassetlab-templa/src/main/ts/mvc/element/jquery/command/ToolbarCommandJQueryController.ts"/>
///<reference path="../../../../iassetlab-templa/src/main/ts/mvc/element/jquery/command/IdDelegatingCommandJQueryViewDescriptionFactory.ts"/>
///<reference path="../../../../iassetlab-templa/src/main/ts/mvc/element/jquery/command/TemplateCommandJQueryViewDescriptionFactory.ts"/>


// Module
module iassetlab.client.core {

    // Class
    export class AssetLabControllerFactory {

        private _modeFunction: () => string;
        private _decoratorFactory: (controllers:templa.mvc.IController[]) => templa.mvc.IController;

        private _stackViewFactory: templa.mvc.element.IElementViewFactory;
        private _emptyStarterViewFactory: templa.mvc.element.IElementViewFactory;
        private _emptyEnderViewFactory: templa.mvc.element.IElementViewFactory;

        private _aboutViewFactory: templa.mvc.element.IElementViewFactory;
        private _searchViewFactory: templa.mvc.element.IElementViewFactory;
        private _homeViewFactory: templa.mvc.element.IElementViewFactory;

        private _statusbarViewFactory: templa.mvc.element.IElementViewFactory;

        private _statusbarDecoratorViewFactory: templa.mvc.element.IElementViewFactory;
        private _statusbarDecoratorStatusbarClass = "statusbar_decorator_statusbar";
        private _statusbarDecoratorContentClass = "statusbar_decorator_content";

        private _toolbarViewFactory: templa.mvc.element.IElementViewFactory;
        private _toolbarButtonsBackClass = "toolbar_buttons_back";
        private _toolbarButtonsGeneralClass = "toolbar_buttons_general";

        private _toolbarCommandElementViewFactory: templa.mvc.element.jquery.command.IdDelegatingCommandJQueryViewDescriptionFactory;

        private _toolbarDecoratorClass = "toolbar_decorator";
        private _toolbarDecoratorContentClass = "toolbar_decorator_content";

        private _decoratorViewFactory: templa.mvc.element.IElementViewFactory;

        private _contextSummaryClass = "context_summary";
        private _contextMainClass = "context_main";
        private _contextViewFactory: templa.mvc.element.IElementViewFactory;

        constructor() {
        }

        public init(loadables: templa.loading.ILoadable[]) {
            this._modeFunction = function () {
                var result;
                // TODO factor in small landscape and portrait modes too
                if (window.innerWidth > window.innerHeight * 2) {
                    result = "wide";
                    //result = "narrow";
                } else {
                    result = "narrow";
                }
                return result;
            };

            var stackViewFactoryHorizontal = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/stack/stack_horizontal.html",
                loadables
            );
            var stackViewFactoryVertical = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/stack/stack_vertical.html",
                loadables
            );
            this._stackViewFactory = new templa.mvc.element.ModeElementViewFactoryProxy(
                this._modeFunction,
                <any>{
                    wide: stackViewFactoryHorizontal,
                    narrow: stackViewFactoryVertical
                }
            );
            this._emptyStarterViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/empty/empty_starter.html",
                loadables
            );
            this._emptyEnderViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/empty/empty_ender.html",
                loadables
            );
            this._aboutViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/about/about_main.html",
                loadables
            );
            this._homeViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/home/home_main.html",
                loadables
            );
            this._searchViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/search/search_main.html",
                loadables
            );

            var statusbarProperties = {
            };
            this._statusbarViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/statusbar/statusbar.html",
                loadables,
                statusbarProperties
            );

            var statusbarDecoratorProperties = {
                statusbar_decorator_statusbar_container_class: this._statusbarDecoratorStatusbarClass,
                statusbar_decorator_content_container_class: this._statusbarDecoratorContentClass
            };
            this._statusbarDecoratorViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/statusbar/statusbar_decorator.html",
                loadables,
                statusbarDecoratorProperties
            );

            var toolbarProperties = {
                toolbar_buttons_back_class: this._toolbarButtonsBackClass,
                toolbar_buttons_general_class: this._toolbarButtonsGeneralClass
            };
            this._toolbarViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/toolbar/toolbar.html",
                loadables,
                toolbarProperties
            );

            var toolbarNormalCommandElementViewFactory = templa.mvc.element.jquery.command.TemplateCommandJQueryViewDescriptionFactory.createFromURL(
                "src/main/handlebars/toolbar/toolbar_button_normal.html",
                loadables
            );
            var toolbarBackCommandElementViewFactory: templa.mvc.element.jquery.command.ICommandJQueryViewDescriptionFactory = templa.mvc.element.jquery.command.TemplateCommandJQueryViewDescriptionFactory.createFromURL(
                "src/main/handlebars/toolbar/toolbar_button_back.html",
                loadables
            );

            this._toolbarCommandElementViewFactory = new templa.mvc.element.jquery.command.IdDelegatingCommandJQueryViewDescriptionFactory(
                toolbarNormalCommandElementViewFactory,
                <any>{ back: toolbarBackCommandElementViewFactory }
            );

            var toolbarDecoratorParameters = { toolbar_decorator_class: this._toolbarDecoratorClass, toolbar_decorator_content_class: this._toolbarDecoratorContentClass };
            var decoratorViewFactoryHorizontal: templa.mvc.element.IElementViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/toolbar/toolbar_decorator_horizontal.html",
                loadables,
                toolbarDecoratorParameters

            );
            var decoratorViewFactoryVertical: templa.mvc.element.IElementViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/toolbar/toolbar_decorator_vertical.html",
                loadables,
                toolbarDecoratorParameters
            );
            this._decoratorViewFactory = new templa.mvc.element.ModeElementViewFactoryProxy(
                this._modeFunction,
                <any>{
                    wide: decoratorViewFactoryHorizontal,
                    narrow: decoratorViewFactoryVertical
                }
            );


            var contextProperties = {
                context_summary_container_class: this._contextSummaryClass,
                context_main_container_class: this._contextMainClass
            };
            this._contextViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/context/context.html",
                loadables,
                contextProperties
            );
        }

        public wrapInLoader(loadables: templa.loading.ILoadable[], controller: templa.mvc.IController): templa.mvc.IController {
            var loadingSwitcherViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/loading/loading_container.html"
            );
            var loadingSwitcherController = new templa.mvc.element.jquery.composite.AbstractCompositeJQueryController(
                loadingSwitcherViewFactory
            );

            var compositeLoadable = new templa.loading.CompositeLoadable(loadables);
            var loadingModel: templa.mvc.loading.LoadableProxyingLoadingControllerModel = new templa.mvc.loading.LoadableProxyingLoadingControllerModel(compositeLoadable);

            var loadingViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory();
            var loadingController = new templa.mvc.element.jquery.loading.ProgressBarLoadingJQueryUIController(
                loadingViewFactory
            );

            loadingController.setModel(loadingModel);


            var loadingSwitcherModel = new templa.mvc.loading.SwitchOnLoadingCompositeControllerModel(loadingController, controller, loadingModel);
            loadingSwitcherController.setModel(loadingSwitcherModel);

            return loadingSwitcherController;
        }

        public create(): templa.mvc.IController {


            var getControllersToDisplay = () => {
                var result:number = 1;
                if (this._modeFunction() == "wide") {
                    result = 2;
                }
                return result;
            };



            var stackController = new templa.mvc.element.jquery.composite.StackJQueryController(
                this._stackViewFactory,
                [{}]
            );

            var decoratorFactory = this.createToolbarDecoratorFactory(stackController);

            var stackModel = new iassetlab.client.core.mvc.AssetLabStackControllerModel(
                getControllersToDisplay(),
                () => {
                    var emptyController = new templa.mvc.element.AbstractElementController(this._emptyStarterViewFactory);
                    var emptyModel = new templa.mvc.AbstractModel();
                    emptyController.setModel(emptyModel);
                    return decoratorFactory([emptyController]);
                },
                () => {
                    var emptyController = new templa.mvc.element.AbstractElementController(this._emptyEnderViewFactory);
                    var emptyModel = new templa.mvc.AbstractModel();
                    emptyController.setModel(emptyModel);
                    return decoratorFactory([emptyController]);
                }
            );
            stackModel.padControllers = true;


            var homeOptionIdsToControllers: { string: templa.mvc.IController; } = <any>{};
            var homeModel = new iassetlab.client.core.mvc.AssetLabHomeControllerModel(
                stackModel,
                homeOptionIdsToControllers
            );
            var homeController = this.createHomeController(this._homeViewFactory, homeModel);

            stackModel._push(decoratorFactory([homeController]));
            stackController.setModel(stackModel);


            var aboutModel = new templa.mvc.AbstractModel();
            var aboutController = this.createAboutController(this._aboutViewFactory, aboutModel);
            var decoratedAboutController = this.createContextController(
                aboutController,
                this.createHomeController(this._homeViewFactory, homeModel),
                decoratorFactory
            );
            homeOptionIdsToControllers[iassetlab.client.core.mvc.home.HomeController._selectorAbout] = decoratedAboutController;

            var searchModel = new templa.mvc.AbstractModel();
            var searchController = new templa.mvc.element.AbstractElementController(this._searchViewFactory);
            searchController.setModel(searchModel);
            var decoratedSearchController = this.createContextController(
                searchController,
                this.createHomeController(this._homeViewFactory, homeModel),
                decoratorFactory
            );
            homeOptionIdsToControllers[iassetlab.client.core.mvc.home.HomeController._selectorSearch] = decoratedSearchController;


            // do this after, otherwise the stack order will be wrong
            homeModel.requestDisplayOption(iassetlab.client.core.mvc.home.HomeController._selectorAbout);

            // TODO actual statusbar model
            var statusbarModel = new templa.mvc.AbstractModel();
            var decoratedStackController = this.createStatusbarDecoratorFactory(<any>statusbarModel)([stackController]);

            window.onresize = function () {
                decoratedStackController.layout();
                // adjust the number of visible controllers
                stackModel._setControllersToDisplay( getControllersToDisplay() );
            };

            return decoratedStackController;
        }

        public createHomeController(homeViewFactory: templa.mvc.element.IElementViewFactory, homeModel:iassetlab.client.core.mvc.home.IHomeControllerModel) {
            var homeController = new iassetlab.client.core.mvc.home.HomeController(homeViewFactory);
            homeController.setModel(homeModel);
            return homeController;
        }

        public createAboutController(
            aboutViewFactory: templa.mvc.element.IElementViewFactory,
            aboutModel: iassetlab.client.core.mvc.about.IAboutControllerModel
        ) {
            var aboutController = new iassetlab.client.core.mvc.about.AboutController(aboutViewFactory);
            aboutController.setModel(aboutModel);
            return aboutController;
        }

        public createContextController(
            mainController: templa.mvc.IController,
            summaryController: templa.mvc.IController,
            decoratorFactory:(controllers:templa.mvc.IController[]) => templa.mvc.IController
        ) {

            // create 
            var controller = new templa.mvc.element.jquery.composite.KeyedJQueryController(
                this._contextViewFactory
            );

            var keysToControllers: { string: templa.mvc.IController; } = <any>{};
            keysToControllers["." + this._contextSummaryClass] = summaryController;
            keysToControllers["." + this._contextMainClass] = mainController;
            var model = new templa.mvc.composite.MappedKeyedControllerModel(keysToControllers);
            var modelProxy = new iassetlab.client.core.mvc.filter.FilteringKeyedControllerModelProxy(
                model,
                (controller: templa.mvc.IController) => {
                    var result;
                    if (controller == summaryController) {
                        result = this._modeFunction() == "narrow";
                    } else {
                        result = true;
                    }
                    return result;
                }
            );
            controller.setModel(modelProxy);

            // decorate
            var decoratedController = decoratorFactory([controller]);

            return decoratedController;
        }

        public createStatusbarDecoratorFactory(statusbarModel:iassetlab.client.core.mvc.statusbar.IStatusbarControllerModel) {

            return (controllers: templa.mvc.IController[]) => {
                var statusbarController = new iassetlab.client.core.mvc.statusbar.StatusbarController(
                    this._statusbarViewFactory
                );
                statusbarController.setModel(statusbarModel);

                var decoratorController = new templa.mvc.element.jquery.composite.KeyedJQueryController(
                    this._statusbarDecoratorViewFactory
                );
                decoratorController.setModel(
                    new iassetlab.client.core.mvc.AssetLabDecoratorModel(
                        statusbarController,
                        "." + this._statusbarDecoratorStatusbarClass,
                        controllers,
                        "." + this._statusbarDecoratorContentClass
                    )
                );
                return decoratorController;

            }
        }

        public createToolbarDecoratorFactory(sourceController:templa.mvc.IController) {
            // decorator

            return (controllers: templa.mvc.IController[]) => {
                var toolbarController = new templa.mvc.element.jquery.command.ToolbarCommandJQueryController(
                    this._toolbarViewFactory,
                    this._toolbarCommandElementViewFactory,
                    "." + this._toolbarButtonsBackClass,
                    "." + this._toolbarButtonsGeneralClass
                );
                toolbarController.setModel(new templa.mvc.command.CommandControllerModelAdapter(sourceController));

                var decoratorController = new templa.mvc.element.jquery.composite.KeyedJQueryController(
                    this._decoratorViewFactory
                );
                decoratorController.setModel(
                    new iassetlab.client.core.mvc.AssetLabDecoratorModel(
                        toolbarController,
                        "." + this._toolbarDecoratorClass,
                        controllers,
                        "." + this._toolbarDecoratorContentClass
                    )
                );
                return decoratorController;
            };
        }
    }

}
