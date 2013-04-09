///<reference path="AbstractCompositeControllerModel.ts"/>
///<reference path="IStackControllerModel.ts"/>
///<reference path="StackControllerModelChangeDescription.ts"/>
///<reference path="../IController.ts"/>

// Module
module templa.mvc.composite {

    export interface IAbstractStackControllerModelEntry {
        controller: IController;
        data?: any;
    }

    export class AbstractStackControllerModelPushChange implements IModelStateChange {
        constructor(private _model: AbstractStackControllerModel, private _entry: IAbstractStackControllerModelEntry) {
        }

        public undo() {
            this._model._deStack(this._entry.controller, false, true);
        }

        public redo() {
            this._model._pushEntry(this._entry, false, true);
        }
    }

    export class AbstractStackControllerModelPopChange implements IModelStateChange {
        constructor(private _model: AbstractStackControllerModel, private _entry: IAbstractStackControllerModelEntry) {
        }

        public undo() {
            this._model._pushEntry(this._entry, false, true);
        }

        public redo() {
            this._model._deStack(this._entry.controller, false, true);
        }
    }

    // Class
    export class AbstractStackControllerModel extends AbstractCompositeControllerModel implements IStackControllerModel {

        private _stack: IAbstractStackControllerModelEntry[];

        // Constructor
        constructor(private _allowEmptyStack?:bool) {
            super();
            this._stack = [];
        }

        public getControllers(): IController[]{
            var result: templa.mvc.IController[] = [];
            if (this._stack.length > 0) {
                result.push(this._stack[this._stack.length - 1].controller);
            }
            return result;
        }

        public _getDescribedControllers(): IController[] {
            return this.getControllers();
        }

        public isStackEmpty(): bool {
            return this._stack.length == 0;
        }

        public canPop(): bool {
            return !this.isStackEmpty() && this._allowEmptyStack || this._stack.length > 1;
        }

        public requestPop(): void {
            this._pop();
        }

        public _deStack(controller: IController, suppressFireModelChangeEvent?:bool, suppressFireDescriptionChangeEvent?:bool): void {
            // pop or just silently remove as required
            if (this.peek == controller) {
                this._pop(suppressFireModelChangeEvent, suppressFireDescriptionChangeEvent);
            } else {
                // just remove it silently
                for (var i in this._stack) {
                    var entry = this._stack[i];
                    if (entry.controller == controller) {
                        this._stack.splice(<any>i, 1);
                        break;
                    }
                }
            }
        }

        public _pop(suppressFireModelChangeEvent?: bool, suppressFireDescriptionChangeEvent?: bool): bool {
            var result;
            if (this._stack.length > 0) {
                var previousController = this._stack[this._stack.length - 1].controller;
                var entries = this._stack.splice(this._stack.length - 1, 1);
                if (suppressFireModelChangeEvent != true) {
                    var changeDescription = new StackControllerModelChangeDescription(stackControllerModelEventPopped, previousController, this.peek);
                    // TODO need a popchange (reverse of push change)
                    this._fireModelChangeEvent(changeDescription, true);
                    if (suppressFireDescriptionChangeEvent != true) {
                        this._fireStateDescriptionChangeEvent(this, new AbstractStackControllerModelPopChange(this, entries[0]));
                    }
                }
                result = true;
            } else {
                result = false;
            }
            return result;
        }

        public _push(controller: IController, data?: any): void {
            this._pushEntry({
                controller: controller,
                data: data
            });
        }
        public _pushEntry(entry: IAbstractStackControllerModelEntry, suppressFireModelChangeEvent?: bool, suppressFireDescriptionChangeEvent?: bool) {
            var previousController = this.peek;
            this._stack.push(entry);
            if (suppressFireModelChangeEvent != true) {
                var description = new StackControllerModelChangeDescription(stackControllerModelEventPushed, previousController, entry.controller);
                this._fireModelChangeEvent(description, true);
                if (suppressFireDescriptionChangeEvent != true) {
                    this._fireStateDescriptionChangeEvent(this, new AbstractStackControllerModelPushChange(this, entry));
                }
            }
        }

        public get peek(): IController {
            var result:IController;
            if (this._stack.length > 0) {
                result = this._stack[this._stack.length - 1].controller;
            } else {
                result = null;
            }
            return result;
        }

        public createStateDescription(models?: IModel[]): any {
            models = this._checkModels(models);
            var result = [];
            for (var i in this._stack) {
                var entry = this._stack[i];
                var description: any = this._entryToDescription(entry, models);
                result.push(description);
            }
            return result;
        }

        public loadStateDescription(description: any) {
            var descriptions: any[] = description;
            // remove everything (TODO would be nice if we tried to reuse the controllers instead)
            while (!this.isStackEmpty()) {
                this._pop(true);
            }
            for (var i in descriptions) {
                var controllerDescription = descriptions[i];
                var entry = this._createEntryFromDescription(controllerDescription);
                if (entry != null) {
                    this._pushEntry(entry, true);
                }
            }
        }

        public _entryToDescription(entry:IAbstractStackControllerModelEntry, models:IModel[]): any {
            return null;
        }

        public _createEntryFromDescription(description: any): IAbstractStackControllerModelEntry {
            return null;
        }
    }

}
