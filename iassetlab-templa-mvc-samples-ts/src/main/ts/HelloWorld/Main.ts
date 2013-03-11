///<reference path="../../lib/templa-mvc-core.d.ts"/>
///<reference path="../Controller/Label/LabelController.ts"/>
///<reference path="../Controller/Label/ILabelModel.ts"/>

module Templa.Samples.HelloWorld {
    export class HelloWorldModel extends Templa.Model.AbstractModel implements Templa.Samples.Controller.Label.ILabelModel {
        private _name: string;

        constructor(_name: string) {
            super();
            this._name = _name;
        }

        public getLabel(): string {
            return this._name;
        }
    }

    export function init(container:Element) {
        var labelViewFactory = new Templa.Controller.View.HTMLElementViewFactory("Hello <span key='name_element'></span>!");
        var labelController = new Templa.Samples.Controller.Label.LabelController(labelViewFactory, "name_element");
        var labelModel = new Templa.Samples.HelloWorld.HelloWorldModel("World");
        labelController.setModel(labelModel);

        labelController.init(container);
        labelController.start();
    }

}

