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
        private _modelOnChangeListeners;
        constructor();
        public addOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void): void;
        public removeOnChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void): void;
        public _startedListening(): void;
        public _stoppedListening(): void;
        public _fireModelChangeEvent(changeEvent: ModelChangeEvent): void;
    }
}
module Templa.MVC {
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
module Templa.MVC.Commands {
    interface ICommandsControllerModel extends IModel {
        getCommands(): Command[];
    }
}
module Templa.MVC {
    class ControllerChangeEvent {
        private _commandsChanged;
        private _titleChanged;
        constructor(_commandsChanged: bool, _titleChanged: bool);
        public commandsChanged : bool;
        public titleChanged : bool;
    }
}
module Templa.MVC {
    var ControllerStateUninitialized: number;
    var ControllerStateInitialized: number;
    var ControllerStateStarted: number;
    interface IController {
        setModel(model: IModel);
        init(container: Element);
        load();
        start();
        stop();
        destroy();
        getState(): number;
        getCommands(): Command[];
        getTitle(): string;
        addOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void);
        removeOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void);
    }
}
module Templa.MVC.Commands {
    class CommandsControllerModelAdapter extends AbstractModel implements ICommandsControllerModel {
        private _controller;
        private _listener;
        constructor(_controller: IController);
        public getCommands(): Command[];
        public _startedListening(): void;
        public _stoppedListening(): void;
    }
}
module Templa.MVC.Composite {
    interface ICompositeControllerModel extends IModel {
        getControllers(): IController[];
    }
}
module Templa.MVC.Composite {
    interface IKeyedControllerModel extends ICompositeControllerModel {
        getControllerKey(controller: IController): string;
    }
}
module Templa.MVC.Composite {
    interface IStackControllerModel extends ICompositeControllerModel {
        isStackEmpty(): bool;
        canPop(): bool;
        requestPop(): void;
    }
}
