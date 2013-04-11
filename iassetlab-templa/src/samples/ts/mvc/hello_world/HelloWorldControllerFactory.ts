///<reference path="../../../../main/ts/mvc/AbstractModel.ts"/>
///<reference path="../../../../main/ts/mvc/element/DocumentFragmentElementViewFactory.ts"/>
///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>
///<reference path="HelloWorldModel.ts"/>

module templa.samples.mvc.hello_world.HelloWorldControllerFactory {
    
    export function create(): templa.samples.mvc.controller.label.LabelController {
        var labelViewFactory = new templa.mvc.element.DocumentFragmentElementViewFactory("<div>Hello <span key='name_element'></span>!</div>");
        var labelController = new templa.samples.mvc.controller.label.LabelController(labelViewFactory, "[key='name_element']");
        var labelModel = new templa.samples.mvc.hello_world.HelloWorldModel("World");
        labelController.setModel(labelModel);

        return labelController;
    }

}

