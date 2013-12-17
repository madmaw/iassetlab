/// <reference path="rison.d.ts" />
/// <reference path="jquery.d.ts" />
/// <reference path="handlebars.d.ts" />
declare module templa.animation {
    class AnimationStateChangeEvent {
        private _animationState;
        constructor(_animationState: string);
        public getAnimationState(): string;
    }
}
declare module templa.animation {
    var animationStateCreated: string;
    var animationStateInitialized: string;
    var animationStateStopped: string;
    var animationStateStarted: string;
    var animationStateFinished: string;
    interface IAnimation {
        getState(): string;
        init(): any;
        start(): any;
        destroy(): any;
        addAnimationListener(listener: (source: IAnimation, changeEvent: animation.AnimationStateChangeEvent) => void): any;
        removeAnimationListener(listener: (source: IAnimation, changeEvent: animation.AnimationStateChangeEvent) => void): any;
    }
}
declare module templa.util.Arrays {
    function removeElement(array: any[], element: any): boolean;
    function pushAll(into: any[], elements: any[]): void;
    function copy(array: any[]): any[];
    function create2DArray(width: number, height: number): any[][];
}
declare module templa.animation {
    class AbstractAnimation implements animation.IAnimation {
        private _state;
        private _animationChangeListeners;
        constructor();
        public getState(): string;
        public init(): void;
        public _doInit(): boolean;
        public start(): void;
        public _doStart(): boolean;
        public destroy(): void;
        public _doDestroy(): boolean;
        public _fireAnimationStateChangeEvent(changeEvent: animation.AnimationStateChangeEvent): void;
        public addAnimationListener(listener: (source: animation.IAnimation, changeEvent: animation.AnimationStateChangeEvent) => void): void;
        public removeAnimationListener(listener: (source: animation.IAnimation, changeEvent: animation.AnimationStateChangeEvent) => void): void;
    }
}
declare module templa.loading {
    interface ILoadable {
        getLoadingProgress(): number;
        getMaximumProgress(): number;
        getErrors(): string[];
        isComplete(): boolean;
        /**
        * update a synchronous loading thing, return true if it isn't finished (requires another call), false if it is
        */
        update(): boolean;
        /**
        * return true if the loading requires calls to update, false if it is asynchronous
        */
        requestStartLoading(callback?: (loadable: ILoadable, message: string) => void): boolean;
    }
}
declare module templa.loading {
    class AbstractLoadable implements loading.ILoadable {
        private _maximumProgress;
        private _synchronous;
        private _loadingProgress;
        private _errors;
        private _callback;
        constructor(_maximumProgress: number, _synchronous: boolean);
        public getLoadingProgress(): number;
        public getMaximumProgress(): number;
        public getErrors(): string[];
        public isComplete(): boolean;
        public update(): boolean;
        public requestStartLoading(callback?: (source: loading.ILoadable, message: string) => void): boolean;
        public _doStartLoading(): void;
        public _pushError(error: string): void;
        public _setLoadingProgress(loadingProgress: number, message?: string, maximumProgress?: number): void;
        public _fireLoadingEvent(message?: string): void;
    }
}
declare module templa.loading {
    class CompositeLoadable implements loading.ILoadable {
        private _synchronousLoadables;
        private _loadables;
        constructor(loadables?: loading.ILoadable[]);
        public getLoadingProgress(): number;
        public getMaximumProgress(): number;
        public getErrors(): string[];
        public isComplete(): boolean;
        public update(): boolean;
        public requestStartLoading(callback?: (loadable: loading.ILoadable, message: string) => void): boolean;
    }
}
declare module templa.mvc {
    class ModelChangeDescription {
        private _changeType;
        constructor(_changeType: string);
        public getChangeType(): string;
    }
}
declare module templa.mvc {
    class ModelChangeEvent {
        private _descriptions;
        constructor(_changeType?: string);
        constructor(_modelChangeDescription?: mvc.ModelChangeDescription);
        constructor(_modelChangeDescriptions?: mvc.ModelChangeDescription[]);
        public lookup(changeType: string): any;
    }
}
declare module templa.mvc {
    interface IModelStateChange {
        undo(): void;
        redo(): void;
    }
}
declare module templa.mvc {
    interface IModel {
        addOnChangeListener(listener: (source: IModel, changeEvent: mvc.ModelChangeEvent) => void): any;
        removeOnChangeListener(listener: (source: IModel, changeEvent: mvc.ModelChangeEvent) => void): any;
        addStateDescriptionChangeListener(listener: (source: IModel, change: mvc.IModelStateChange) => void): any;
        removeStateDescriptionChangeListener(listener: (source: IModel, change: mvc.IModelStateChange) => void): any;
        createStateDescription(models?: IModel[]): any;
        loadStateDescription(description: any): any;
    }
}
declare module templa.mvc {
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
        public getPriority(): number;
        public getCommandType(): number;
        public setEnabled(_enabled: boolean): void;
        public getEnabled(): boolean;
        public getId(): string;
        public getAction(): () => void;
    }
}
declare module templa.mvc {
    class ControllerChangeEvent {
        private _commandsChanged;
        private _titleChanged;
        private _modelChanged;
        private _previousModel;
        constructor(_commandsChanged: boolean, _titleChanged: boolean, _modelChanged?: boolean, _previousModel?: mvc.IModel);
        public getCommandsChanged(): boolean;
        public getTitleChanged(): boolean;
        public getModelChanged(): boolean;
        public getPreviousModel(): mvc.IModel;
    }
}
declare module templa.mvc {
    interface IView {
        attach(): void;
        detach(): void;
        /**
        * called when the view should check it's layout (typically on the window resizing), return true if the controller should
        * recreate itself entirely (stop, destroy, init, start) because the view needs to change elements. If returning true, then
        * the call to layout should do nothing (the controller will destroy/recreate anyway)
        */
        layout(): boolean;
    }
}
declare module templa.mvc {
    var ControllerStateUninitialized: number;
    var ControllerStateInitialized: number;
    var ControllerStateStarted: number;
    interface IController {
        getModel(): mvc.IModel;
        load(): any;
        start(): boolean;
        stop(): boolean;
        destroy(detachView?: boolean): boolean;
        getState(): number;
        getCommands(): mvc.Command[];
        getTitle(): string;
        getView(): mvc.IView;
        addOnChangeListener(listener: (source: IController, changeEvent: mvc.ControllerChangeEvent) => void): any;
        removeOnChangeListener(listener: (source: IController, changeEvent: mvc.ControllerChangeEvent) => void): any;
        addAnimation(animation: templa.animation.IAnimation): any;
        layout(): void;
    }
}
declare module templa.mvc {
    interface IControllerWithModel<ModelType extends mvc.IModel> extends mvc.IController {
        setModel(model: ModelType): void;
    }
}
declare module templa.mvc {
    class AbstractController<ModelType extends mvc.IModel> implements mvc.IControllerWithModel<ModelType> {
        public _model: ModelType;
        private _commands;
        private _state;
        private _animations;
        private _animationListener;
        private _modelOnChangeListener;
        private _controllerOnChangeListeners;
        constructor();
        public getModel(): ModelType;
        public setModel(model: ModelType): void;
        public _init(): boolean;
        public _doInit(): boolean;
        public load(): void;
        public _doLoad(model: ModelType): void;
        public getView(): mvc.IView;
        public _handleModelChangeEvent(event: mvc.ModelChangeEvent): void;
        public start(): boolean;
        public _doStart(): boolean;
        public stop(): boolean;
        public _doStop(): boolean;
        public destroy(detachView?: boolean): boolean;
        public _doDestroy(detachView?: boolean): boolean;
        public getState(): number;
        public getCommands(): mvc.Command[];
        public setCommands(commands: mvc.Command[]): void;
        public getTitle(): string;
        public addOnChangeListener(listener: (source: mvc.IController, changeEvent: mvc.ControllerChangeEvent) => void): void;
        public removeOnChangeListener(listener: (source: mvc.IController, changeEvent: mvc.ControllerChangeEvent) => void): void;
        public _fireControllerChangeEvent(controllerChangeEvent: mvc.ControllerChangeEvent): void;
        public addAnimation(animation: templa.animation.IAnimation): void;
        public layout(): void;
        public _reinitialize(): void;
        public _isAnimating(): boolean;
        public _clearAnimations(): void;
        public _addAnimation(animation: templa.animation.IAnimation, doNotStart?: boolean): void;
        public _removeAnimation(animation: templa.animation.IAnimation, doNotDestroy?: boolean): void;
        public _safeTimeout(f: () => void, millis: number): void;
    }
}
declare module templa.mvc {
    class AbstractModel implements mvc.IModel {
        private _modelOnChangeListeners;
        private _stateDescriptionChangeListeners;
        public _listeningForTokenChanges: boolean;
        constructor();
        public addOnChangeListener(listener: (source: mvc.IModel, changeEvent: mvc.ModelChangeEvent) => void): void;
        public removeOnChangeListener(listener: (source: mvc.IModel, changeEvent: mvc.ModelChangeEvent) => void): void;
        public _startedListening(): void;
        public _stoppedListening(): void;
        public _fireModelChangeEvent(changeDescription?: string, suppressFireStateTokenChange?: boolean): any;
        public _fireModelChangeEvent(changeDescription?: mvc.ModelChangeDescription, suppressFireStateTokenChange?: boolean): any;
        public _fireModelChangeEvent(changeEvent?: mvc.ModelChangeEvent, suppressFireStateTokenChange?: boolean): any;
        public addStateDescriptionChangeListener(listener: (source: mvc.IModel, change: mvc.IModelStateChange) => void): void;
        public removeStateDescriptionChangeListener(listener: (source: mvc.IModel, change: mvc.IModelStateChange) => void): void;
        public _startedListeningForStateDescriptionChanges(): void;
        public _stoppedListeningForStateDescriptionChanges(): void;
        public _fireStateDescriptionChangeEvent(source: mvc.IModel, change?: mvc.IModelStateChange): void;
        public createStateDescription(models?: mvc.IModel[]): any;
        public loadStateDescription(description: any): void;
        public _checkModels(models: mvc.IModel[]): mvc.IModel[];
    }
}
declare module templa.mvc {
    class AbstractModelProxy extends mvc.AbstractModel implements mvc.IModel {
        private _model;
        private _onChangeListener;
        private _onStateChangeListener;
        constructor(_model: mvc.IModel);
        public _startedListening(): void;
        public _stoppedListening(): void;
        public _startedListeningForStateDescriptionChanges(): void;
        public _stoppedListeningForStateDescriptionChanges(): void;
        public createStateDescription(models?: mvc.IModel[]): any;
        public loadStateDescription(description: any): void;
    }
}
declare module templa.mvc.command {
    interface ICommandControllerModel extends mvc.IModel {
        getCommands(): mvc.Command[];
    }
}
declare module templa.mvc.command {
    class CommandControllerModelAdapter extends mvc.AbstractModel implements command.ICommandControllerModel {
        private _controller;
        private _listener;
        constructor(_controller: mvc.IController);
        public getCommands(): mvc.Command[];
        public _startedListening(): void;
        public _stoppedListening(): void;
    }
}
declare module templa.mvc.composite {
    var compositeControllerModelEventControllersChanged: string;
    interface ICompositeControllerModel extends mvc.IModel {
        getControllers(): mvc.IController[];
    }
}
declare module templa.mvc.composite {
    class AbstractCompositeControllerModel extends mvc.AbstractModel implements composite.ICompositeControllerModel {
        public _stateDescriptionChangeListener: (source: mvc.IModel, change: mvc.IModelStateChange) => void;
        private _controllerChangeListener;
        private _previouslyDescribedControllers;
        constructor();
        public _getDescribedControllers(): mvc.IController[];
        public getControllers(): mvc.IController[];
        public _startedListeningForStateDescriptionChanges(): void;
        private _startListeningForStateDescriptionChanges();
        public _stoppedListeningForStateDescriptionChanges(): void;
        private _stopListeningForStateDescriptionChanges();
        public _updateListeningForStateDescriptionChanges(): void;
        public createStateDescription(models?: mvc.IModel[]): any;
        public loadStateDescription(description: any): void;
    }
}
declare module templa.mvc.composite {
    var stackControllerModelEventPushed: string;
    var stackControllerModelEventPopped: string;
    interface IStackControllerModel extends composite.ICompositeControllerModel {
        isStackEmpty(): boolean;
        canPop(): boolean;
        requestPop(): void;
    }
}
declare module templa.mvc.composite {
    class StackControllerModelChangeDescription extends mvc.ModelChangeDescription {
        private _removedController;
        private _addedController;
        private _silentRemovedControllers;
        private _silentAddedControllers;
        constructor(changeType: string, _removedController: mvc.IController, _addedController: mvc.IController, _silentRemovedControllers?: mvc.IController[], _silentAddedControllers?: mvc.IController[]);
        public getRemovedController(): mvc.IController;
        public getAddedController(): mvc.IController;
        public getSilentRemovedControllers(): mvc.IController[];
        public getSilentAddedControllers(): mvc.IController[];
    }
}
declare module templa.mvc.composite {
    interface IAbstractStackControllerModelEntry {
        controller: mvc.IController;
        data?: any;
    }
    class AbstractStackControllerModelPushChange implements mvc.IModelStateChange {
        private _model;
        private _entry;
        constructor(_model: AbstractStackControllerModel, _entry: IAbstractStackControllerModelEntry);
        public undo(): void;
        public redo(): void;
    }
    class AbstractStackControllerModelPopChange implements mvc.IModelStateChange {
        private _model;
        private _entry;
        constructor(_model: AbstractStackControllerModel, _entry: IAbstractStackControllerModelEntry);
        public undo(): void;
        public redo(): void;
    }
    class AbstractStackControllerModel extends composite.AbstractCompositeControllerModel implements composite.IStackControllerModel {
        private _allowEmptyStack;
        public _controllersToDisplay: number;
        public _stack: IAbstractStackControllerModelEntry[];
        constructor(_allowEmptyStack?: boolean, _controllersToDisplay?: number);
        public _setControllersToDisplay(_controllersToDisplay: number): void;
        public getControllers(): mvc.IController[];
        public _getDescribedControllers(): mvc.IController[];
        public isStackEmpty(): boolean;
        public canPop(): boolean;
        public requestPop(): void;
        public _ensureVisible(controller: mvc.IController, suppressFireDescriptionChangeEvent?: boolean): boolean;
        public _popTo(controller: mvc.IController, suppressFireDescriptionChangeEvent?: boolean): void;
        public _deStack(controller: mvc.IController, suppressFireModelChangeEvent?: boolean, suppressFireDescriptionChangeEvent?: boolean): void;
        public _pop(suppressFireModelChangeEvent?: boolean, suppressFireDescriptionChangeEvent?: boolean): IAbstractStackControllerModelEntry;
        public _push(controller: mvc.IController, data?: any, suppressFireModelChangeEvent?: boolean, suppressFireDescriptionChangeEvent?: boolean): void;
        public _contains(controller: mvc.IController): boolean;
        public _indexOf(controller: mvc.IController): number;
        public _pushEntryGetChange(entry: IAbstractStackControllerModelEntry, suppressFireModelChangeEvent?: boolean): mvc.IModelStateChange;
        public _pushEntry(entry: IAbstractStackControllerModelEntry, suppressFireModelChangeEvent?: boolean, suppressFireDescriptionChangeEvent?: boolean): void;
        public peek(): mvc.IController;
        public createStateDescription(models?: mvc.IModel[]): any;
        public loadStateDescription(description: any): void;
        public _entryToDescription(entry: IAbstractStackControllerModelEntry, models: mvc.IModel[]): any;
        public _createEntryFromDescription(description: any): IAbstractStackControllerModelEntry;
    }
}
declare module templa.mvc.composite {
    class AbstractDescriptiveStackControllerModel extends composite.AbstractStackControllerModel {
        private _controllerFactories;
        constructor(allowEmptyStack?: boolean, controllersToDisplay?: number);
        public setControllerFactory(key: string, factory: (data: any) => mvc.IController): void;
        public _entryToDescription(entry: composite.IAbstractStackControllerModelEntry, models?: mvc.IModel[]): any;
        public _createEntryFromDescription(description: any): composite.IAbstractStackControllerModelEntry;
    }
}
declare module templa.mvc.composite {
    interface IKeyedControllerModel extends composite.ICompositeControllerModel {
        getControllerKey(controller: mvc.IController): string;
    }
}
declare module templa.mvc.composite {
    /**
    * basic implementation of a generic mapped controller
    */
    class MappedKeyedControllerModel extends composite.AbstractCompositeControllerModel implements composite.IKeyedControllerModel {
        public _controllerMap: {
            [_: string]: mvc.IController;
        };
        constructor(_controllerMap?: {
            [_: string]: mvc.IController;
        });
        public getControllerKey(controller: mvc.IController): string;
        public getControllers(): mvc.IController[];
        public setController(key: string, controller: mvc.IController, doNotFireEvent?: boolean): void;
        public _getDescribedControllerKey(controller: mvc.IController): string;
        public _getDescribedController(key: string): mvc.IController;
        public createStateDescription(models?: mvc.IModel[]): any;
        public loadStateDescription(description: any): void;
    }
}
declare module templa.mvc.tab {
    var tabBarModelEventSelectedTabChange: string;
    var tabBarModelEventAvailableTabChange: string;
    interface ITabBarModel extends mvc.IModel {
        getSelectedTabId(): string;
        getAvailableTabIds(): string[];
        requestSelectTabId(tabId: string): any;
    }
}
declare module templa.mvc.composite {
    /**
    * combined tab bar and composite model for common tab-bar behavior
    */
    class MappedTabControllerModel extends composite.MappedKeyedControllerModel implements mvc.tab.ITabBarModel {
        private _tabIdsToControllers;
        private _tabControllerKey;
        private _selectedTabId;
        constructor(selectedTabId: string, _tabIdsToControllers: {
            [_: string]: mvc.IController;
        }, _tabControllerKey: string, _controllerMap?: {
            [_: string]: mvc.IController;
        });
        public getSelectedTabId(): string;
        public getAvailableTabIds(): string[];
        public requestSelectTabId(tabId: string): void;
        public _setSelectedTabId(tabId: string, suppressModelChangeEvent?: boolean): void;
        public createStateDescription(models?: mvc.IModel[]): any;
        public loadStateDescription(description: any): void;
        public _getDescribedControllers(): mvc.IController[];
        public _getDescribedControllerKey(controller: mvc.IController): string;
        public _getDescribedController(key: string): mvc.IController;
    }
}
declare module templa.mvc.history {
    class WebHistoryManager {
        private _controller;
        private _stateDescriptionChangeListener;
        private _historyChangeListener;
        private _model;
        private _modelStateChanges;
        private _modelStateChangeIndex;
        private _lastKnownData;
        constructor(_controller: mvc.IController);
        public push(modelStateChange: mvc.IModelStateChange, replace?: boolean): void;
        public start(): void;
        public stop(): void;
    }
}
declare module templa.mvc.list {
    interface IListControllerModel extends mvc.IModel {
        getController(index: number, reuseController: mvc.IController): mvc.IController;
        getControllerType(index: number): string;
        getControllerCount(): number;
    }
}
declare module templa.mvc.loading {
    interface ILoadingControllerModel extends mvc.IModel, templa.loading.ILoadable {
    }
}
declare module templa.mvc.loading {
    class LoadableProxyingLoadingControllerModel extends mvc.AbstractModel implements loading.ILoadingControllerModel {
        private _loadable;
        constructor(_loadable: templa.loading.ILoadable);
        public getLoadingProgress(): number;
        public getMaximumProgress(): number;
        public getErrors(): string[];
        public isComplete(): boolean;
        public update(): boolean;
        public requestStartLoading(callback?: (loadable: templa.loading.ILoadable, message: string) => void): boolean;
    }
}
declare module templa.mvc.loading {
    class SwitchOnLoadingCompositeControllerModel extends mvc.composite.AbstractCompositeControllerModel implements mvc.composite.ICompositeControllerModel {
        private _loadingController;
        private _contentController;
        private _loadingModel;
        private _currentControllers;
        private _onChangeListener;
        constructor(_loadingController: mvc.IController, _contentController: mvc.IController, _loadingModel: loading.ILoadingControllerModel);
        public _startedListening(): void;
        public _stoppedListening(): void;
        public getControllers(): mvc.IController[];
        public _getDescribedControllers(): mvc.IController[];
        public createStateDescription(models?: mvc.IModel[]): any;
        public loadStateDescription(description: any): any;
        public _checkCurrentController(): void;
    }
}
declare module templa.mvc.table {
    class TableHeader {
        private _controller;
        private _fromIndex;
        private _span;
        constructor(_controller: mvc.IController, _fromIndex: number, _span: number);
        public getController(): mvc.IController;
        public getFromIndex(): number;
        public getSpan(): number;
    }
}
declare module templa.mvc.table {
    interface ITableControllerModel extends mvc.IModel {
        getRowCount(): number;
        getColumnCount(): number;
        getRowHeaderDepth(): number;
        getColumnHeaderDepth(): number;
        getRowHeader(row: number, depth: number): table.TableHeader;
        getColumnHeader(column: number, depth: number): table.TableHeader;
        getCell(row: number, column: number): mvc.IController;
    }
}
declare module templa.mvc.table {
    class AbstractTableControllerModel extends mvc.AbstractModel implements table.ITableControllerModel {
        private _rowCount;
        private _columnCount;
        private _rowHeaderDepth;
        private _columnHeaderDepth;
        private _cells;
        private _rowHeaders;
        private _columnHeaders;
        constructor(_rowCount: number, _columnCount: number, _rowHeaderDepth: number, _columnHeaderDepth: number);
        public getRowCount(): number;
        public getColumnCount(): number;
        public getRowHeaderDepth(): number;
        public getColumnHeaderDepth(): number;
        public getRowHeaders(): table.TableHeader[][];
        public getRowHeader(row: number, depth: number): table.TableHeader;
        public setRowHeader(header: table.TableHeader, depth: number): void;
        public getColumnHeaders(): table.TableHeader[][];
        public getColumnHeader(column: number, depth: number): table.TableHeader;
        public setColumnHeader(header: table.TableHeader, depth: number): void;
        public getCell(row: number, column: number): mvc.IController;
        public setCell(row: number, column: number, cell: mvc.IController): void;
    }
}
declare module templa.mvc.table {
    class TableHeaderTree {
        private _controller;
        private _children;
        static populate(headerTrees: TableHeaderTree[], tableHeaders?: table.TableHeader[][], depthOffset?: number, breadthOffset?: number): table.TableHeader[][];
        constructor(_controller: mvc.IController, _children?: TableHeaderTree[]);
        public getDepth(): number;
        public getBreadth(): number;
        public populateTableHeaders(tableHeaders: table.TableHeader[][], depthOffset: number, breadthOffset: number): void;
    }
}
declare module templa.template {
    interface ITemplateSource {
        resolve(): (any: any) => string;
    }
}
declare module templa.template {
    class ExternalHandlebarsTemplateSource extends templa.loading.AbstractLoadable implements template.ITemplateSource {
        private _url;
        private _template;
        constructor(_url: string);
        public resolve(): (any: any) => string;
        public _doStartLoading(): void;
    }
}
declare module templa.template {
    class StringHandlebarsTemplateSource extends templa.loading.AbstractLoadable implements template.ITemplateSource {
        private _inputTemplate;
        private _template;
        constructor(_inputTemplate: string);
        public resolve(): (any: any) => string;
        public update(): boolean;
        private compile();
    }
}
declare module templa.util.Elements {
    function find(attribute: string, value: string, nodes: Node[], filter?: (o: Node) => boolean): Element;
    function getChildren(container: HTMLElement, filter?: (o: Node) => boolean): Node[];
}
declare module templa.util.Strings {
    function format(format: string, params: any[]): string;
}
