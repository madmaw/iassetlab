///<reference path="AbstractStackControllerModel.ts"/>

// Module
module templa.mvc.composite {

    // Class
    export class AbstractDescriptiveStackControllerModel extends AbstractStackControllerModel {

        private _controllerFactories: { string: (data: any) => templa.mvc.IController; };

        // Constructor
        constructor(allowEmptyStack?:bool, controllersToDisplay?:number) {
            super(allowEmptyStack, controllersToDisplay);
            this._controllerFactories = <any>{};
        }

        public setControllerFactory(key: string, factory:(data: any) => templa.mvc.IController) {
            this._controllerFactories[key] = factory;
        }

        public _entryToDescription(entry: templa.mvc.composite.IAbstractStackControllerModelEntry, models?: IModel[]): any {
            var controllerFactoryKey = entry.data;
            var modelData = entry.controller.getModel().createStateDescription(models);
            return {
                controllerFactoryKey: controllerFactoryKey,
                modelData: modelData
            };
        }

        public _createEntryFromDescription(description: any): templa.mvc.composite.IAbstractStackControllerModelEntry {
            var controllerFactoryKey = description["controllerFactoryKey"];
            var modelData = description["modelData"];
            var controllerFactory = this._controllerFactories[controllerFactoryKey];
            var result: templa.mvc.composite.IAbstractStackControllerModelEntry;
            if (controllerFactoryKey != null) {
                var controller = controllerFactory(modelData);
                result = {
                    controller: controller,
                    data: controllerFactoryKey
                };
            } else {
                result = null;
            }
            return result;
        }

    }

}