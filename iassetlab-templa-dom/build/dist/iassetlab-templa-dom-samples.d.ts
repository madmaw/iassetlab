/// <reference path="../defs/iassetlab-templa.d.ts" />
/// <reference path="iassetlab-templa-dom.d.ts" />
/// <reference path="../defs/jquery.d.ts" />
declare module templa.dom.samples.mvc.controller.text_input {
    interface ITextInputModel extends templa.mvc.IModel {
        getValue(): string;
        requestSubmit(value: string): any;
    }
}
declare module templa.dom.samples.mvc.controller.text_input {
    class TextInputController extends dom.mvc.jquery.AbstractJQueryController<text_input.ITextInputModel> {
        private _inputElementSelector;
        private _buttonElementSelector;
        constructor(_viewFactory: dom.mvc.IElementViewFactory, _inputElementSelector: string, _buttonElementSelector: string);
        public _doStart(): boolean;
        private _requestSubmit();
        public getValue(): string;
        public _doLoad(model: text_input.ITextInputModel): void;
    }
}
declare module templa.dom.samples.mvc.controller.label {
    interface ILabelModel extends templa.mvc.IModel {
        getLabel(): string;
    }
}
declare module templa.dom.samples.mvc.controller.label {
    class LabelController extends dom.mvc.jquery.AbstractJQueryController<label.ILabelModel> {
        private _labelElementSelector;
        constructor(_viewFactory: dom.mvc.IElementViewFactory, _labelElementSelector: string);
        public _doLoad(model: label.ILabelModel): void;
        public getTitle(): string;
        public _handleModelChangeEvent(event: templa.mvc.ModelChangeEvent): void;
    }
}
declare module templa.dom.samples.mvc.controller.label {
    class ImmutableLabelModel extends templa.mvc.AbstractModel implements label.ILabelModel {
        private _label;
        constructor(_label: string);
        public getLabel(): string;
    }
}
declare module templa.dom.samples.mvc.basic_stack {
    class BasicStackModel extends templa.mvc.composite.AbstractStackControllerModel implements mvc.controller.text_input.ITextInputModel {
        private labelViewKey;
        private labelViewFactory;
        constructor();
        public getValue(): string;
        public requestSubmit(value: string): void;
        private _createController(value);
        public _entryToDescription(entry: templa.mvc.composite.IAbstractStackControllerModelEntry): any;
        public _createEntryFromDescription(description: string): templa.mvc.composite.IAbstractStackControllerModelEntry;
    }
}
declare module templa.dom.samples.mvc.basic_stack {
    class BasicStackControllerFactory {
        private _model;
        constructor();
        public createStackController(): templa.mvc.IController;
        public createInputController(): templa.mvc.IController;
        public create(): templa.mvc.IController;
    }
}
declare module templa.dom.samples.mvc.controller {
    class ToolbarDecoratorModel extends templa.mvc.composite.AbstractCompositeControllerModel implements templa.mvc.composite.IKeyedControllerModel {
        private _toolbarController;
        private _toolbarControllerKey;
        private _otherControllers;
        private _otherControllerKey;
        constructor(_toolbarController: templa.mvc.IController, _toolbarControllerKey: string, _otherControllers: templa.mvc.IController[], _otherControllerKey: string);
        public getControllerKey(controller: templa.mvc.IController): string;
        public _getDescribedControllers(): templa.mvc.IController[];
        public getControllers(): templa.mvc.IController[];
    }
}
declare module templa.dom.samples.mvc.decorated_stack {
    class DecoratedStackModel extends templa.mvc.composite.AbstractStackControllerModel implements mvc.controller.text_input.ITextInputModel, templa.mvc.composite.IStackControllerModel {
        private _topLevelController;
        private _labelViewFactory;
        private _labelViewSelector;
        private _inputViewFactory;
        private _inputValueSelector;
        private _inputButtonSelector;
        private _toolbarDecoratorFactory;
        constructor(_topLevelController: templa.mvc.IController, _labelViewFactory: dom.mvc.IElementViewFactory, _labelViewSelector: string, _inputViewFactory: dom.mvc.IElementViewFactory, _inputValueSelector: string, _inputButtonSelector: string, _toolbarDecoratorFactory: (controllers: templa.mvc.IController[]) => templa.mvc.IController);
        public getValue(): string;
        public requestSubmit(value: string): void;
        public _createController(value: string): templa.mvc.IController;
        public _entryToDescription(entry: templa.mvc.composite.IAbstractStackControllerModelEntry): any;
        public _createEntryFromDescription(description: string): templa.mvc.composite.IAbstractStackControllerModelEntry;
    }
}
declare module templa.dom.samples.mvc.decorated_stack.DecoratedStackControllerFactory {
    function create(loadables: templa.loading.ILoadable[], toolbarDecoratorFactory: (controllers: templa.mvc.IController[]) => templa.mvc.IController): templa.mvc.IController;
}
declare module templa.dom.samples.mvc.hello_world {
    class HelloWorldModel extends templa.mvc.AbstractModel implements mvc.controller.label.ILabelModel {
        private _name;
        constructor(_name: string);
        public getLabel(): string;
    }
}
declare module templa.dom.samples.mvc.hello_world.HelloWorldControllerFactory {
    function create(): mvc.controller.label.LabelController;
}
declare module templa.dom.samples.mvc.hello_you {
    class HelloYouModel extends templa.mvc.AbstractModel implements mvc.controller.label.ILabelModel, mvc.controller.text_input.ITextInputModel {
        private _name;
        constructor(_name: string);
        public getLabel(): string;
        public getValue(): string;
        public requestSubmit(value: string): void;
        public createStateDescription(models?: templa.mvc.IModel[]): any;
        public loadStateDescription(description: any): void;
    }
}
declare module templa.dom.samples.mvc.hello_you {
    class HelloYouControllerFactory {
        private _model;
        constructor();
        public createLabelController(): templa.mvc.IController;
        public createInputController(): templa.mvc.IController;
        public create(): templa.mvc.IController;
    }
}
declare module templa.dom.samples.mvc.tab_index {
    class TabIndexControllerFactory {
        constructor();
        public create(): templa.mvc.IController;
    }
}
