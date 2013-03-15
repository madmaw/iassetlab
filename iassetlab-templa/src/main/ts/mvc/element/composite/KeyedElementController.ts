///<reference path="AbstractCompositeElementController.ts"/>
///<reference path="../../composite/IKeyedControllerModel.ts"/>

// Module
module templa.mvc.element.composite {

    // Class
    export class KeyedElementController extends AbstractCompositeElementController {
        constructor(_viewFactory: IElementViewFactory) {
            super(_viewFactory);
        }

        public getControllerContainer(controller: IController): Node {
            var model: templa.mvc.composite.IKeyedControllerModel = <templa.mvc.composite.IKeyedControllerModel>this._model;
            var key: string = model.getControllerKey(controller);
            return <Node><any>this._find(key);
        }

    }

}