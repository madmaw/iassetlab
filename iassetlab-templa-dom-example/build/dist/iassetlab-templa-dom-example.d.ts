/// <reference path="../defs/iassetlab-templa.d.ts" />
/// <reference path="../defs/iassetlab-templa-dom.d.ts" />
/// <reference path="../defs/jquery.d.ts" />
/// <reference path="../../src/main/d.ts/hammerjs.d.ts" />
declare module iassetlab.client.core.mvc.stack {
    interface IBackForwardStackControllerModel extends templa.mvc.composite.IStackControllerModel {
        canPush(): boolean;
        requestPush(): void;
    }
}
declare module iassetlab.client.core.mvc {
    class AssetLabStackControllerModel extends templa.mvc.composite.AbstractStackControllerModel implements mvc.stack.IBackForwardStackControllerModel {
        private _prefixControllerFactory;
        private _postfixControllerFactory;
        private _padControllers;
        private _prefixedControllerEntries;
        private _postfixedControllerEntries;
        private _poppedControllerEntries;
        constructor(controllersToDisplay: number, _prefixControllerFactory: () => templa.mvc.IController, _postfixControllerFactory: () => templa.mvc.IController, _padControllers: boolean);
        public canPush(): boolean;
        public requestPush(): void;
        public getPadControllers(): boolean;
        public setPadControllers(_padControllers: boolean): void;
        public _setControllersToDisplay(_controllersToDisplay: number, _padControllers?: boolean): void;
        private _recalculateControllers(controllersToDisplay, fireModelChangeEvent);
        public _pushPair(previous: templa.mvc.IController, controller: templa.mvc.IController, controllerData?: any, suppressModelChangeEvent?: boolean): templa.mvc.IModelStateChange;
        public getControllers(): templa.mvc.IController[];
        private _createPrefixControllerEntry(controllersToDisplay);
        public _pop(suppressFireModelChangeEvent?: boolean, suppressFireDescriptionChangeEvent?: boolean): templa.mvc.composite.IAbstractStackControllerModelEntry;
        public _pushEntryGetChange(entry: templa.mvc.composite.IAbstractStackControllerModelEntry, suppressFireModelChangeEvent?: boolean): templa.mvc.IModelStateChange;
        public createStateDescription(models?: templa.mvc.IModel[]): any;
        public loadStateDescription(description: any): void;
    }
}
declare module iassetlab.client.core.mvc.home {
    interface IHomeControllerModel extends templa.mvc.IModel {
        getDisplayedOption(): string;
        requestDisplayOption(option: string): void;
    }
}
declare module iassetlab.client.core.mvc {
    class AssetLabHomeControllerModel extends templa.mvc.AbstractModel implements mvc.home.IHomeControllerModel {
        private _owner;
        private _stackModel;
        private _optionIdsToControllers;
        private _displayedOption;
        constructor(_owner: templa.mvc.IController, _stackModel: mvc.AssetLabStackControllerModel, _optionIdsToControllers: {
            [_: string]: templa.mvc.IController;
        });
        public getDisplayedOption(): string;
        public requestDisplayOption(option: string, suppressDescriptionChangeEvent?: boolean): templa.mvc.IController;
        public createStateDescription(models?: templa.mvc.IModel[]): any;
        public loadStateDescription(description: any): void;
    }
}
declare module iassetlab.client.core.service {
    class Template {
        public id: number;
        public ownerId: number;
        public name: string;
        public description: string;
        constructor();
    }
}
declare module iassetlab.client.core.service {
    class TemplateVersion {
        public id: number;
        public templateId: number;
        public versionNumber: number;
        public versionDate: Date;
        public imageUrl: string;
        constructor();
    }
}
declare module iassetlab.client.core.service {
    class User {
        public id: number;
        public displayName: string;
        constructor();
    }
}
declare module iassetlab.client.core.service {
    interface ITemplateSearchResult {
        template: service.Template;
        version: service.TemplateVersion;
        owner: service.User;
    }
    interface TemplateSearch {
        (value: string, index: number, quantity: number, retrieveTotalCount: boolean, resultHandler: (results: ITemplateSearchResult[], last: boolean, totalCount?: number, error?: any) => boolean): void;
    }
    interface ITemplateService {
        search: TemplateSearch;
    }
}
declare module iassetlab.client.core.mvc {
    class AssetLabSearchResultsControllerModel extends templa.mvc.AbstractModel implements templa.mvc.list.IListControllerModel, templa.mvc.loading.ILoadingControllerModel {
        private _blockSize;
        private _templateService;
        private _searchResultControllerFactory;
        private _controllerCount;
        private _currentBlock;
        private _blocks;
        private _loadingComplete;
        private _loadingProgress;
        private _loadingMaximumProgress;
        private _loadingErrors;
        constructor(_blockSize: number, _templateService: core.service.ITemplateService, _searchResultControllerFactory: (searchResult: core.service.ITemplateSearchResult) => templa.mvc.IController);
        public _search(searchString: string): void;
        public getController(index: number, reuseController: templa.mvc.IController): templa.mvc.IController;
        public getControllerType(index: number): string;
        public getControllerCount(): number;
        public getLoadingProgress(): number;
        public getMaximumProgress(): number;
        public getErrors(): string[];
        public isComplete(): boolean;
        /**
        * update a synchronous loading thing, return true if it isn't finished (requires another call), false if it is
        */
        public update(): boolean;
        /**
        * return true if the loading requires calls to update, false if it is asynchronous
        */
        public requestStartLoading(callback?: (loadable: templa.loading.ILoadable, message: string) => void): boolean;
    }
}
declare module iassetlab.client.core.mvc.search {
    interface ISearchControllerModel extends templa.mvc.IModel {
        requestSearch(searchString: string): void;
        getSearchString(): string;
        stashSearch(searchString: string): void;
    }
}
declare module iassetlab.client.core.mvc {
    class AssetLabSearchControllerModel extends templa.mvc.AbstractModel implements mvc.search.ISearchControllerModel {
        private _stackModel;
        private _owner;
        private _searchResultsController;
        private _searchResultsModel;
        private _searchString;
        private _activeSearch;
        constructor(_stackModel: mvc.AssetLabStackControllerModel, _owner: templa.mvc.IController, _searchResultsController: templa.mvc.IController, _searchResultsModel: mvc.AssetLabSearchResultsControllerModel);
        public requestSearch(searchString: string, suppressDescriptionChangeEvent?: boolean): void;
        public getSearchString(): string;
        public stashSearch(searchString: string): void;
        public createStateDescription(models?: templa.mvc.IModel[]): any;
        public loadStateDescription(description: any): void;
    }
}
declare module iassetlab.client.core.mvc {
    class AssetLabDecoratorModel extends templa.mvc.composite.AbstractCompositeControllerModel implements templa.mvc.composite.IKeyedControllerModel {
        private _decorationController;
        private _decorationControllerKey;
        private _otherControllers;
        private _otherControllerKey;
        constructor(_decorationController: templa.mvc.IController, _decorationControllerKey: string, _otherControllers: templa.mvc.IController[], _otherControllerKey: string);
        public getControllerKey(controller: templa.mvc.IController): string;
        public _getDescribedControllers(): templa.mvc.IController[];
        public getControllers(): templa.mvc.IController[];
    }
}
declare module iassetlab.client.core.mvc.template {
    interface ITemplateModel extends templa.mvc.IModel {
        getTitle(): string;
        getDescription(): string;
        getImageURL(maxWidth: number, maxHeight: number): string;
    }
}
declare module iassetlab.client.core.mvc.template.summary {
    interface ITemplateSummaryModel extends template.ITemplateModel {
        requestDetail(): void;
    }
}
declare module iassetlab.client.core.mvc {
    class AssetLabSearchResultTemplateSummaryModel extends templa.mvc.AbstractModel implements mvc.template.summary.ITemplateSummaryModel {
        private _searchResult;
        constructor(_searchResult: core.service.ITemplateSearchResult);
        public getTitle(): string;
        public getDescription(): string;
        public getImageURL(maxWidth: number, maxHeight: number): string;
        public requestDetail(): void;
    }
}
declare module iassetlab.client.core.mvc.home {
    class HomeController extends templa.dom.mvc.jquery.AbstractJQueryController<home.IHomeControllerModel> {
        static _selectorAbout: string;
        static _selectorSearch: string;
        static _selectorBrowse: string;
        private static _selectors;
        private static _displayedClass;
        constructor(viewFactory: templa.dom.mvc.IElementViewFactory);
        public _doStart(): boolean;
        public _doLoad(model: templa.mvc.IModel): void;
    }
}
declare module iassetlab.client.core.mvc.search {
    class SearchController extends templa.dom.mvc.jquery.AbstractJQueryController<search.ISearchControllerModel> {
        private _searchButtonClickHandler;
        private _searchFieldEnterHandler;
        private _searchFieldChangeHandler;
        constructor(viewFactory: templa.dom.mvc.IElementViewFactory);
        public _doStart(): boolean;
        public _doStop(): boolean;
        public _doLoad(model: search.ISearchControllerModel): void;
        private _requestSearch();
        private _stashSearch();
    }
}
declare module iassetlab.client.core.mvc.about {
    interface IAboutControllerModel extends templa.mvc.IModel {
    }
}
declare module iassetlab.client.core.mvc.about {
    class AboutController extends templa.dom.mvc.jquery.AbstractJQueryController<about.IAboutControllerModel> {
        constructor(viewFactory: templa.dom.mvc.IElementViewFactory);
    }
}
declare module iassetlab.client.core.mvc.statusbar {
    interface IStatusbarControllerModel extends mvc.home.IHomeControllerModel {
    }
}
declare module iassetlab.client.core.mvc.statusbar {
    class StatusbarController extends templa.dom.mvc.jquery.AbstractJQueryController<statusbar.IStatusbarControllerModel> {
        constructor(viewFactory: templa.dom.mvc.IElementViewFactory);
    }
}
declare module iassetlab.client.core.mvc.stack {
    class BackForwardStackController extends templa.dom.mvc.jquery.composite.StackJQueryController<stack.IBackForwardStackControllerModel> {
        private _leftWingSelector;
        private _rightWingSelector;
        private _backClickHandler;
        private _forwardClickHandler;
        private _backSwipeHandler;
        private _forwardSwipeHandler;
        private _hammer;
        constructor(viewFactory: templa.dom.mvc.IElementViewFactory, bundles: templa.dom.mvc.jquery.composite.IStackAnimationFactoryBundle[], _leftWingSelector: string, _rightWingSelector: string);
        public _doInit(): boolean;
        public _doDestroy(detachView?: boolean): boolean;
        public _doStart(): boolean;
        public _doStop(): boolean;
        private _requestBack();
        private _requestForward();
    }
}
declare module iassetlab.client.core.mvc.filter {
    class FilteringKeyedControllerModelProxy extends templa.mvc.AbstractModelProxy implements templa.mvc.composite.IKeyedControllerModel {
        private _keyedControllerModel;
        private _filter;
        constructor(_keyedControllerModel: templa.mvc.composite.IKeyedControllerModel, _filter: (controller: templa.mvc.IController) => boolean);
        public getControllerKey(controller: templa.mvc.IController): string;
        public getControllers(): templa.mvc.IController[];
    }
}
declare module iassetlab.client.core.mvc.template {
    class TemplateController<ModelType extends template.ITemplateModel> extends templa.dom.mvc.jquery.AbstractJQueryController<ModelType> {
        constructor(viewFactory: templa.dom.mvc.IElementViewFactory);
        public _doLoad(model: templa.mvc.IModel): void;
        private _setImage(templateModel);
        public layout(): void;
    }
}
declare module iassetlab.client.core.mvc.template.summary {
    class TemplateSummaryController extends template.TemplateController<summary.ITemplateSummaryModel> {
        private _detailRequestHandler;
        constructor(viewFactory: templa.dom.mvc.IElementViewFactory);
        public _doStart(): boolean;
        public _doStop(): boolean;
        private _requestDetail();
    }
}
declare module iassetlab.client.core.service.json {
    class JSONTemplateServiceFunctionFactory {
        constructor();
        public createSearch(): service.TemplateSearch;
    }
}
declare module iassetlab.client.core {
    class AssetLabControllerFactory {
        static controllerNameHome: string;
        private _modeFunction;
        private _animationBundleFactory;
        private _decoratorFactory;
        private _stackViewFactory;
        private _emptyStarterViewFactory;
        private _emptyEnderViewFactory;
        private _aboutViewFactory;
        private _searchViewFactory;
        private _homeViewFactory;
        private _searchResultsViewFactory;
        private _searchResultsItemContainerViewFactory;
        private _searchResultsLoadingViewFactory;
        private _searchResultsLoadingSwitcherViewFactory;
        private _templateSummaryViewFactory;
        private _statusbarViewFactory;
        private _statusbarDecoratorViewFactory;
        private _statusbarDecoratorStatusbarClass;
        private _statusbarDecoratorContentClass;
        private _toolbarViewFactory;
        private _toolbarButtonsBackClass;
        private _toolbarButtonsGeneralClass;
        private _toolbarCommandElementViewFactory;
        private _toolbarDecoratorClass;
        private _toolbarDecoratorContentClass;
        private _visibleDecoratorViewFactory;
        private _invisibleDecoratorViewFactory;
        private _contextClass;
        private _contextSummaryClass;
        private _contextMainClass;
        private _contextViewFactory;
        private _relativeAnimationBundlesWide3;
        private _relativeAnimationBundlesWide4;
        private _relativeAnimationBundleNarrow;
        private _absoluteAnimationBundlesWide3;
        private _absoluteAnimationBundlesNarrow;
        private _templateService;
        constructor();
        public init(loadables: templa.loading.ILoadable[]): void;
        public wrapInLoader(loadables: templa.loading.ILoadable[], controller: templa.mvc.IController): templa.mvc.IController;
        public create(): templa.mvc.IController;
        public createSearchResultsController(searchResultsViewFactory: templa.dom.mvc.IElementViewFactory, searchResultsModel: core.mvc.AssetLabSearchResultsControllerModel): templa.mvc.IController;
        public createHomeController(homeViewFactory: templa.dom.mvc.IElementViewFactory, homeModel: core.mvc.home.IHomeControllerModel): core.mvc.home.HomeController;
        public createAboutController(aboutViewFactory: templa.dom.mvc.IElementViewFactory, aboutModel: core.mvc.about.IAboutControllerModel): core.mvc.about.AboutController;
        public createContextController(mainController: templa.mvc.IController, summaryController: templa.mvc.IController, decoratorFactory: (controllers: templa.mvc.IController[]) => templa.mvc.IController): templa.mvc.IController;
        public createStatusbarDecoratorFactory(statusbarModel: core.mvc.statusbar.IStatusbarControllerModel): (controllers: templa.mvc.IController[]) => templa.dom.mvc.jquery.composite.KeyedJQueryController<core.mvc.AssetLabDecoratorModel>;
        public createToolbarDecoratorFactory(sourceController: templa.mvc.IController): (controllers: templa.mvc.IController[], invisible?: boolean) => templa.dom.mvc.jquery.composite.KeyedJQueryController<core.mvc.AssetLabDecoratorModel>;
    }
}
