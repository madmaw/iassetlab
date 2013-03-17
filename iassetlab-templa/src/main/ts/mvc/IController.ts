///<reference path="IModel.ts"/>
///<reference path="Command.ts"/>
///<reference path="ControllerChangeEvent.ts"/>

module templa.mvc {

    export var ControllerStateUninitialized = 0;
    export var ControllerStateInitialized   = 1;
    export var ControllerStateStarted       = 2;


    export interface IController {

        setModel(model:IModel);

        init(container:Element):bool;

        load();

        start(): bool;

        stop(): bool;

        destroy(): bool;

        getState(): number;

        getCommands(): Command[];

        getTitle(): string;

        addOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void );

        removeOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void );

    }

}