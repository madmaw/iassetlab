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
        private _modelOnChangeListener;
        constructor(_viewFactory: IElementViewFactory);
        public setModel(model: IModel): void;
        public init(container: Element): void;
        public load(): void;
        public _load(model: IModel): void;
        public handleModelChangeEvent(event: ModelChangeEvent): void;
        public start(): void;
        public stop(): void;
        public destroy(): void;
        public _find(key: string): Element;
    }
}
module Templa.MVC.Element.Composite {
    class AbstractCompositeElementController extends AbstractElementController {
        private _controllers;
        constructor(viewFactory: IElementViewFactory);
        public _load(model: IModel): void;
        public clear(): void;
        public add(controller: IController): void;
        public getControllerContainer(controller: IController): Node;
    }
}
module Templa.MVC.Element.Composite {
    class StackElementController extends AbstractCompositeElementController {
    }
}
module Templa.MVC.Element {
    class HTMLElementView implements IElementView {
        private _html;
        private _container;
        constructor(_html: string, _container: HTMLElement);
        public attach(): void;
        public detach(): void;
        public find(key: string): Element;
        private _find(key, nodes);
        public getRoots(container?: HTMLElement): Node[];
    }
}
module Templa.MVC.Element {
    class HTMLElementViewFactory implements IElementViewFactory {
        private _html;
        constructor(_html: string);
        public create(container: Element): IElementView;
    }
}
