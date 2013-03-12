module Templa.MVC {
    class ModelChangeEvent {
        private _changeType;
        private _data;
        constructor(_changeType?: string, _data?: any);
        public changeType : string;
        public data : any;
    }
}
module Templa.MVC {
    interface IModel {
        addOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void);
        removeOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void);
    }
}
module Templa.MVC {
    class AbstractModel implements IModel {
        private modelOnChangeListeners;
        constructor();
        public addOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void): void;
        public removeOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void): void;
        public _fireModelChangeEvent(changeEvent: ModelChangeEvent): void;
    }
}
module Templa.MVC {
    interface IController {
        setModel(model: IModel);
        init(container: Element);
        load();
        start();
        stop();
        destroy();
    }
}
module Templa.MVC.Composite {
    interface ICompositeControllerModel extends IModel {
        getControllers(): IController[];
    }
}
module Templa.MVC.Composite {
    interface IStackControllerModel extends ICompositeControllerModel {
        isStackEmpty(): bool;
        canPop(): bool;
        requestPop(): void;
    }
}
