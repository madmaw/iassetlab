module Templa.MVC.Element {
    interface IElementView {
        attach();
        detach();
        find(key: string): Element;
        getRoots(): Node[];
    }
}
module Templa.MVC.Element {
    interface IElementViewFactory {
        create(container: Element): IElementView;
    }
}
module Templa.MVC.Element {
    class AbstractElementController implements IController {
        public _view: IElementView;
        public _model: IModel;
        private _viewFactory;
        private _commands;
        private _state;
        private _modelOnChangeListener;
        private _controllerOnChangeListeners;
        constructor(_viewFactory: IElementViewFactory);
        public setModel(model: IModel): void;
        public init(container: Element): void;
        public load(): void;
        public _load(model: IModel): void;
        public handleModelChangeEvent(event: ModelChangeEvent): void;
        public start(): void;
        public stop(): void;
        public destroy(): void;
        public getState(): number;
        public _find(key: string): Element;
        public getCommands(): Command[];
        public setCommands(commands: Command[]): void;
        public getTitle(): string;
        public addOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void): void;
        public removeOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void): void;
        public _fireControllerChangeEvent(controllerChangeEvent: ControllerChangeEvent): void;
    }
}
module Templa.MVC.Element.Commands {
    class ActionElementView {
        private _view;
        private _actionElementKey;
        constructor(_view: IElementView, _actionElementKey: string);
        public view : IElementView;
        public actionElementKey : string;
    }
}
module Templa.MVC.Element.Commands {
    interface ICommandElementViewFactory {
        create(container: Element, command: Command): ActionElementView;
    }
}
module Templa.MVC.Element.Commands {
    class SimpleCommandElementViewFactory implements ICommandElementViewFactory {
        private _viewFactory;
        private _actionKey;
        constructor(_viewFactory: IElementViewFactory, _actionKey: string);
        public create(container: Element, command: Command): ActionElementView;
    }
}
module Templa.MVC.Element.Commands {
    class ToolbarCommandsElementController extends AbstractElementController {
        private _commandViewFactory;
        private _backContainerKey;
        private _generalContainerKey;
        private _backViews;
        private _generalViews;
        constructor(_viewFactory: IElementViewFactory, _commandViewFactory: ICommandElementViewFactory, _backContainerKey: string, _generalContainerKey: string);
        public _clear(): void;
        public _load(model: IModel): void;
    }
}
module Templa.MVC.Element.Composite {
    class AbstractCompositeElementController extends AbstractElementController {
        private _controllers;
        constructor(viewFactory: IElementViewFactory);
        public _load(model: IModel): void;
        public clear(): void;
        public add(controller: IController): void;
        public remove(controller: IController): void;
        public getControllerContainer(controller: IController): Node;
        public getCommands(): Command[];
        public getTitle(): string;
    }
}
module Templa.MVC.Element.Composite {
    class KeyedElementController extends AbstractCompositeElementController {
        constructor(_viewFactory: IElementViewFactory);
        public getControllerContainer(controller: IController): Node;
    }
}
module Templa.MVC.Element.Composite {
    class StackElementController extends AbstractCompositeElementController {
        private _backCommand;
        constructor(viewFactory: IElementViewFactory);
        public _back(): void;
    }
}
module Templa.MVC.Element {
    class HTMLElementView implements IElementView {
        private _html;
        private _container;
        private _div;
        private _id;
        constructor(_html: string, _container: HTMLElement, _id: string);
        public attach(): void;
        public detach(): void;
        public find(key: string): Element;
        private _find(attribute, value, nodes);
        public getRoots(): Node[];
        public getChildren(container?: HTMLElement): Node[];
    }
}
module Templa.MVC.Element {
    class DivElementViewFactory implements IElementViewFactory {
        private _html;
        constructor(_html: string);
        public create(container: Element): IElementView;
    }
}
