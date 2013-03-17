///<reference path="../AbstractModel.ts"/>
///<reference path="IStackControllerModel.ts"/>
///<reference path="StackControllerModelChangeEvent.ts"/>

// Module
module templa.mvc.composite {

    // Class
    export class AbstractStackControllerModel extends AbstractModel implements IStackControllerModel {

        private _stack: IController[];

        // Constructor
        constructor() {
            super();
            this._stack = [];
        }

        public getControllers(): templa.mvc.IController[]{
            var result: templa.mvc.IController[] = [];
            if (this._stack.length > 0) {
                result.push(this._stack[this._stack.length - 1]);
            }
            return result;
        }

        public isStackEmpty(): bool {
            return this._stack.length == 0;
        }

        public canPop(): bool {
            return !this.isStackEmpty();
        }

        public requestPop(): void {
            this._pop();
        }

        public _pop(): bool {
            var result;
            if (this._stack.length > 0) {
                var previousController = this._stack[this._stack.length - 1];
                this._stack.splice(this._stack.length - 1, 1);
                this._fireModelChangeEvent(new StackControllerModelChangeEvent(stackControllerModelEventPopped, previousController, this.peek));
                result = true;
            } else {
                result = false;
            }
            return result;
        }

        public _push(controller: IController): void {
            var previousController = this.peek;
            this._stack.push(controller);
            this._fireModelChangeEvent(new StackControllerModelChangeEvent(stackControllerModelEventPushed, previousController, this.peek));
        }

        public get peek(): IController {
            var result;
            if (this._stack.length > 0) {
                result = this._stack[this._stack.length - 1];
            } else {
                result = null;
            }
            return result;
        }
    }

}
