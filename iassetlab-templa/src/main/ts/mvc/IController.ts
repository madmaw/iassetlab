///<reference path="IModel.ts"/>
///<reference path="Command.ts"/>
///<reference path="ControllerChangeEvent.ts"/>
///<reference path="IView.ts"/>
///<reference path="../animation/IAnimation.ts"/>

module templa.mvc {

    export var ControllerStateUninitialized = 0;
    export var ControllerStateInitialized   = 1;
    export var ControllerStateStarted       = 2;


    export interface IController {
        getModel(): IModel;

        load();

        start(): boolean;

        stop(): boolean;

        destroy(detachView?:boolean): boolean;

        getState(): number;

        getCommands(): Command[];

        getTitle(): string;

        getView(): IView;

        addOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void );

        removeOnChangeListener(listener: (source: IController, changeEvent: ControllerChangeEvent) => void );

        addAnimation(animation: templa.animation.IAnimation);

        layout(): void;
    }

}