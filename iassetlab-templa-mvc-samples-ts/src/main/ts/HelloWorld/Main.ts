///<reference path="../../lib/templa-mvc-core.d.ts"/>
///<reference path="../Controller/Label/LabelController.ts"/>
///<reference path="../Controller/Label/ILabelModel.ts"/>

module Templa.MVC.Samples.HelloWorld {
    export class HelloWorldModel extends Templa.MVC.AbstractModel implements Templa.MVC.Samples.Controller.Label.ILabelModel {
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
        var labelViewFactory = new Templa.MVC.Element.HTMLElementViewFactory("Hello <span key='name_element'></span>!");
        var labelController = new Templa.MVC.Samples.Controller.Label.LabelController(labelViewFactory, "name_element");
        var labelModel = new Templa.MVC.Samples.HelloWorld.HelloWorldModel("World");
        labelController.setModel(labelModel);

        labelController.init(container);
        labelController.start();
    }

}

