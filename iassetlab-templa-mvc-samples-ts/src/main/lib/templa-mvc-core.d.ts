module Templa.Controller {
    interface IElementView {
        attach();
        detach();
        find(key: string): Element;
        getRoots(): Node[];
    }
}
module Templa.Controller {
    interface IElementViewFactory {
        create(container: Element): IElementView;
    }
}
module Templa {
    class ModelChangeEvent {
        private _changeType;
        private _data;
        constructor(_changeType?: string, _data?: any);
        public changeType : string;
        public data : any;
    }
}
module Templa {
    interface IModel {
        addOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void);
        removeOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void);
    }
}
module Templa {
    interface IController {
        setModel(model: IModel);
        init(container: Element);
        load();
        start();
        stop();
        destroy();
    }
}
module Templa.Controller {
    class AbstractElementViewController implements IController {
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
module Templa.Controller.Composite {
    interface ICompositeControllerModel extends IModel {
        getControllers(): IController[];
    }
}
module Templa.Controller.Composite {
    class AbstractCompositeController extends AbstractElementViewController {
        private _controllers;
        constructor(viewFactory: IElementViewFactory);
        public _load(model: IModel): void;
        public clear(): void;
        public add(controller: IController): void;
        public getControllerContainer(controller: IController): Node;
    }
}
module Templa.Controller.Composite.Stack {
    interface IStackControllerModel extends ICompositeControllerModel {
        isStackEmpty(): bool;
        canPop(): bool;
        requestPop(): void;
    }
}
module Templa.Controller.Composite.Stack {
    class StackController extends AbstractCompositeController {
    }
}
module Templa.Controller.View {
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
module Templa.Controller.View {
    class HTMLElementViewFactory implements IElementViewFactory {
        private _html;
        constructor(_html: string);
        public create(container: Element): IElementView;
    }
}
module Templa.Model {
    class AbstractModel implements IModel {
        private modelOnChangeListeners;
        constructor();
        public addOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void): void;
        public removeOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void): void;
        public _fireModelChangeEvent(changeEvent: ModelChangeEvent): void;
    }
}
