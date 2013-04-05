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

        public _pop(): bool {
            var result;
            if (this._stack.length > 0) {
                var previousController = this._stack[this._stack.length - 1].controller;
                this._stack.splice(this._stack.length - 1, 1);
                this._fireModelChangeEvent(new StackControllerModelChangeDescription(stackControllerModelEventPopped, previousController, this.peek));
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
        public _pushEntry(entry: IAbstractStackControllerModelEntry, suppressFireModelChangeEvent?:bool) {
            var previousController = this.peek;
            this._stack.push(entry);
            if (suppressFireModelChangeEvent != true) {
                var description = new StackControllerModelChangeDescription(stackControllerModelEventPushed, previousController, entry.controller);
                this._fireModelChangeEvent(description);
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
            for (var i in descriptions) {
                var controllerDescription = descriptions[i];
                var entry = this._loadEntryFromDescription(controllerDescription);
                if (entry != null) {
                    this._pushEntry(entry, true);
                }
            }
        }

        public _entryToDescription(entry:IAbstractStackControllerModelEntry, models:IModel[]): any {
            return null;
        }

        public _loadEntryFromDescription(description: any): IAbstractStackControllerModelEntry {
            return null;
        }
    }

}
