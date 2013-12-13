///<reference path="mvc/AssetLabHomeControllerModel.ts"/>
///<reference path="mvc/AssetLabSearchControllerModel.ts"/>
///<reference path="mvc/AssetLabDecoratorModel.ts"/>
///<reference path="mvc/AssetLabSearchResultsControllerModel.ts"/>
///<reference path="mvc/AssetLabSearchResultTemplateSummaryModel.ts"/>
///<reference path="mvc/home/HomeController.ts"/>
///<reference path="mvc/search/SearchController.ts"/>
///<reference path="mvc/about/AboutController.ts"/>
///<reference path="mvc/about/IAboutControllerModel.ts"/>
///<reference path="mvc/statusbar/StatusbarController.ts"/>
///<reference path="mvc/statusbar/IStatusbarControllerModel.ts"/>
///<reference path="mvc/stack/BackForwardStackController.ts"/>
///<reference path="mvc/filter/FilteringKeyedControllerModelProxy.ts"/>
///<reference path="mvc/template/summary/TemplateSummaryController.ts"/>
///<reference path="service/json/JSONTemplateServiceFunctionFactory.ts"/>

///<reference path="../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="../../../build/defs/jquery.d.ts"/>

// Module
module iassetlab.client.core {

    // Class
    export class AssetLabControllerFactory {
         
        public static controllerNameHome = "home";

        private _modeFunction: () => string;
        private _animationBundleFactory: () => templa.dom.mvc.jquery.composite.IStackAnimationFactoryBundle[];
        private _decoratorFactory: (controllers: templa.mvc.IController[]) => templa.mvc.IController;

        private _stackViewFactory: templa.dom.mvc.IElementViewFactory;
        private _emptyStarterViewFactory: templa.dom.mvc.IElementViewFactory;
        private _emptyEnderViewFactory: templa.dom.mvc.IElementViewFactory;

        private _aboutViewFactory: templa.dom.mvc.IElementViewFactory;
        private _searchViewFactory: templa.dom.mvc.IElementViewFactory;
        private _homeViewFactory: templa.dom.mvc.IElementViewFactory;
        private _searchResultsViewFactory: templa.dom.mvc.IElementViewFactory;
        private _searchResultsItemContainerViewFactory: templa.dom.mvc.IElementViewFactory;
        private _searchResultsLoadingViewFactory: templa.dom.mvc.IElementViewFactory;
        private _searchResultsLoadingSwitcherViewFactory: templa.dom.mvc.IElementViewFactory;
        private _templateSummaryViewFactory: templa.dom.mvc.IElementViewFactory;

        private _statusbarViewFactory: templa.dom.mvc.IElementViewFactory;

        private _statusbarDecoratorViewFactory: templa.dom.mvc.IElementViewFactory;
        private _statusbarDecoratorStatusbarClass = "statusbar_decorator_statusbar";
        private _statusbarDecoratorContentClass = "statusbar_decorator_content";

        private _toolbarViewFactory: templa.dom.mvc.IElementViewFactory;
        private _toolbarButtonsBackClass = "toolbar_buttons_back";
        private _toolbarButtonsGeneralClass = "toolbar_buttons_general";

        private _toolbarCommandElementViewFactory: templa.dom.mvc.jquery.command.IdDelegatingCommandJQueryViewDescriptionFactory;

        private _toolbarDecoratorClass = "toolbar_decorator";
        private _toolbarDecoratorContentClass = "toolbar_decorator_content";

        private _visibleDecoratorViewFactory: templa.dom.mvc.IElementViewFactory;
        private _invisibleDecoratorViewFactory: templa.dom.mvc.IElementViewFactory;

        private _contextClass = "context";
        private _contextSummaryClass = "context_summary";
        private _contextMainClass = "context_main";
        private _contextViewFactory: templa.dom.mvc.IElementViewFactory;

