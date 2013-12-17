/// <reference path="../defs/iassetlab-templa.d.ts" />
/// <reference path="../defs/jquery.d.ts" />
/// <reference path="../defs/jqueryui.d.ts" />
declare module templa.dom.animation {
    var cssAnimationEndEventNames: string[];
    class CSSElementClassAnimation extends templa.animation.AbstractAnimation {
        private _view;
        private _class;
        private _maxTimeMillis;
        private _lifecycleFunction;
        private _animationListener;
        constructor(_view: Element, _class: string, _maxTimeMillis?: number, _lifecycleFunction?: (phase: string, view: Element) => void);
        public _doInit(): boolean;
        public _doStart(): boolean;
        public _doDestroy(): boolean;
    }
}
declare module templa.dom.animation {
    interface IElementAnimationFactory {
        create(container: Element, view: Element): templa.animation.IAnimation;
    }
}
declare module templa.dom.animation {
    class CSSElementClassAnimationFactory implements animation.IElementAnimationFactory {
        private _class;
        private _maxTimeMillis;
        private _lifecycleFunction;
        constructor(_class: string, _maxTimeMillis?: number, _lifecycleFunction?: (phase: string, view: Element) => void);
        public create(container: Element, view: Element): templa.animation.IAnimation;
    }
}
declare module templa.dom.animation {
    var CSSElementTransitionEventNames: string[];
    var CSSElementTransitionNames: string[];
    var CSSElementTransformNames: string[];
    class CSSTranslateElementTransitionAnimation extends templa.animation.AbstractAnimation {
        private _view;
        private _initialX;
        private _initialY;
        private _transitionStyle;
        private _transformStyle;
        private _animationEventListener;
        constructor(_view: Element, _initialX: number, _initialY: number, _transitionStyle: string, _transformStyle: string);
        public _doInit(): boolean;
        public _doStart(): boolean;
        public _doDestroy(): boolean;
    }
}
declare module templa.dom.animation {
    class CSSTranslateElementTransitionAnimationFactory implements animation.IElementAnimationFactory {
        private _timeSeconds;
        private _xMultFrom;
        private _yMultFrom;
        private _xMultTo;
        private _yMultTo;
        constructor(_timeSeconds: number, _xMultFrom: number, _yMultFrom: number, _xMultTo: number, _yMultTo: number);
        public create(container: Element, view: Element): templa.animation.IAnimation;
    }
}
declare module templa.dom.loading.jquery {
    class JQueryDeferredLoadable extends templa.loading.AbstractLoadable {
        private _deferred;
        constructor(_deferred: JQueryDeferred);
        public _doStartLoading(): void;
    }
}
declare module templa.dom.mvc {
    interface IElementReference {
        resolve(): Element;
    }
}
declare module templa.dom.mvc {
    interface IElementController extends templa.mvc.IController {
        init(container: mvc.IElementReference, prepend?: boolean): boolean;
    }
}
declare module templa.dom.mvc {
    interface IElementView extends templa.mvc.IView {
        getRoots(): Node[];
    }
}
declare module templa.dom.mvc {
    interface IElementViewFactory {
        create(container: mvc.IElementReference, prepend?: boolean): mvc.IElementView;
    }
}
declare module templa.dom.mvc {
    class AttributeElementReference implements mvc.IElementReference {
        private _view;
        private _attributeName;
        private _attributeValue;
        private _filter;
        constructor(_view: mvc.IElementView, _attributeName: string, _attributeValue: string, _filter?: (o: Node) => boolean);
        public resolve(): Element;
    }
}
declare module templa.dom.mvc {
    class AbstractElementController<ModelType extends templa.mvc.IModel> extends templa.mvc.AbstractController<ModelType> implements mvc.IElementController {
        private _viewFactory;
        public _view: mvc.IElementView;
        public _viewContainer: mvc.IElementReference;
        private _viewPrepend;
        constructor(_viewFactory: mvc.IElementViewFactory);
        public getView(): templa.mvc.IView;
        public init(container: mvc.IElementReference, prepend?: boolean): boolean;
        public _reinitialize(): void;
        public load(): void;
        public _doDestroy(detachView?: boolean): boolean;
    }
}
declare module templa.dom.mvc {
    class DirectElementReference implements mvc.IElementReference {
        private _element;
        constructor(_element: Element);
        public resolve(): Element;
    }
}
declare module templa.dom.mvc {
    class DocumentFragmentElementView implements mvc.IElementView {
        private _fragment;
        private _container;
        private _prepend;
        private _id;
        static createFromHTML(html: string, container: mvc.IElementReference, prepend: boolean, id: string): DocumentFragmentElementView;
        private _attached;
        constructor(_fragment: DocumentFragment, _container: mvc.IElementReference, _prepend: boolean, _id: string);
        public attach(): void;
        public detach(): void;
        public layout(): boolean;
        public getRoots(): Node[];
    }
}
declare module templa.dom.mvc {
    class DocumentFragmentElementViewFactory implements mvc.IElementViewFactory {
        private _html;
        constructor(_html?: string);
        public create(container: mvc.IElementReference, prepend?: boolean): mvc.IElementView;
        public _createDiv(container: mvc.IElementReference, prepend: boolean, html: string): mvc.IElementView;
    }
}
declare module templa.dom.mvc {
    class ModeElementViewProxy implements mvc.IElementView {
        private _container;
        private _proxied;
        private _currentMode;
        private _modeFunction;
        constructor(_container: mvc.IElementReference, _proxied: mvc.IElementView, _currentMode: string, _modeFunction: (IElementReference: any) => string);
        public getRoots(): Node[];
        public attach(): void;
        public detach(): void;
        public layout(): boolean;
    }
}
declare module templa.dom.mvc {
    class ModeElementViewFactoryProxy implements mvc.IElementViewFactory {
        private _modeFunction;
        private _modesToFactories;
        constructor(_modeFunction: (IElementReference: any) => string, _modesToFactories: {
            string: mvc.IElementViewFactory;
        });
        public create(container: mvc.IElementReference, prepend?: boolean): mvc.IElementView;
    }
}
declare module templa.dom.mvc {
    class TemplateElementViewFactory extends mvc.DocumentFragmentElementViewFactory {
        private _templateSource;
        private _options;
        static createFromString(templateString: string, loadables?: templa.loading.ILoadable[], options?: any): TemplateElementViewFactory;
        static createFromURL(templateURL: string, loadables?: templa.loading.ILoadable[], options?: any): TemplateElementViewFactory;
        constructor(_templateSource: templa.template.ITemplateSource, _options: any);
        public create(container: mvc.IElementReference, prepend?: boolean, extraOptions?: any): mvc.IElementView;
    }
}
declare module templa.dom.mvc {
    class ViewRootElementReference implements mvc.IElementReference {
        private _view;
        constructor(_view: mvc.IElementView);
        public resolve(): Element;
    }
}
declare module templa.dom.mvc.composite {
    class AbstractCompositeElementController<ModelType extends templa.mvc.composite.ICompositeControllerModel> extends mvc.AbstractElementController<ModelType> {
        public _controllers: templa.mvc.IController[];
        private _controllerOnChangeListener;
        constructor(viewFactory: mvc.IElementViewFactory);
        public _doLoad(model: templa.mvc.composite.ICompositeControllerModel): void;
        public clear(fireEvent?: boolean): void;
        public _doStart(): boolean;
        public _doStop(): boolean;
        public _doInit(): boolean;
        public _doDestroy(detachView?: boolean): boolean;
        public _add(controller: mvc.IElementController, fireEvent?: boolean, layout?: boolean, prepend?: boolean): void;
        public _remove(controller: templa.mvc.IController, detachView?: boolean, layout?: boolean): void;
        public _handleModelChangeEvent(event: templa.mvc.ModelChangeEvent): void;
        public getControllerContainer(controller: templa.mvc.IController): mvc.IElementReference;
        public getCommands(): templa.mvc.Command[];
        public getTitle(): string;
        public layout(): void;
    }
}
declare module templa.dom.mvc.jquery {
    interface IJQuerySelectorHandler {
        $(selector: string): JQuery;
    }
}
declare module templa.dom.mvc.jquery {
    class JQueryElementReference implements mvc.IElementReference {
        private _selectorHandler;
        private _selector;
        constructor(_selectorHandler: jquery.IJQuerySelectorHandler, _selector: string);
        public resolve(): Element;
    }
}
declare module templa.dom.mvc.jquery {
    class AbstractJQueryController<ModelType extends templa.mvc.IModel> extends mvc.AbstractElementController<ModelType> implements jquery.IJQuerySelectorHandler {
        constructor(_viewFactory: mvc.IElementViewFactory);
        public $(selector?: string, roots?: Node[]): JQuery;
        public $reference(selector: string): mvc.IElementReference;
    }
}
declare module templa.dom.mvc.jquery {
    class BorrowedElementView implements mvc.IElementView {
        private _container;
        private _selector;
        constructor(_container: mvc.IElementReference, _selector: string);
        public getRoots(): Node[];
        public attach(): void;
        public detach(): void;
        public layout(): boolean;
    }
}
declare module templa.dom.mvc.jquery {
    class BorrowedElementViewFactory implements mvc.IElementViewFactory {
        private _selector;
        constructor(_selector: string);
        public create(container: mvc.IElementReference, prefix?: boolean): mvc.IElementView;
    }
}
declare module templa.dom.mvc.jquery {
    class DimensionSettingElementViewProxy implements mvc.IElementView {
        private _proxied;
        private _variableDimensionSelector;
        private _fixedWidthSelectors;
        private _fixedHeightSelectors;
        private _widthAttribute;
        private _heightAttribute;
        private _maxHeightSelectors;
        constructor(_proxied: mvc.IElementView, _variableDimensionSelector: string, _fixedWidthSelectors: string[], _fixedHeightSelectors: string[], _widthAttribute?: string, _heightAttribute?: string, _maxHeightSelectors?: string[]);
        public getRoots(): Node[];
        public attach(): void;
        public detach(): void;
        public layout(): boolean;
    }
}
declare module templa.dom.mvc.jquery {
    class DimensionSettingElementViewProxyFactory implements mvc.IElementViewFactory {
        private _proxied;
        private _variableDimensionSelector;
        private _fixedWidthSelectors;
        private _fixedHeightSelectors;
        private _widthAttribute;
        private _heightAttribute;
        private _maxHeightSelectors;
        constructor(_proxied: mvc.IElementViewFactory, _variableDimensionSelector: string, _fixedWidthSelectors: string[], _fixedHeightSelectors: string[], _widthAttribute?: string, _heightAttribute?: string, _maxHeightSelectors?: string[]);
        public create(container: mvc.IElementReference, prepend?: boolean): mvc.IElementView;
    }
}
declare module templa.dom.mvc.jquery {
    class ElementViewJQuerySelectorHandler implements jquery.IJQuerySelectorHandler {
        private _view;
        private _excludedViews;
        constructor(_view: mvc.IElementView, _excludedViews?: mvc.IElementView[]);
        public $(selector?: string): JQuery;
    }
}
declare module templa.dom.mvc.jquery {
    class RotatedElementViewProxy implements mvc.IElementView {
        private _container;
        private _useContainer;
        private _prepend;
        private _proxied;
        private _root;
        constructor(_container: mvc.IElementReference, _useContainer: boolean, _prepend: boolean, _proxied: mvc.IElementView, _root: Element);
        public getRoots(): Node[];
        public attach(): void;
        public detach(): void;
        public layout(): boolean;
    }
}
declare module templa.dom.mvc.jquery {
    class RotatedElementViewProxyFactory implements mvc.IElementViewFactory {
        private _proxied;
        private _useContainer;
        constructor(_proxied: mvc.IElementViewFactory, _useContainer?: boolean);
        public create(container: mvc.IElementReference, prepend?: boolean): mvc.IElementView;
    }
}
declare module templa.dom.mvc.jquery.command {
    class CommandJQueryViewDescription {
        private _view;
        private _actionElementSelector;
        constructor(_view: mvc.IElementView, _actionElementSelector: string);
        public getView(): mvc.IElementView;
        public getActionElementSelector(): string;
    }
}
declare module templa.dom.mvc.jquery.command {
    interface ICommandJQueryViewDescriptionFactory {
        create(container: mvc.IElementReference, command: templa.mvc.Command): command.CommandJQueryViewDescription;
    }
}
declare module templa.dom.mvc.jquery.command {
    class IdDelegatingCommandJQueryViewDescriptionFactory implements command.ICommandJQueryViewDescriptionFactory {
        private _defaultDescriptionFactory;
        private _idsToDescriptionFactories;
        constructor(_defaultDescriptionFactory: command.ICommandJQueryViewDescriptionFactory, _idsToDescriptionFactories: {
            string: command.ICommandJQueryViewDescriptionFactory;
        });
        public create(container: mvc.IElementReference, command: templa.mvc.Command): command.CommandJQueryViewDescription;
    }
}
declare module templa.dom.mvc.jquery.command {
    class TemplateCommandJQueryViewDescriptionFactory implements command.ICommandJQueryViewDescriptionFactory {
        private _templateSource;
        private _options;
        static createFromString(templateString: string, loadables?: templa.loading.ILoadable[], options?: any): TemplateCommandJQueryViewDescriptionFactory;
        static createFromURL(templateURL: string, loadables?: templa.loading.ILoadable[], options?: any): TemplateCommandJQueryViewDescriptionFactory;
        constructor(_templateSource: templa.template.ITemplateSource, _options?: any);
        public create(_container: mvc.IElementReference, _command: templa.mvc.Command): command.CommandJQueryViewDescription;
    }
}
declare module templa.dom.mvc.jquery.command {
    class ToolbarCommandJQueryController<ModelType extends templa.mvc.command.ICommandControllerModel> extends jquery.AbstractJQueryController<ModelType> {
        private _commandViewDescriptionFactory;
        private _backContainerSelector;
        private _generalContainerSelector;
        private _backViews;
        private _generalViews;
        constructor(_viewFactory: mvc.IElementViewFactory, _commandViewDescriptionFactory: command.ICommandJQueryViewDescriptionFactory, _backContainerSelector: string, _generalContainerSelector: string);
        public _doDestroy(detachView?: boolean): boolean;
        public _detachViews(): void;
        public _clear(): void;
        public _doLoad(model: templa.mvc.command.ICommandControllerModel): void;
    }
}
declare module templa.dom.mvc.jquery.composite {
    class AbstractCompositeJQueryController<ModelType extends templa.mvc.composite.ICompositeControllerModel> extends mvc.composite.AbstractCompositeElementController<ModelType> implements jquery.IJQuerySelectorHandler {
        constructor(viewFactory: mvc.IElementViewFactory);
        public $(selector: string): JQuery;
        public $reference(selector: string): mvc.IElementReference;
        public getControllerContainer(controller: templa.mvc.IController): mvc.IElementReference;
        public getControllerContainerSelector(controller: templa.mvc.IController): string;
    }
}
declare module templa.dom.mvc.jquery.composite {
    class KeyedJQueryController<ModelType extends templa.mvc.composite.IKeyedControllerModel> extends composite.AbstractCompositeJQueryController<ModelType> {
        private _keysToSelectors;
        constructor(_viewFactory: mvc.IElementViewFactory, _keysToSelectors?: {
            string: string;
        });
        public setKeyAndSelector(key: string, selector: string): void;
        public getControllerContainerSelector(controller: templa.mvc.IController): string;
    }
}
declare module templa.dom.mvc.jquery.composite {
    interface IStackAnimationFactoryBundle {
        popAnimationFactory?: dom.animation.IElementAnimationFactory;
        pushAnimationFactory?: dom.animation.IElementAnimationFactory;
        selector?: string;
    }
    class StackJQueryController<ModelType extends templa.mvc.composite.IStackControllerModel> extends composite.AbstractCompositeJQueryController<ModelType> {
        private _animationFactoryBundles;
        private _backCommand;
        private removedAnimatedChildren;
        constructor(viewFactory: mvc.IElementViewFactory, _animationFactoryBundles: IStackAnimationFactoryBundle[]);
        public setAnimationFactoryBundles(_animationFactoryBundles: IStackAnimationFactoryBundle[]): void;
        public _handleModelChangeEvent(event: templa.mvc.ModelChangeEvent): void;
        public _back(): void;
        public getCommands(): templa.mvc.Command[];
        private _animate(animationFactoryName, animationCompletionListener?);
    }
}
declare module templa.dom.mvc.jquery.list {
    class AbstractListJQueryListItem {
        private _controller;
        private _controllerType;
        private _containerView;
        constructor(_controller: templa.mvc.IController, _controllerType: string, _containerView?: mvc.IElementView);
        public getController(): templa.mvc.IController;
        public getControllerType(): string;
        public getContainerView(): mvc.IElementView;
    }
    class AbstractListJQueryController<ModelType extends templa.mvc.list.IListControllerModel> extends mvc.AbstractElementController<ModelType> implements jquery.IJQuerySelectorHandler {
        private _listItemContainerViewFactory;
        private _positionsToListItems;
        private _typesToReusableControllers;
        constructor(viewFactory: mvc.IElementViewFactory, _listItemContainerViewFactory: mvc.IElementViewFactory);
        public _initAndStart(controller: mvc.IElementController, container: mvc.IElementReference): void;
        public _start(controller: templa.mvc.IController): void;
        public _stop(controller: templa.mvc.IController): void;
        public _destroy(controller: templa.mvc.IController): void;
        public _doLoad(model: templa.mvc.list.IListControllerModel): void;
        public _keepLoading(listModel: templa.mvc.list.IListControllerModel, position: number): boolean;
        public _doInit(): boolean;
        public _doStart(): boolean;
        public _doStop(): boolean;
        public _doDestroy(): boolean;
        public layout(): void;
        public _clear(): void;
        public _getContainer(): mvc.IElementReference;
        public $(selector?: string): JQuery;
        public $reference(selector?: string): mvc.IElementReference;
    }
}
declare module templa.dom.mvc.jquery.loading {
    class AbstractLoadingJQueryController<ModelType extends templa.mvc.loading.ILoadingControllerModel> extends jquery.AbstractJQueryController<ModelType> {
        constructor(viewFactory: mvc.IElementViewFactory);
        public _doStart(): boolean;
        public _increment(): void;
    }
}
declare module templa.dom.mvc.jquery.loading {
    class ProgressBarLoadingJQueryUIController<ModelType extends templa.mvc.loading.ILoadingControllerModel> extends loading.AbstractLoadingJQueryController<ModelType> {
        private _progressBarSelector;
        constructor(viewFactory: mvc.IElementViewFactory, _progressBarSelector?: string);
        public _doLoad(model: templa.mvc.IModel): void;
    }
}
declare module templa.dom.mvc.jquery.tab {
    class TabBarTabJQueryViewDescription {
        private _clickableElementSelector;
        private _styleableElementSelector;
        private _view;
        constructor(_clickableElementSelector: string, _styleableElementSelector: string, _view: mvc.IElementView);
        public getClickableElementSelector(): string;
        public getStyleableElementSelector(): string;
        public getView(): mvc.IElementView;
    }
}
declare module templa.dom.mvc.jquery.tab {
    interface ITabBarTabJQueryViewDescriptionFactory {
        create(container: mvc.IElementReference, tabBarId: string): tab.TabBarTabJQueryViewDescription;
    }
}
declare module templa.dom.mvc.jquery.tab {
    class MappedTabBarTabJQueryViewDescriptionFactory implements tab.ITabBarTabJQueryViewDescriptionFactory {
        private _tabBarIdsToViewFactories;
        private _clickableElementSelector;
        private _styleableElementSelector;
        constructor(_tabBarIdsToViewFactories: {
            [_: string]: mvc.IElementViewFactory;
        }, _clickableElementSelector: string, _styleableElementSelector: string);
        public create(container: mvc.IElementReference, tabBarId: string): tab.TabBarTabJQueryViewDescription;
    }
}
declare module templa.dom.mvc.jquery.tab {
    class TabBarJQueryController<ModelType extends templa.mvc.tab.ITabBarModel> extends jquery.AbstractJQueryController<ModelType> {
        private _tabBarTabViewDescriptionFactory;
        private _tabButtonContainerSelector;
        private _selectedTabClass;
        private _tabIdsToDescriptions;
        constructor(_viewFactory: mvc.IElementViewFactory, _tabBarTabViewDescriptionFactory: tab.ITabBarTabJQueryViewDescriptionFactory, _tabButtonContainerSelector: string, _selectedTabClass: string);
        public _doLoad(model: templa.mvc.tab.ITabBarModel): void;
        private _removeAllTabs();
        private _requestSelectTabId(tabId);
        private _selectTab(selectedTabId);
        public _handleModelChangeEvent(event: templa.mvc.ModelChangeEvent): void;
    }
}
declare module templa.dom.mvc.jquery.table {
    interface IAbstractTableJQueryControllerCell {
        container: mvc.IElementReference;
        controller: templa.mvc.IController;
    }
    class AbstractTableJQueryController<ModelType extends templa.mvc.table.ITableControllerModel> extends mvc.AbstractElementController<ModelType> implements jquery.IJQuerySelectorHandler {
        private _rowHeaderViewFactory;
        private _rowSelectorFormat;
        private _columnHeaderViewFactory;
        private _columnSelectorFormat;
        private _tableViewFactory;
        private _cellSelectorFormat;
        private _rowHeaders;
        private _leafRowHeaders;
        private _columnHeaders;
        private _leafColumnHeaders;
        private _cells;
        private _rowCount;
        private _columnCount;
        private _rowHeaderView;
        private _columnHeaderView;
        private _tableView;
        constructor(viewFactory: mvc.IElementViewFactory, _rowHeaderViewFactory: (container: mvc.IElementReference, rows: number, depth: number) => mvc.IElementView, _rowSelectorFormat: string, _columnHeaderViewFactory: (container: mvc.IElementReference, columns: number, depth: number) => mvc.IElementView, _columnSelectorFormat: string, _tableViewFactory: (container: mvc.IElementReference, rows: number, columns: number) => mvc.IElementView, _cellSelectorFormat: string);
        public _doLoad(model: templa.mvc.IModel): void;
        public _removeAll(): void;
        public _removeAllFromArray(controllers: IAbstractTableJQueryControllerCell[]): void;
        public layout(): void;
        public _layoutTable(): void;
        public $(selector?: string, roots?: Node[]): JQuery;
        private _appendRoots(into, cells);
    }
}
