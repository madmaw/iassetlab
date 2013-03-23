///<reference path="AbstractCompositeJQueryController.ts"/>
///<reference path="../../../composite/IKeyedControllerModel.ts"/>

// Module
module templa.mvc.element.jquery.composite {

    // Class
    export class KeyedJQueryController extends AbstractCompositeJQueryController {

        constructor(_viewFactory: IElementViewFactory, private _keysToSelectors?:{ string: string; }) {
            super(_viewFactory);
            if (this._keysToSelectors == null) {
                this._keysToSelectors = <any>{};
            }
        }

        public setKeyAndSelector(key: string, selector: string) {
            this._keysToSelectors[key] = selector;
        }

        public getControllerContainerSelector(controller: IController): string {
            var model: templa.mvc.composite.IKeyedControllerModel = <templa.mvc.composite.IKeyedControllerModel>this._model;
            var key: string = model.getControllerKey(controller);
            var selector: string = this._keysToSelectors[key];
            if (selector == null && key != null) {
                selector = "#" + key;
            }
            return selector;
        }

    }

}