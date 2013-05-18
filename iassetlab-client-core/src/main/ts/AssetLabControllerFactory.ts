///<reference path="mvc/AssetLabHomeControllerModel.ts"/>
///<reference path="mvc/AssetLabSearchControllerModel.ts"/>
///<reference path="mvc/AssetLabDecoratorModel.ts"/>
///<reference path="mvc/home/HomeController.ts"/>
///<reference path="mvc/search/SearchController.ts"/>
///<reference path="mvc/about/AboutController.ts"/>
///<reference path="mvc/about/IAboutControllerModel.ts"/>
///<reference path="mvc/statusbar/StatusbarController.ts"/>
///<reference path="mvc/statusbar/IStatusbarControllerModel.ts"/>
///<reference path="mvc/stack/BackForwardStackController.ts"/>
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
///<reference path="../../../../iassetlab-templa/src/main/ts/mvc/element/jquery/DimensionSettingElementViewProxyFactory.ts"/>
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

        public static controllerNameHome = "home";

        private _modeFunction: () => string;
        private _animationBundleFactory: () => templa.mvc.element.jquery.composite.IStackAnimationFactoryBundle[];
        private _decoratorFactory: (controllers:templa.mvc.IController[]) => templa.mvc.IController;

        private _stackViewFactory: templa.mvc.element.IElementViewFactory;
        private _emptyStarterViewFactory: templa.mvc.element.IElementViewFactory;
        private _emptyEnderViewFactory: templa.mvc.element.IElementViewFactory;

        private _aboutViewFactory: templa.mvc.element.IElementViewFactory;
        private _searchViewFactory: templa.mvc.element.IElementViewFactory;
        private _homeViewFactory: templa.mvc.element.IElementViewFactory;
        private _searchResultsViewFactory: templa.mvc.element.IElementViewFactory;

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

        private _visibleDecoratorViewFactory: templa.mvc.element.IElementViewFactory;
        private _invisibleDecoratorViewFactory: templa.mvc.element.IElementViewFactory;

        private _contextClass = "context";
        private _contextSummaryClass = "context_summary";
        private _contextMainClass = "context_main";
        private _contextViewFactory: templa.mvc.element.IElementViewFactory;

        private _relativeAnimationBundlesWide3: templa.mvc.element.jquery.composite.IStackAnimationFactoryBundle[];
        private _relativeAnimationBundleWide4: templa.mvc.element.jquery.composite.IStackAnimationFactoryBundle;
        private _relativeAnimationBundleNarrow: templa.mvc.element.jquery.composite.IStackAnimationFactoryBundle;

        private _absoluteAnimationBundlesWide3: templa.mvc.element.jquery.composite.IStackAnimationFactoryBundle[];
        private _absoluteAnimationBundlesNarrow: templa.mvc.element.jquery.composite.IStackAnimationFactoryBundle[];

        constructor() {
        }

        public init(loadables: templa.loading.ILoadable[]) {
            this._modeFunction = function () {
                var result;
                // TODO factor in small landscape and portrait modes too
                if (window.innerWidth > window.innerHeight) {
                    if (window.innerWidth >= 1000) {
                        result = "wide_4";
                        //result = "wide_3";
                    } else {
                        result = "wide_3";
                        //result = "narrow";
                    }
                } else {
                    result = "narrow";
                }
                return result;
            };
            this._animationBundleFactory = () => {
                var mode = this._modeFunction();
                var result = [];
                if (mode == "wide_3") {
                    templa.util.Arrays.pushAll(result, this._relativeAnimationBundlesWide3);
                    templa.util.Arrays.pushAll(result, this._absoluteAnimationBundlesWide3);
                } else if (mode == "wide_4") {
                    result.push(this._relativeAnimationBundleWide4);
                } else {
                    result.push(this._relativeAnimationBundleNarrow);
                    templa.util.Arrays.pushAll(result, this._absoluteAnimationBundlesNarrow);
                }
                return result;
            };
            

            var slideTime = 1000;

            var relativeWide3PushAnimationFactory: templa.animation.element.IElementAnimationFactory;
            var relativeWide3PushAnimationFactory2 = new templa.animation.element.CSSElementClassAnimationFactory(
                "animation-relative-wide-3-push-2",
                slideTime,
                function (phase: string, view: Element) {
                    if (phase == templa.animation.animationStateStarted) {
                        // stop the flicker as the animation ends and the view flicks back 
                        $(view).css("opacity", "0.3");
                    } else if (phase == templa.animation.animationStateFinished) {
                        $(view).css("opacity", "");
                    }
                }
            );
            var relativeWide3PushAnimationFactory3 = new templa.animation.element.CSSElementClassAnimationFactory(
                "animation-relative-wide-3-push-3",
                slideTime,
                function (phase: string, view: Element) {
                    if (phase == templa.animation.animationStateStarted) {
                        // stop the flicker as the animation ends and the view flicks back 
                        $(view).css("opacity", "1");
                    } else if (phase == templa.animation.animationStateFinished) {
                        $(view).css("opacity", "");
                    }
                }
            );
            var relativeWide3PopAnimationFactory: templa.animation.element.IElementAnimationFactory;
            var relativeWide3PopAnimationFactory2 = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-wide-3-pop-2", slideTime);
            var relativeWide3PopAnimationFactory3 = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-wide-3-pop-3", slideTime);

            var relativeWide4PushAnimationFactory: templa.animation.element.IElementAnimationFactory;
            var relativeWide4PopAnimationFactory: templa.animation.element.IElementAnimationFactory;

            var relativeNarrowPushAnimationFactory: templa.animation.element.IElementAnimationFactory;
            var relativeNarrowPopAnimationFactory: templa.animation.element.IElementAnimationFactory;

            relativeWide3PushAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory(
                "animation-relative-wide-3-push",
                slideTime,
                function (phase: string, view: Element) {
                    if (phase == templa.animation.animationStateStarted) {
                        // stop the flicker as the animation ends and the view flicks back 
                        $(view).css("margin-left", "-33%");
                    }
                }
            );
            relativeWide3PopAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-wide-3-pop", slideTime);

            relativeWide4PushAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-wide-4-push", slideTime);
            relativeWide4PopAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-wide-4-pop", slideTime);

            relativeNarrowPushAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-narrow-push", slideTime);
            relativeNarrowPopAnimationFactory = new templa.animation.element.CSSElementClassAnimationFactory("animation-relative-narrow-pop", slideTime);

            var absoluteNarrowPushAnimationFactory1 = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-narrow-push-1", slideTime);
            var absoluteNarrowPushAnimationFactory2 = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-narrow-push-2", slideTime);
            var absoluteNarrowPopAnimationFactory1 = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-narrow-pop-1", slideTime);
            var absoluteNarrowPopAnimationFactory2 = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-narrow-pop-2", slideTime);

            var absoluteWide3PushAnimationFactory1 = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-wide-3-push-1", slideTime);
            var absoluteWide3PushAnimationFactory2 = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-wide-3-push-2", slideTime);
            var absoluteWide3PushAnimationFactory3 = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-wide-3-push-3", slideTime);
            var absoluteWide3PushAnimationFactory4 = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-wide-3-push-4", slideTime);
            var absoluteWide3PopAnimationFactory1 = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-wide-3-pop-1", slideTime);
            var absoluteWide3PopAnimationFactory2 = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-wide-3-pop-2", slideTime);
            var absoluteWide3PopAnimationFactory3 = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-wide-3-pop-3", slideTime);
            var absoluteWide3PopAnimationFactory4 = new templa.animation.element.CSSElementClassAnimationFactory("animation-absolute-wide-3-pop-4", slideTime);

            this._relativeAnimationBundlesWide3 = [{
                popAnimationFactory: relativeWide3PopAnimationFactory,
                pushAnimationFactory: relativeWide3PushAnimationFactory,
                selector: ".toolbar_decorator_content_container:nth-of-type(2)"
            }, {
                pushAnimationFactory: relativeWide3PushAnimationFactory2,
                popAnimationFactory: relativeWide3PopAnimationFactory2,
                selector: ".toolbar_decorator_content_container:nth-of-type(4)"
            }, {
                pushAnimationFactory: relativeWide3PushAnimationFactory3,
                popAnimationFactory: relativeWide3PopAnimationFactory3,
                selector: ".toolbar_decorator_content_container:nth-of-type(6)"
            }];
            this._relativeAnimationBundleWide4 = {
                popAnimationFactory: relativeWide4PopAnimationFactory,
                pushAnimationFactory: relativeWide4PushAnimationFactory,
                selector: ".toolbar_decorator_content_container:nth-of-type(2)"
            };
            this._relativeAnimationBundleNarrow = {
                popAnimationFactory: relativeNarrowPopAnimationFactory,
                pushAnimationFactory: relativeNarrowPushAnimationFactory,
                selector: ".toolbar_decorator_content_container:nth-of-type(2)"
            };
            this._absoluteAnimationBundlesNarrow = [{
                popAnimationFactory: absoluteNarrowPopAnimationFactory1,
                pushAnimationFactory: absoluteNarrowPushAnimationFactory1,
                selector: ".toolbar_decorator_toolbar_container:nth-of-type(1)"
            },{
                popAnimationFactory: absoluteNarrowPopAnimationFactory2,
                pushAnimationFactory: absoluteNarrowPushAnimationFactory2,
                selector: ".toolbar_decorator_toolbar_container:nth-of-type(3)"
            }];
            this._absoluteAnimationBundlesWide3 = [{
                popAnimationFactory: absoluteWide3PopAnimationFactory1,
                pushAnimationFactory: absoluteWide3PushAnimationFactory1,
                selector: ".toolbar_decorator_toolbar_container:nth-of-type(1)"
            }, {
                popAnimationFactory: absoluteWide3PopAnimationFactory2,
                pushAnimationFactory: absoluteWide3PushAnimationFactory2,
                selector: ".toolbar_decorator_toolbar_container:nth-of-type(3)"
            }, {
                popAnimationFactory: absoluteWide3PopAnimationFactory3,
                pushAnimationFactory: absoluteWide3PushAnimationFactory3,
                selector: ".toolbar_decorator_toolbar_container:nth-of-type(5)"
            }, {
                popAnimationFactory: absoluteWide3PopAnimationFactory4,
                pushAnimationFactory: absoluteWide3PushAnimationFactory4,
                selector: ".toolbar_decorator_toolbar_container:nth-of-type(7)"
            }];

            var stackViewFactoryWide4 = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/stack/stack_wide_4.html",
                loadables
            );
            var stackViewFactoryWide3 = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/stack/stack_wide_3.html",
                loadables
            );
            var stackViewFactoryNarrow = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/stack/stack_narrow.html",
                loadables
            );
            this._stackViewFactory = new templa.mvc.element.ModeElementViewFactoryProxy(
                this._modeFunction,
                <any>{
                    wide_4: stackViewFactoryWide4,
                    wide_3: stackViewFactoryWide3,
                    narrow: stackViewFactoryNarrow
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
            this._searchResultsViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/search/search_results_main.html",
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
            var decoratorViewFactoryWide4: templa.mvc.element.IElementViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/toolbar/toolbar_decorator_wide_4.html",
                loadables,
                toolbarDecoratorParameters

            );
            var decoratorViewFactoryWide3: templa.mvc.element.IElementViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/toolbar/toolbar_decorator_wide_3.html",
                loadables,
                toolbarDecoratorParameters
            );
            var decoratorViewFactoryNarrow: templa.mvc.element.IElementViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/toolbar/toolbar_decorator_narrow.html",
                loadables,
                toolbarDecoratorParameters
            );
            this._visibleDecoratorViewFactory = new templa.mvc.element.jquery.DimensionSettingElementViewProxyFactory(
                new templa.mvc.element.ModeElementViewFactoryProxy(
                    this._modeFunction,
                    <any>{
                        wide_4: decoratorViewFactoryWide4,
                        wide_3: decoratorViewFactoryWide3,
                        narrow: decoratorViewFactoryNarrow
                    }
                ),
                "." + this._toolbarDecoratorContentClass,
                null,
                // TODO toolbar in the cases where it is visible
                ["."+this._statusbarDecoratorStatusbarClass, "#content_padding_measure"],
                null,
                "min-height",
                ["." + this._contextClass, ".content_home"]
            );

            var invisibleDecoratorParameters = { toolbar_decorator_class: this._toolbarDecoratorClass, toolbar_decorator_content_class: this._toolbarDecoratorContentClass, toolbar_decorator_content_container_extra: "toolbar_decorator_content_container_invisible" };
            this._invisibleDecoratorViewFactory = templa.mvc.element.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/toolbar/toolbar_decorator_wide_3.html",
                loadables,
                invisibleDecoratorParameters
            );


            var contextProperties = {
                context_container_class: this._contextClass,
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

            var e: HTMLElement;
            

            var getControllersToDisplay = () => {
                var result: number = 1;
                var mode = this._modeFunction();
                if (mode == "wide_4") {
                    result = 2;
                } else if (mode == "wide_3") {
                    result = 1;
                }
                return result;
            };

            var getPadding = () => {
                var mode = this._modeFunction();
                return mode != "narrow";
            }


            var stackController = new iassetlab.client.core.mvc.stack.BackForwardStackController(
                this._stackViewFactory,
                this._animationBundleFactory(),
                ".stack_wing_left",
                ".stack_wing_right"
            );

            var decoratorFactory = this.createToolbarDecoratorFactory(stackController);

            var stackModel = new iassetlab.client.core.mvc.AssetLabStackControllerModel(
                getControllersToDisplay(),
                () => {
                    var emptyController = new templa.mvc.element.AbstractElementController(this._emptyStarterViewFactory);
                    var emptyModel = new templa.mvc.AbstractModel();
                    emptyController.setModel(emptyModel);
                    return decoratorFactory([emptyController], true);
                },
                () => {
                    var emptyController = new templa.mvc.element.AbstractElementController(this._emptyEnderViewFactory);
                    var emptyModel = new templa.mvc.AbstractModel();
                    emptyController.setModel(emptyModel);
                    return decoratorFactory([emptyController], true);
                },
                getPadding()
            );

            var homeOptionIdsToControllers: { string: templa.mvc.IController; } = <any>{};
            var homeController = this.createHomeController(this._homeViewFactory, null);
            var decoratedHomeController = decoratorFactory([homeController]);
            var homeModel = new iassetlab.client.core.mvc.AssetLabHomeControllerModel(
                decoratedHomeController,
                stackModel,
                homeOptionIdsToControllers
            );
            homeController.setModel(homeModel);


            stackModel._push(decoratedHomeController, AssetLabControllerFactory.controllerNameHome);
            stackController.setModel(stackModel);


            var aboutModel = new templa.mvc.AbstractModel();
            var aboutController = this.createAboutController(this._aboutViewFactory, aboutModel);
            var decoratedAboutController = this.createContextController(
                aboutController,
                this.createHomeController(this._homeViewFactory, homeModel),
                decoratorFactory
            );
            homeOptionIdsToControllers[iassetlab.client.core.mvc.home.HomeController._selectorAbout] = decoratedAboutController;

            var searchResultsModel = new templa.mvc.AbstractModel();
            var searchResultsController = this.createSearchResultsController(this._searchResultsViewFactory, searchResultsModel);
            var decoratedSearchResultsController = this.createContextController(
                searchResultsController,
                this.createSearchResultsController(this._searchResultsViewFactory, searchResultsModel),
                decoratorFactory
            );

            var searchController = new iassetlab.client.core.mvc.search.SearchController(this._searchViewFactory);
            var decoratedSearchController = this.createContextController(
                searchController,
                this.createHomeController(this._homeViewFactory, homeModel),
                decoratorFactory
            );
            var searchModel = new iassetlab.client.core.mvc.AssetLabSearchControllerModel(
                stackModel,
                decoratedSearchController,
                decoratedSearchResultsController
            );
            searchController.setModel(searchModel);
            homeOptionIdsToControllers[iassetlab.client.core.mvc.home.HomeController._selectorSearch] = decoratedSearchController;


            // do this after, otherwise the stack order will be wrong
            //homeModel.requestDisplayOption(iassetlab.client.core.mvc.home.HomeController._selectorAbout);

            // TODO actual statusbar model
            var statusbarModel = new templa.mvc.AbstractModel();
            var decoratedStackController = this.createStatusbarDecoratorFactory(<any>statusbarModel)([stackController]);

            window.onresize = () => {
                decoratedStackController.layout();
                // adjust the number of visible controllers
                stackModel._setControllersToDisplay(getControllersToDisplay(), getPadding());
                // adjust the animation factory
                stackController.animationFactoryBundles = this._animationBundleFactory();
            };

            return decoratedStackController;
        }

        public createSearchResultsController(searchResultsViewFactory: templa.mvc.element.IElementViewFactory, searchResultsModel: templa.mvc.IModel) {
            var searchResultsController = new templa.mvc.element.AbstractElementController(searchResultsViewFactory);
            if (searchResultsModel != null) {
                searchResultsController.setModel(searchResultsModel);
            }
            return searchResultsController;
        }

        public createHomeController(homeViewFactory: templa.mvc.element.IElementViewFactory, homeModel:iassetlab.client.core.mvc.home.IHomeControllerModel) {
            var homeController = new iassetlab.client.core.mvc.home.HomeController(homeViewFactory);
            if (homeModel != null) {
                homeController.setModel(homeModel);
            }
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
                        result = this._modeFunction() == "narrow" && window.innerHeight > 640;
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

            return (controllers: templa.mvc.IController[], invisible?:bool) => {
                var toolbarController = new templa.mvc.element.jquery.command.ToolbarCommandJQueryController(
                    this._toolbarViewFactory,
                    this._toolbarCommandElementViewFactory,
                    "." + this._toolbarButtonsBackClass,
                    "." + this._toolbarButtonsGeneralClass
                );
                toolbarController.setModel(new templa.mvc.command.CommandControllerModelAdapter(sourceController));

                var viewFactory;
                if (invisible == true) {
                    viewFactory = this._invisibleDecoratorViewFactory;
                } else {
                    viewFactory = this._visibleDecoratorViewFactory;
                }

                var decoratorController = new templa.mvc.element.jquery.composite.KeyedJQueryController(
                    viewFactory
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