        private _relativeAnimationBundlesWide3: templa.dom.mvc.jquery.composite.IStackAnimationFactoryBundle[];
        private _relativeAnimationBundlesWide4: templa.dom.mvc.jquery.composite.IStackAnimationFactoryBundle[];
        private _relativeAnimationBundleNarrow: templa.dom.mvc.jquery.composite.IStackAnimationFactoryBundle;

        private _absoluteAnimationBundlesWide3: templa.dom.mvc.jquery.composite.IStackAnimationFactoryBundle[];
        private _absoluteAnimationBundlesNarrow: templa.dom.mvc.jquery.composite.IStackAnimationFactoryBundle[];

        private _templateService: iassetlab.client.core.service.ITemplateService;

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
                    templa.util.Arrays.pushAll(result, this._relativeAnimationBundlesWide4);
                } else {
                    result.push(this._relativeAnimationBundleNarrow);
                    templa.util.Arrays.pushAll(result, this._absoluteAnimationBundlesNarrow);
                }
                return result;
            };
            

            var slideTime = 1000;

            var relativeWide3PushAnimationFactory: templa.dom.animation.IElementAnimationFactory;
            var relativeWide3PushAnimationFactory2 = new templa.dom.animation.CSSElementClassAnimationFactory(
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
            var relativeWide3PushAnimationFactory3 = new templa.dom.animation.CSSElementClassAnimationFactory(
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
            var relativeWide3PopAnimationFactory: templa.dom.animation.IElementAnimationFactory;
            var relativeWide3PopAnimationFactory2 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-3-pop-2", slideTime);
            var relativeWide3PopAnimationFactory3 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-3-pop-3", slideTime);

            var relativeNarrowPushAnimationFactory: templa.dom.animation.IElementAnimationFactory;
            var relativeNarrowPopAnimationFactory: templa.dom.animation.IElementAnimationFactory;

            relativeWide3PushAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory(
                "animation-relative-wide-3-push",
                slideTime,
                function (phase: string, view: Element) {
                    if (phase == templa.animation.animationStateStarted) {
                        // stop the flicker as the animation ends and the view flicks back 
                        $(view).css("margin-left", "-33%");
                    }
                }
            );
            relativeWide3PopAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-3-pop", slideTime);

            // TODO have safeguard cleanup functions as with wide-3 factories
            var relativeWide4PushAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-4-push", slideTime);
            var relativeWide4PushAnimationFactory2 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-4-push-2", slideTime);
            var relativeWide4PushAnimationFactory4 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-4-push-4", slideTime);
            var relativeWide4PopAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-4-pop", slideTime);
            var relativeWide4PopAnimationFactory2 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-4-pop-2", slideTime);
            var relativeWide4PopAnimationFactory4 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-wide-4-pop-4", slideTime);

            relativeNarrowPushAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-narrow-push", slideTime);
            relativeNarrowPopAnimationFactory = new templa.dom.animation.CSSElementClassAnimationFactory("animation-relative-narrow-pop", slideTime);

            var absoluteNarrowPushAnimationFactory1 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-narrow-push-1", slideTime);
            var absoluteNarrowPushAnimationFactory2 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-narrow-push-2", slideTime);
            var absoluteNarrowPopAnimationFactory1 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-narrow-pop-1", slideTime);
            var absoluteNarrowPopAnimationFactory2 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-narrow-pop-2", slideTime);

            var absoluteWide3PushAnimationFactory1 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-wide-3-push-1", slideTime);
            var absoluteWide3PushAnimationFactory2 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-wide-3-push-2", slideTime);
            var absoluteWide3PushAnimationFactory3 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-wide-3-push-3", slideTime);
            var absoluteWide3PushAnimationFactory4 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-wide-3-push-4", slideTime);
            var absoluteWide3PopAnimationFactory1 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-wide-3-pop-1", slideTime);
            var absoluteWide3PopAnimationFactory2 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-wide-3-pop-2", slideTime);
            var absoluteWide3PopAnimationFactory3 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-wide-3-pop-3", slideTime);
            var absoluteWide3PopAnimationFactory4 = new templa.dom.animation.CSSElementClassAnimationFactory("animation-absolute-wide-3-pop-4", slideTime);

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
            this._relativeAnimationBundlesWide4 = [{
                popAnimationFactory: relativeWide4PopAnimationFactory,
                pushAnimationFactory: relativeWide4PushAnimationFactory,
                selector: ".toolbar_decorator_content_container:nth-of-type(2)"
            }, {
                popAnimationFactory: relativeWide4PopAnimationFactory2,
                pushAnimationFactory: relativeWide4PushAnimationFactory2,
                selector: ".toolbar_decorator_content_container:nth-of-type(4)"
            }, {
                popAnimationFactory: relativeWide4PopAnimationFactory4,
                pushAnimationFactory: relativeWide4PushAnimationFactory4,
                selector: ".toolbar_decorator_content_container:nth-of-type(8)"
            }];
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

            var stackViewFactoryWide4 = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/stack/stack_wide_4.html",
                loadables
            );
            var stackViewFactoryWide3 = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/stack/stack_wide_3.html",
                loadables
            );
            var stackViewFactoryNarrow = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/stack/stack_narrow.html",
                loadables
            );
            this._stackViewFactory = new templa.dom.mvc.ModeElementViewFactoryProxy(
                this._modeFunction,
                <any>{
                    wide_4: stackViewFactoryWide4,
                    wide_3: stackViewFactoryWide3,
                    narrow: stackViewFactoryNarrow
                }
            );
            this._emptyStarterViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/empty/empty_starter.html",
                loadables
            );
            this._emptyEnderViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/empty/empty_ender.html",
                loadables
            );
            this._aboutViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/about/about_main.html",
                loadables
            );
            this._homeViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/home/home_main.html",
                loadables
            );
            this._searchViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/search/search_main.html",
                loadables
            );
            this._searchResultsViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/search/search_results_main.html",
                loadables
            );
            this._searchResultsItemContainerViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/search/search_results_item_container_main.html",
                loadables
            );
            this._searchResultsLoadingViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/search/search_results_loading_main.html",
                loadables
            );
            this._searchResultsLoadingSwitcherViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/search/search_results_loading_switcher_main.html",
                loadables
            );
            this._templateSummaryViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/template/template_summary.html",
                loadables
            );

            var statusbarProperties = {
            };
            this._statusbarViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/statusbar/statusbar.html",
                loadables,
                statusbarProperties
            );

            var statusbarDecoratorProperties = {
                statusbar_decorator_statusbar_container_class: this._statusbarDecoratorStatusbarClass,
                statusbar_decorator_content_container_class: this._statusbarDecoratorContentClass
            };
            this._statusbarDecoratorViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/statusbar/statusbar_decorator.html",
                loadables,
                statusbarDecoratorProperties
            );

            var toolbarProperties = {
                toolbar_buttons_back_class: this._toolbarButtonsBackClass,
                toolbar_buttons_general_class: this._toolbarButtonsGeneralClass
            };
            this._toolbarViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/toolbar/toolbar.html",
                loadables,
                toolbarProperties
            );

            var toolbarNormalCommandElementViewFactory = templa.dom.mvc.jquery.command.TemplateCommandJQueryViewDescriptionFactory.createFromURL(
                "src/main/handlebars/toolbar/toolbar_button_normal.html",
                loadables
            );
            var toolbarBackCommandElementViewFactory: templa.dom.mvc.jquery.command.ICommandJQueryViewDescriptionFactory = templa.dom.mvc.jquery.command.TemplateCommandJQueryViewDescriptionFactory.createFromURL(
                "src/main/handlebars/toolbar/toolbar_button_back.html",
                loadables
            );

            this._toolbarCommandElementViewFactory = new templa.dom.mvc.jquery.command.IdDelegatingCommandJQueryViewDescriptionFactory(
                toolbarNormalCommandElementViewFactory,
                <any>{ back: toolbarBackCommandElementViewFactory }
            );

            var toolbarDecoratorParameters = { toolbar_decorator_class: this._toolbarDecoratorClass, toolbar_decorator_content_class: this._toolbarDecoratorContentClass };
            var decoratorViewFactoryWide4: templa.dom.mvc.IElementViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/toolbar/toolbar_decorator_wide_4.html",
                loadables,
                toolbarDecoratorParameters

            );
            var decoratorViewFactoryWide3: templa.dom.mvc.IElementViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/toolbar/toolbar_decorator_wide_3.html",
                loadables,
                toolbarDecoratorParameters
            );
            var decoratorViewFactoryNarrow: templa.dom.mvc.IElementViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/toolbar/toolbar_decorator_narrow.html",
                loadables,
                toolbarDecoratorParameters
            );
            this._visibleDecoratorViewFactory = new templa.dom.mvc.jquery.DimensionSettingElementViewProxyFactory(
                new templa.dom.mvc.ModeElementViewFactoryProxy(
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
            this._invisibleDecoratorViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/toolbar/toolbar_decorator_wide_3.html",
                loadables,
                invisibleDecoratorParameters
            );


            var contextProperties = {
                context_container_class: this._contextClass,
                context_summary_container_class: this._contextSummaryClass,
                context_main_container_class: this._contextMainClass
            };
            this._contextViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/context/context.html",
                loadables,
                contextProperties
            );

            var jsonTemplateServiceFunctionFactory = new iassetlab.client.core.service.json.JSONTemplateServiceFunctionFactory();
            var jsonTemplateServiceFunctionSearch = jsonTemplateServiceFunctionFactory.createSearch();

            this._templateService = {
                search: jsonTemplateServiceFunctionSearch
            };
        }

        public wrapInLoader(loadables: templa.loading.ILoadable[], controller: templa.mvc.IController): templa.mvc.IController {
            var loadingSwitcherViewFactory = templa.dom.mvc.TemplateElementViewFactory.createFromURL(
                "src/main/handlebars/loading/loading_container.html"
            );
            var loadingSwitcherController = new templa.dom.mvc.jquery.composite.AbstractCompositeJQueryController<templa.mvc.composite.ICompositeControllerModel>(
                loadingSwitcherViewFactory
            );

            var compositeLoadable = new templa.loading.CompositeLoadable(loadables);
            var loadingModel: templa.mvc.loading.LoadableProxyingLoadingControllerModel = new templa.mvc.loading.LoadableProxyingLoadingControllerModel(compositeLoadable);

            var loadingViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory();
            var loadingController = new templa.dom.mvc.jquery.loading.ProgressBarLoadingJQueryUIController<templa.mvc.loading.ILoadingControllerModel>(
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
                    var emptyController = new templa.dom.mvc.AbstractElementController<templa.mvc.AbstractModel>(this._emptyStarterViewFactory);
                    var emptyModel = new templa.mvc.AbstractModel();
                    emptyController.setModel(emptyModel);
                    return decoratorFactory([emptyController], true);
                },
                () => {
                    var emptyController = new templa.dom.mvc.AbstractElementController<templa.mvc.AbstractModel>(this._emptyEnderViewFactory);
                    var emptyModel = new templa.mvc.AbstractModel();
                    emptyController.setModel(emptyModel);
                    return decoratorFactory([emptyController], true);
                },
                getPadding()
            );

            var homeOptionIdsToControllers: { [_:string]: templa.mvc.IController; } = {};
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

            var searchResultControllerFactory = (searchResult: iassetlab.client.core.service.ITemplateSearchResult) => {
                // create the controller for this 
                var searchResultModel = new iassetlab.client.core.mvc.AssetLabSearchResultTemplateSummaryModel(searchResult);
                var searchResultController = new iassetlab.client.core.mvc.template.summary.TemplateSummaryController(this._templateSummaryViewFactory);
                searchResultController.setModel(searchResultModel);
                return searchResultController;
            };

            var searchResultsModel = new iassetlab.client.core.mvc.AssetLabSearchResultsControllerModel(
                20,
                this._templateService,
                searchResultControllerFactory
            );
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
                decoratedSearchResultsController,
                searchResultsModel
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
                stackController.setAnimationFactoryBundles(this._animationBundleFactory());
            };

            return decoratedStackController;
        }

        public createSearchResultsController(searchResultsViewFactory: templa.dom.mvc.IElementViewFactory, searchResultsModel: iassetlab.client.core.mvc.AssetLabSearchResultsControllerModel): templa.mvc.IController {
            var searchResultsController = new templa.dom.mvc.jquery.list.AbstractListJQueryController<iassetlab.client.core.mvc.AssetLabSearchResultsControllerModel>(
                searchResultsViewFactory,
                this._searchResultsItemContainerViewFactory
            );
            //return searchResultsController;

            searchResultsController.setModel(searchResultsModel);

            // TODO do not use progress bar, have a spinning circle or something?
            var loadingController = new templa.dom.mvc.AbstractElementController<templa.mvc.AbstractModel>(
                this._searchResultsLoadingViewFactory
            );
            loadingController.setModel(searchResultsModel);

            var loadingSwitcherController = new templa.dom.mvc.jquery.composite.AbstractCompositeJQueryController<templa.mvc.loading.SwitchOnLoadingCompositeControllerModel>(
                this._searchResultsLoadingSwitcherViewFactory
            );
            var loadingSwitcherModel = new templa.mvc.loading.SwitchOnLoadingCompositeControllerModel(loadingController, searchResultsController, searchResultsModel);
            loadingSwitcherController.setModel(loadingSwitcherModel);

            return loadingSwitcherController;
        }

        public createHomeController(homeViewFactory: templa.dom.mvc.IElementViewFactory, homeModel:iassetlab.client.core.mvc.home.IHomeControllerModel) {
            var homeController = new iassetlab.client.core.mvc.home.HomeController(homeViewFactory);
            if (homeModel != null) {
                homeController.setModel(homeModel);
            }
            return homeController;
        }

        public createAboutController(
            aboutViewFactory: templa.dom.mvc.IElementViewFactory,
            aboutModel: iassetlab.client.core.mvc.about.IAboutControllerModel
        ) {
            var aboutController = new iassetlab.client.core.mvc.about.AboutController(aboutViewFactory);
            aboutController.setModel(aboutModel);
            return aboutController;
        }

        public createContextController(
            mainController: templa.mvc.IController,
            summaryController: templa.mvc.IController,
            decoratorFactory: (controllers: templa.mvc.IController[]) => templa.mvc.IController
        ) {

            // create 
            var controller = new templa.dom.mvc.jquery.composite.KeyedJQueryController<iassetlab.client.core.mvc.filter.FilteringKeyedControllerModelProxy>(
                this._contextViewFactory
            );

            var keysToControllers: { [_:string]: templa.mvc.IController; } = {};
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

                var decoratorController = new templa.dom.mvc.jquery.composite.KeyedJQueryController<iassetlab.client.core.mvc.AssetLabDecoratorModel>(
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

        public createToolbarDecoratorFactory(sourceController: templa.mvc.IController) {
            // decorator

            return (controllers: templa.mvc.IController[], invisible?:boolean) => {
                var toolbarController = new templa.dom.mvc.jquery.command.ToolbarCommandJQueryController<templa.mvc.command.CommandControllerModelAdapter>(
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

                var decoratorController = new templa.dom.mvc.jquery.composite.KeyedJQueryController<iassetlab.client.core.mvc.AssetLabDecoratorModel>(
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
