module templa.animation {
    class AnimationStateChangeEvent {
        private _animationState;
        constructor(_animationState: string);
        public animationState : string;
    }
}
module templa.animation {
    var animationStateCreated: string;
    var animationStateInitialized: string;
    var animationStateStopped: string;
    var animationStateStarted: string;
    var animationStateFinished: string;
    interface IAnimation {
        getState(): string;
        init();
        start();
        destroy();
        addAnimationListener(listener: (source: IAnimation, changeEvent: AnimationStateChangeEvent) => void);
        removeAnimationListener(listener: (source: IAnimation, changeEvent: AnimationStateChangeEvent) => void);
    }
}
module templa.util.Arrays {
    function removeElement(array: any[], element: any): bool;
    function pushAll(into: any[], elements: any[]): void;
}
module templa.animation {
    class AbstractAnimation implements IAnimation {
        private _state;
        private _animationChangeListeners;
        constructor();
        public getState(): string;
        public init(): void;
        public _doInit(): bool;
        public start(): void;
        public _doStart(): bool;
        public destroy(): void;
        public _doDestroy(): bool;
        public _fireAnimationStateChangeEvent(changeEvent: AnimationStateChangeEvent): void;
        public addAnimationListener(listener: (source: IAnimation, changeEvent: AnimationStateChangeEvent) => void): void;
        public removeAnimationListener(listener: (source: IAnimation, changeEvent: AnimationStateChangeEvent) => void): void;
    }
}
module templa.animation.element {
    var cssAnimationEndEventNames: string[];
    class CSSElementClassAnimation extends AbstractAnimation {
        private _view;
        private _class;
        private _maxTimeMillis;
        private _lifecycleFunction;
        private _animationListener;
        constructor(_view: Element, _class: string, _maxTimeMillis?: number, _lifecycleFunction?: (phase: string, view: Element) => void);
        public _doInit(): bool;
        public _doStart(): bool;
        public _doDestroy(): bool;
    }
}
module templa.animation.element {
    interface IElementAnimationFactory {
        create(container: Element, view: Element): IAnimation;
    }
}
module templa.animation.element {
    class CSSElementClassAnimationFactory implements IElementAnimationFactory {
        private _class;
        private _maxTimeMillis;
        private _lifecycleFunction;
        constructor(_class: string, _maxTimeMillis?: number, _lifecycleFunction?: (phase: string, view: Element) => void);
        public create(container: Element, view: Element): IAnimation;
    }
}
module templa.animation.element {
    var CSSElementTransitionEventNames: string[];
    var CSSElementTransitionNames: string[];
    var CSSElementTransformNames: string[];
    class CSSTranslateElementTransitionAnimation extends AbstractAnimation {
        private _view;
        private _initialX;
        private _initialY;
        private _transitionStyle;
        private _transformStyle;
        private _animationEventListener;
        constructor(_view: Element, _initialX: number, _initialY: number, _transitionStyle: string, _transformStyle: string);
        public _doInit(): bool;
        public _doStart(): bool;
        public _doDestroy(): bool;
    }
}
module templa.animation.element {
    class CSSTranslateElementTransitionAnimationFactory implements IElementAnimationFactory {
        private _timeSeconds;
        private _xMultFrom;
        private _yMultFrom;
        private _xMultTo;
        private _yMultTo;
        constructor(_timeSeconds: number, _xMultFrom: number, _yMultFrom: number, _xMultTo: number, _yMultTo: number);
        public create(container: Element, view: Element): IAnimation;
    }
}
module templa.loading {
    interface ILoadable {
        getLoadingProgress(): number;
        getMaximumProgress(): number;
        getErrors(): string[];
        isComplete(): bool;
        update(): bool;
        requestStartLoading(callback?: (loadable: ILoadable, message: string) => void): bool;
    }
}
module templa.loading {
    class AbstractLoadable implements ILoadable {
        private _maximumProgress;
        private _synchronous;
        private _loadingProgress;
        private _errors;
        private _callback;
        constructor(_maximumProgress: number, _synchronous: bool);
        public getLoadingProgress(): number;
        public getMaximumProgress(): number;
        public getErrors(): string[];
        public isComplete(): bool;
        public update(): bool;
        public requestStartLoading(callback?: (source: ILoadable, message: string) => void): bool;
        public _doStartLoading(): void;
        public _pushError(error: string): void;
        public _setLoadingProgress(loadingProgress: number, message?: string, maximumProgress?: number): void;
        public _fireLoadingEvent(message?: string): void;
    }
}
module templa.loading {
    class CompositeLoadable implements ILoadable {
        private _loadables;
        private _synchronousLoadables;
        constructor(_loadables?: ILoadable[]);
        public getLoadingProgress(): number;
        public getMaximumProgress(): number;
        public getErrors(): string[];
        public isComplete(): bool;
        public update(): bool;
        public requestStartLoading(callback?: (loadable: ILoadable, message: string) => void): bool;
    }
}
module templa.mvc {
    class ModelChangeDescription {
        private _changeType;
        constructor(_changeType: string);
        public changeType : string;
    }
}
module templa.mvc {
    class ModelChangeEvent {
        private _descriptions;
        constructor(_changeType?: string);
        constructor(_modelChangeDescription?: ModelChangeDescription);
        constructor(_modelChangeDescriptions?: ModelChangeDescription[]);
        public lookup(changeType: string);
    }
}
module templa.mvc {
    interface IModelStateChange {
        undo(): void;
        redo(): void;
    }
}
module templa.mvc {
    interface IModel {
        addOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void);
        removeOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void);
        addStateDescriptionChangeListener(listener: (source: IModel, change: IModelStateChange) => void);
        removeStateDescriptionChangeListener(listener: (source: IModel, change: IModelStateChange) => void);
        createStateDescription(models?: IModel[]): any;
        loadStateDescription(description: any);
    }
}
module templa.mvc {
    var CommandTypeScreen: number;
    var CommandTypeBack: number;
    var CommandTypeForward: number;
    class Command {
        private _id;
        private _commandType;
        private _priority;
        private _action;
        private _enabled;
        constructor(_id: string, _commandType: number, _priority: number, _action: () => void);
        public priority : number;
        public commandType : number;
        public enabled : bool;
        public id : string;
        public action : () => void;
    }
}
module templa.mvc {
    class ControllerChangeEvent {
        private _commandsChanged;
        private _titleChanged;
        constructor(_commandsChanged: bool, _titleChanged: bool);
        public commandsChanged : bool;
        public titleChanged : bool;
    }
}
module templa.mvc {
    interface IView {
        attach(): void;
        detach(): void;
        layout(): bool;
    }
}
module templa.mvc {
    interface IElementReference {
        resolve(): Element;
    }
}
module templa.mvc {
    var ControllerStateUninitialized: number;
    var ControllerStateInitialized: number;
    var ControllerStateStarted: number;
    interface IController {
        getModel(): IModel;
        setModel(model: IModel);
        init(container: IElementReference, prepend?: bool): bool;
        load();
        start(): bool;
        stop(): bool;
        destroy(detachView?: bool): bool;
        getState(): number;
        getCommands(): Command[];
        getTitle(): string;
        getView(): IView;
        addOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void);
        removeOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void);
        addAnimation(animation: animation.IAnimation);
        layout(): void;
    }
}
module templa.mvc {
    class AbstractController implements IController {
        public _model: IModel;
        private _commands;
        private _state;
        public _viewContainer: IElementReference;
        private _viewPrepend;
        private _animations;
        private _animationListener;
        private _modelOnChangeListener;
        private _controllerOnChangeListeners;
        constructor();
        public getModel(): IModel;
        public setModel(model: IModel): void;
        public init(container: IElementReference, prepend?: bool): bool;
        public _doInit(container: IElementReference, prepend: bool): bool;
        public load(): void;
        public _doLoad(model: IModel): void;
        public getView(): IView;
        public _handleModelChangeEvent(event: ModelChangeEvent): void;
        public start(): bool;
        public _doStart(): bool;
        public stop(): bool;
        public _doStop(): bool;
        public destroy(detachView?: bool): bool;
        public _doDestroy(detachView?: bool): bool;
        public getState(): number;
        public getCommands(): Command[];
        public setCommands(commands: Command[]): void;
        public getTitle(): string;
        public addOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void): void;
        public removeOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void): void;
        public _fireControllerChangeEvent(controllerChangeEvent: ControllerChangeEvent): void;
        public addAnimation(animation: animation.IAnimation): void;
        public layout(): void;
        public _isAnimating(): bool;
        public _clearAnimations(): void;
        public _addAnimation(animation: animation.IAnimation, doNotStart?: bool): void;
        public _removeAnimation(animation: animation.IAnimation, doNotDestroy?: bool): void;
        public _safeTimeout(f: () => void, millis: number): void;
    }
}
module templa.mvc {
    class AbstractModel implements IModel {
        private _modelOnChangeListeners;
        private _stateDescriptionChangeListeners;
        public _listeningForTokenChanges: bool;
        constructor();
        public addOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void): void;
        public removeOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void): void;
        public _startedListening(): void;
        public _stoppedListening(): void;
        public _fireModelChangeEvent(changeDescription?: string, suppressFireStateTokenChange?: bool);
        public _fireModelChangeEvent(changeDescription?: ModelChangeDescription, suppressFireStateTokenChange?: bool);
        public _fireModelChangeEvent(changeEvent?: ModelChangeEvent, suppressFireStateTokenChange?: bool);
        public addStateDescriptionChangeListener(listener: (source: IModel, change: IModelStateChange) => void): void;
        public removeStateDescriptionChangeListener(listener: (source: IModel, change: IModelStateChange) => void): void;
        public _startedListeningForStateDescriptionChanges(): void;
        public _stoppedListeningForStateDescriptionChanges(): void;
        public _fireStateDescriptionChangeEvent(source: IModel, change?: IModelStateChange): void;
        public createStateDescription(models?: IModel[]): any;
        public loadStateDescription(description: any): void;
        public _checkModels(models: IModel[]): IModel[];
    }
}
module templa.mvc {
    class AbstractModelProxy extends AbstractModel implements IModel {
        private _model;
        private _onChangeListener;
        private _onStateChangeListener;
        constructor(_model: IModel);
        public _startedListening(): void;
        public _stoppedListening(): void;
        public _startedListeningForStateDescriptionChanges(): void;
        public _stoppedListeningForStateDescriptionChanges(): void;
    }
}
module templa.mvc.command {
    interface ICommandControllerModel extends IModel {
        getCommands(): Command[];
    }
}
module templa.mvc.command {
    class CommandControllerModelAdapter extends AbstractModel implements ICommandControllerModel {
        private _controller;
        private _listener;
        constructor(_controller: IController);
        public getCommands(): Command[];
        public _startedListening(): void;
        public _stoppedListening(): void;
    }
}
module templa.mvc.composite {
    class AbstractCompositeControllerModel extends AbstractModel implements ICompositeControllerModel {
        public _stateDescriptionChangeListener: (source: IModel, change: IModelStateChange) => void;
        constructor();
        public _getDescribedControllers(): IController[];
        public getControllers(): IController[];
        public _startedListeningForStateDescriptionChanges(): void;
        public _stoppedListeningForStateDescriptionChanges(): void;
        public createStateDescription(models?: IModel[]): any;
        public loadStateDescription(description: any): void;
    }
}
module templa.mvc.composite {
    var compositeControllerModelEventControllersChanged: string;
    interface ICompositeControllerModel extends IModel {
        getControllers(): IController[];
    }
}
module templa.mvc.composite {
    var stackControllerModelEventPushed: string;
    var stackControllerModelEventPopped: string;
    interface IStackControllerModel extends ICompositeControllerModel {
        isStackEmpty(): bool;
        canPop(): bool;
        requestPop(): void;
    }
}
module templa.mvc.composite {
    class StackControllerModelChangeDescription extends ModelChangeDescription {
        private _removedController;
        private _addedController;
        private _silentRemovedControllers;
        private _silentAddedControllers;
        constructor(changeType: string, _removedController: IController, _addedController: IController, _silentRemovedControllers?: IController[], _silentAddedControllers?: IController[]);
        public removedController : IController;
        public addedController : IController;
        public silentRemovedControllers : IController[];
        public silentAddedControllers : IController[];
    }
}
module templa.mvc.composite {
    interface IAbstractStackControllerModelEntry {
        controller: IController;
        data?: any;
    }
    class AbstractStackControllerModelPushChange implements IModelStateChange {
        private _model;
        private _entry;
        constructor(_model: AbstractStackControllerModel, _entry: IAbstractStackControllerModelEntry);
        public undo(): void;
        public redo(): void;
    }
    class AbstractStackControllerModelPopChange implements IModelStateChange {
        private _model;
        private _entry;
        constructor(_model: AbstractStackControllerModel, _entry: IAbstractStackControllerModelEntry);
        public undo(): void;
        public redo(): void;
    }
    class AbstractStackControllerModel extends AbstractCompositeControllerModel implements IStackControllerModel {
        private _allowEmptyStack;
        public _controllersToDisplay: number;
        public _stack: IAbstractStackControllerModelEntry[];
        constructor(_allowEmptyStack?: bool, _controllersToDisplay?: number);
        public _setControllersToDisplay(_controllersToDisplay: number): void;
        public getControllers(): IController[];
        public _getDescribedControllers(): IController[];
        public isStackEmpty(): bool;
        public canPop(): bool;
        public requestPop(): void;
        public _ensureVisible(controller: IController, suppressFireDescriptionChangeEvent?: bool): bool;
        public _deStack(controller: IController, suppressFireModelChangeEvent?: bool, suppressFireDescriptionChangeEvent?: bool): void;
        public _pop(suppressFireModelChangeEvent?: bool, suppressFireDescriptionChangeEvent?: bool): IAbstractStackControllerModelEntry;
        public _push(controller: IController, data?: any, suppressFireModelChangeEvent?: bool, suppressFireDescriptionChangeEvent?: bool): void;
        public _contains(controller: IController): bool;
        public _indexOf(controller: IController): number;
        public _pushEntryGetChange(entry: IAbstractStackControllerModelEntry, suppressFireModelChangeEvent?: bool): IModelStateChange;
        public _pushEntry(entry: IAbstractStackControllerModelEntry, suppressFireModelChangeEvent?: bool, suppressFireDescriptionChangeEvent?: bool): void;
        public peek : IController;
        public createStateDescription(models?: IModel[]): any;
        public loadStateDescription(description: any): void;
        public _entryToDescription(entry: IAbstractStackControllerModelEntry, models: IModel[]): any;
        public _createEntryFromDescription(description: any): IAbstractStackControllerModelEntry;
    }
}
module templa.mvc.composite {
    class AbstractDescriptiveStackControllerModel extends AbstractStackControllerModel {
        private _controllerFactories;
        constructor(allowEmptyStack?: bool, controllersToDisplay?: number);
        public setControllerFactory(key: string, factory: (data: any) => IController): void;
        public _entryToDescription(entry: IAbstractStackControllerModelEntry, models?: IModel[]): any;
        public _createEntryFromDescription(description: any): IAbstractStackControllerModelEntry;
    }
}
module templa.mvc.composite {
    interface IKeyedControllerModel extends ICompositeControllerModel {
        getControllerKey(controller: IController): string;
    }
}
module templa.mvc.composite {
    class MappedKeyedControllerModel extends AbstractCompositeControllerModel implements IKeyedControllerModel {
        public _controllerMap: {
            string: IController;
        };
        constructor(_controllerMap?: {
                string: IController;
            });
        public getControllerKey(controller: IController): string;
        public getControllers(): IController[];
        public setController(key: string, controller: IController, doNotFireEvent?: bool): void;
        public _getDescribedControllerKey(controller: IController): string;
        public _getDescribedController(key: string): IController;
        public createStateDescription(models?: IModel[]): any;
        public loadStateDescription(description: any): void;
    }
}
module templa.mvc.tab {
    var tabBarModelEventSelectedTabChange: string;
    var tabBarModelEventAvailableTabChange: string;
    interface ITabBarModel extends IModel {
        getSelectedTabId(): string;
        getAvailableTabIds(): string[];
        requestSelectTabId(tabId: string);
    }
}
module templa.mvc.composite {
    class MappedTabControllerModel extends MappedKeyedControllerModel implements tab.ITabBarModel {
        private _tabIdsToControllers;
        private _tabControllerKey;
        private _selectedTabId;
        constructor(selectedTabId: string, _tabIdsToControllers: {
                string: IController;
            }, _tabControllerKey: string, _controllerMap?: {
                string: IController;
            });
        public getSelectedTabId(): string;
        public getAvailableTabIds(): string[];
        public requestSelectTabId(tabId: string): void;
        public _setSelectedTabId(tabId: string, suppressModelChangeEvent?: bool): void;
        public createStateDescription(models?: IModel[]): any;
        public loadStateDescription(description: any): void;
        public _getDescribedControllers(): IController[];
        public _getDescribedControllerKey(controller: IController): string;
        public _getDescribedController(key: string): IController;
    }
}
module templa.mvc.element {
    interface IElementView extends IView {
        getRoots(): Node[];
    }
}
module templa.mvc.element {
    interface IElementViewFactory {
        create(container: IElementReference, prepend?: bool): IElementView;
    }
}
module templa.util.Elements {
    function find(attribute: string, value: string, nodes: Node[], filter?: (o: Node) => bool): Element;
    function getChildren(container: HTMLElement, filter?: (o: Node) => bool): Node[];
}
module templa.mvc.element {
    class AttributeElementReference implements IElementReference {
        private _view;
        private _attributeName;
        private _attributeValue;
        private _filter;
        constructor(_view: IElementView, _attributeName: string, _attributeValue: string, _filter?: (o: Node) => bool);
        public resolve(): Element;
    }
}
module templa.mvc.element {
    class AbstractElementController extends AbstractController {
        private _viewFactory;
        public _view: IElementView;
        constructor(_viewFactory: IElementViewFactory);
        public getView(): IView;
        public _doInit(container: IElementReference, prepend: bool): bool;
        public _doDestroy(detachView?: bool): bool;
    }
}
module templa.mvc.element {
    class DirectElementReference implements IElementReference {
        private _element;
        constructor(_element: Element);
        public resolve(): Element;
    }
}
module templa.mvc.element {
    class DocumentFragmentElementView implements IElementView {
        private _fragment;
        private _container;
        private _prepend;
        private _id;
        static createFromHTML(html: string, container: IElementReference, prepend: bool, id: string): DocumentFragmentElementView;
        private _attached;
        constructor(_fragment: DocumentFragment, _container: IElementReference, _prepend: bool, _id: string);
        public attach(): void;
        public detach(): void;
        public layout(): bool;
        public getRoots(): Node[];
    }
}
module templa.mvc.element {
    class DocumentFragmentElementViewFactory implements IElementViewFactory {
        private _html;
        constructor(_html?: string);
        public create(container: IElementReference, prepend?: bool): IElementView;
        public _createDiv(container: IElementReference, prepend: bool, html: string): IElementView;
    }
}
module templa.mvc.element {
    class ModeElementViewProxy implements IElementView {
        private _container;
        private _proxied;
        private _currentMode;
        private _modeFunction;
        constructor(_container: IElementReference, _proxied: IElementView, _currentMode: string, _modeFunction: (IElementReference: any) => string);
        public getRoots(): Node[];
        public attach(): void;
        public detach(): void;
        public layout(): bool;
    }
}
module templa.mvc.element {
    class ModeElementViewFactoryProxy implements IElementViewFactory {
        private _modeFunction;
        private _modesToFactories;
        constructor(_modeFunction: (IElementReference: any) => string, _modesToFactories: {
                string: IElementViewFactory;
            });
        public create(container: IElementReference, prepend?: bool): IElementView;
    }
}
module templa.template {
    interface ITemplateSource {
        resolve(): (any: any) => string;
    }
}
module templa.template {
    class StringHandlebarsTemplateSource extends loading.AbstractLoadable implements ITemplateSource {
        private _inputTemplate;
        private _template;
        constructor(_inputTemplate: string);
        public resolve(): (any: any) => string;
        public update(): bool;
        private compile();
    }
}
module templa.template {
    class ExternalHandlebarsTemplateSource extends loading.AbstractLoadable implements ITemplateSource {
        private _url;
        private _template;
        constructor(_url: string);
        public resolve(): (any: any) => string;
        public _doStartLoading(): void;
    }
}
module templa.mvc.element {
    class TemplateElementViewFactory extends DocumentFragmentElementViewFactory {
        private _templateSource;
        private _options;
        static createFromString(templateString: string, loadables?: templa.loading.ILoadable[], options?: any): TemplateElementViewFactory;
        static createFromURL(templateURL: string, loadables?: templa.loading.ILoadable[], options?: any): TemplateElementViewFactory;
        constructor(_templateSource: template.ITemplateSource, _options: any);
        public create(container: IElementReference, prepend?: bool): IElementView;
    }
}
module templa.mvc.element {
    class ViewRootElementReference implements IElementReference {
        private _view;
        constructor(_view: IElementView);
        public resolve(): Element;
    }
}
module templa.mvc.element.composite {
    class AbstractCompositeElementController extends AbstractElementController {
        public _controllers: IController[];
        private _controllerOnChangeListener;
        constructor(viewFactory: IElementViewFactory);
        public _doLoad(model: IModel): void;
        public clear(fireEvent?: bool): void;
        public _doStart(): bool;
        public _doStop(): bool;
        public _doInit(container: IElementReference, prepend: bool): bool;
        public _doDestroy(detachView?: bool): bool;
        public _add(controller: IController, fireEvent?: bool, layout?: bool, prepend?: bool): void;
        public _remove(controller: IController, detachView?: bool, layout?: bool): void;
        public _handleModelChangeEvent(event: ModelChangeEvent): void;
        public getControllerContainer(controller: IController): IElementReference;
        public getCommands(): Command[];
        public getTitle(): string;
        public layout(): void;
    }
}
module templa.mvc.element.jquery {
    interface IJQuerySelectorHandler {
        $(selector: string): JQuery;
    }
}
module templa.mvc.element.jquery {
    class JQueryElementReference implements IElementReference {
        private _selectorHandler;
        private _selector;
        constructor(_selectorHandler: IJQuerySelectorHandler, _selector: string);
        public resolve(): Element;
    }
}
module templa.mvc.element.jquery {
    class AbstractJQueryController extends AbstractElementController implements IJQuerySelectorHandler {
        constructor(_viewFactory: IElementViewFactory);
        public $(selector: string, roots?: Node[]): JQuery;
        public $reference(selector: string): IElementReference;
    }
}
module templa.mvc.element.jquery {
    class BorrowedElementView implements IElementView {
        private _container;
        private _selector;
        constructor(_container: IElementReference, _selector: string);
        public getRoots(): Node[];
        public attach(): void;
        public detach(): void;
        public layout(): bool;
    }
}
module templa.mvc.element.jquery {
    class BorrowedElementViewFactory implements IElementViewFactory {
        private _selector;
        constructor(_selector: string);
        public create(container: IElementReference, prefix?: bool): IElementView;
    }
}
module templa.mvc.element.jquery {
    class DimensionSettingElementViewProxy implements IElementView {
        private _proxied;
        private _variableDimensionSelector;
        private _fixedWidthSelectors;
        private _fixedHeightSelectors;
        private _widthAttribute;
        private _heightAttribute;
        private _maxHeightSelectors;
        constructor(_proxied: IElementView, _variableDimensionSelector: string, _fixedWidthSelectors: string[], _fixedHeightSelectors: string[], _widthAttribute?: string, _heightAttribute?: string, _maxHeightSelectors?: string[]);
        public getRoots(): Node[];
        public attach(): void;
        public detach(): void;
        public layout(): bool;
    }
}
module templa.mvc.element.jquery {
    class DimensionSettingElementViewProxyFactory implements IElementViewFactory {
        private _proxied;
        private _variableDimensionSelector;
        private _fixedWidthSelectors;
        private _fixedHeightSelectors;
        private _widthAttribute;
        private _heightAttribute;
        private _maxHeightSelectors;
        constructor(_proxied: IElementViewFactory, _variableDimensionSelector: string, _fixedWidthSelectors: string[], _fixedHeightSelectors: string[], _widthAttribute?: string, _heightAttribute?: string, _maxHeightSelectors?: string[]);
        public create(container: IElementReference, prepend?: bool): IElementView;
    }
}
module templa.mvc.element.jquery.command {
    class CommandJQueryViewDescription {
        private _view;
        private _actionElementSelector;
        constructor(_view: IElementView, _actionElementSelector: string);
        public view : IElementView;
        public actionElementSelector : string;
    }
}
module templa.mvc.element.jquery.command {
    interface ICommandJQueryViewDescriptionFactory {
        create(container: IElementReference, command: Command): CommandJQueryViewDescription;
    }
}
module templa.mvc.element.jquery.command {
    class IdDelegatingCommandJQueryViewDescriptionFactory implements ICommandJQueryViewDescriptionFactory {
        private _defaultDescriptionFactory;
        private _idsToDescriptionFactories;
        constructor(_defaultDescriptionFactory: ICommandJQueryViewDescriptionFactory, _idsToDescriptionFactories: {
                string: ICommandJQueryViewDescriptionFactory;
            });
        public create(container: IElementReference, command: Command): CommandJQueryViewDescription;
    }
}
module templa.mvc.element.jquery.command {
    class TemplateCommandJQueryViewDescriptionFactory implements ICommandJQueryViewDescriptionFactory {
        private _templateSource;
        private _options;
        static createFromString(templateString: string, loadables?: templa.loading.ILoadable[], options?: any): TemplateCommandJQueryViewDescriptionFactory;
        static createFromURL(templateURL: string, loadables?: templa.loading.ILoadable[], options?: any): TemplateCommandJQueryViewDescriptionFactory;
        constructor(_templateSource: template.ITemplateSource, _options?: any);
        public create(_container: IElementReference, _command: Command): CommandJQueryViewDescription;
    }
}
module templa.mvc.element.jquery.command {
    class ToolbarCommandJQueryController extends AbstractJQueryController {
        private _commandViewDescriptionFactory;
        private _backContainerSelector;
        private _generalContainerSelector;
        private _backViews;
        private _generalViews;
        constructor(_viewFactory: IElementViewFactory, _commandViewDescriptionFactory: ICommandJQueryViewDescriptionFactory, _backContainerSelector: string, _generalContainerSelector: string);
        public _doDestroy(detachView?: bool): bool;
        public _detachViews(): void;
        public _clear(): void;
        public _doLoad(model: IModel): void;
    }
}
module templa.mvc.element.jquery.composite {
    class AbstractCompositeJQueryController extends templa.mvc.element.composite.AbstractCompositeElementController implements IJQuerySelectorHandler {
        constructor(viewFactory: IElementViewFactory);
        public $(selector: string): JQuery;
        public $reference(selector: string): IElementReference;
        public getControllerContainer(controller: IController): IElementReference;
        public getControllerContainerSelector(controller: IController): string;
    }
}
module templa.mvc.element.jquery.composite {
    class KeyedJQueryController extends AbstractCompositeJQueryController {
        private _keysToSelectors;
        constructor(_viewFactory: IElementViewFactory, _keysToSelectors?: {
                string: string;
            });
        public setKeyAndSelector(key: string, selector: string): void;
        public getControllerContainerSelector(controller: IController): string;
    }
}
module templa.mvc.element.jquery.composite {
    interface IStackAnimationFactoryBundle {
        popAnimationFactory?: animation.element.IElementAnimationFactory;
        pushAnimationFactory?: animation.element.IElementAnimationFactory;
        selector?: string;
    }
    class StackJQueryController extends AbstractCompositeJQueryController {
        private _animationFactoryBundles;
        private _backCommand;
        private removedAnimatedChildren;
        constructor(viewFactory: IElementViewFactory, _animationFactoryBundles: IStackAnimationFactoryBundle[]);
        public animationFactoryBundles : IStackAnimationFactoryBundle[];
        public _handleModelChangeEvent(event: ModelChangeEvent): void;
        public _back(): void;
        public getCommands(): Command[];
        private _animate(animationFactoryName, animationCompletionListener?);
    }
}
module templa.mvc.loading {
    interface ILoadingControllerModel extends IModel, templa.loading.ILoadable {
    }
}
module templa.mvc.element.jquery.loading {
    class ProgressBarLoadingJQueryUIController extends AbstractJQueryController {
        private _progressBarSelector;
        constructor(_viewFactory: IElementViewFactory, _progressBarSelector?: string);
        public _doStart(): bool;
        public _increment(): void;
        public _doLoad(model: IModel): void;
    }
}
module templa.mvc.element.jquery.tab {
    class TabBarTabJQueryViewDescription {
        private _clickableElementSelector;
        private _styleableElementSelector;
        private _view;
        constructor(_clickableElementSelector: string, _styleableElementSelector: string, _view: IElementView);
        public clickableElementSelector : string;
        public styleableElementSelector : string;
        public view : IElementView;
    }
}
module templa.mvc.element.jquery.tab {
    interface ITabBarTabJQueryViewDescriptionFactory {
        create(container: IElementReference, tabBarId: string): TabBarTabJQueryViewDescription;
    }
}
module templa.mvc.element.jquery.tab {
    class MappedTabBarTabJQueryViewDescriptionFactory implements ITabBarTabJQueryViewDescriptionFactory {
        private _tabBarIdsToViewFactories;
        private _clickableElementSelector;
        private _styleableElementSelector;
        constructor(_tabBarIdsToViewFactories: {
                string: IElementViewFactory;
            }, _clickableElementSelector: string, _styleableElementSelector: string);
        public create(container: IElementReference, tabBarId: string): TabBarTabJQueryViewDescription;
    }
}
module templa.mvc.element.jquery.tab {
    class TabBarJQueryController extends AbstractJQueryController {
        private _tabBarTabViewDescriptionFactory;
        private _tabButtonContainerSelector;
        private _selectedTabClass;
        private _tabIdsToDescriptions;
        constructor(_viewFactory: IElementViewFactory, _tabBarTabViewDescriptionFactory: ITabBarTabJQueryViewDescriptionFactory, _tabButtonContainerSelector: string, _selectedTabClass: string);
        public _doLoad(model: IModel): void;
        private _removeAllTabs();
        private _requestSelectTabId(tabId);
        private _selectTab(selectedTabId);
        public _handleModelChangeEvent(event: ModelChangeEvent): void;
    }
}
module templa.mvc.history {
    class WebHistoryManager {
        private _controller;
        private _stateDescriptionChangeListener;
        private _historyChangeListener;
        private _model;
        private _modelStateChanges;
        private _modelStateChangeIndex;
        private _lastKnownData;
        constructor(_controller: IController);
        public push(modelStateChange: IModelStateChange, replace?: bool): void;
        public start(): void;
        public stop(): void;
    }
}
module templa.mvc.loading {
    class LoadableProxyingLoadingControllerModel extends AbstractModel implements ILoadingControllerModel {
        private _loadable;
        constructor(_loadable: templa.loading.ILoadable);
        public getLoadingProgress(): number;
        public getMaximumProgress(): number;
        public getErrors(): string[];
        public isComplete(): bool;
        public update(): bool;
        public requestStartLoading(callback?: (loadable: templa.loading.ILoadable, message: string) => void): bool;
    }
}
module templa.mvc.loading {
    class SwitchOnLoadingCompositeControllerModel extends composite.AbstractCompositeControllerModel implements composite.ICompositeControllerModel {
        private _loadingController;
        private _contentController;
        private _loadingModel;
        private _currentControllers;
        private _onChangeListener;
        constructor(_loadingController: IController, _contentController: IController, _loadingModel: ILoadingControllerModel);
        public _startedListening(): void;
        public _stoppedListening(): void;
        public getControllers(): IController[];
        public _getDescribedControllers(): IController[];
        public _checkCurrentController(): void;
    }
}
