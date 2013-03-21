///<reference path="../../../../main/ts/mvc/AbstractModel.ts"/>
///<reference path="../../../../main/ts/mvc/element/DivElementViewFactory.ts"/>
///<reference path="../../../../main/ts/mvc/element/DirectElementReference.ts"/>
///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>

module templa.samples.mvc.hello_world {
    export class HelloWorldModel extends templa.mvc.AbstractModel implements templa.samples.mvc.controller.label.ILabelModel {
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
        var labelViewFactory = new templa.mvc.element.DivElementViewFactory("Hello <span key='name_element'></span>!");
        var labelController = new templa.samples.mvc.controller.label.LabelController(labelViewFactory, "[key='name_element']");
        var labelModel = new templa.samples.mvc.hello_world.HelloWorldModel("World");
        labelController.setModel(labelModel);

        labelController.init(new templa.mvc.element.DirectElementReference(container));
        labelController.start();
    }

}

