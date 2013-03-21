///<reference path="AbstractCompositeJQueryController.ts"/>
///<reference path="../../../composite/IKeyedControllerModel.ts"/>

// Module
module templa.mvc.element.jquery.composite {

    // Class
    export class KeyedJQueryController extends AbstractCompositeJQueryController {

        constructor(_viewFactory: IElementViewFactory, private _keysToSelectors:{ string: string; }) {
            super(_viewFactory);
        }

        public getControllerContainerSelector(controller: IController): string {
            var model: templa.mvc.composite.IKeyedControllerModel = <templa.mvc.composite.IKeyedControllerModel>this._model;
            var key: string = model.getControllerKey(controller);
            var selector: string = this._keysToSelectors[key];
            return selector;
        }

    }

}