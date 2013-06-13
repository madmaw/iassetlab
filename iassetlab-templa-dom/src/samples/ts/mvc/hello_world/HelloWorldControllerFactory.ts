///<reference path="../controller/label/LabelController.ts"/>
///<reference path="../controller/label/ILabelModel.ts"/>
///<reference path="HelloWorldModel.ts"/>

///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/> 
///<reference path="../../../../../build/dist/iassetlab-templa-dom.d.ts"/> 

// Module  
module templa.dom.samples.mvc.hello_world.HelloWorldControllerFactory {
    
    export function create(): templa.dom.samples.mvc.controller.label.LabelController {
        var labelViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div>Hello <span key='name_element'></span>!</div>");
        var labelController = new templa.dom.samples.mvc.controller.label.LabelController(labelViewFactory, "[key='name_element']");
        var labelModel = new templa.dom.samples.mvc.hello_world.HelloWorldModel("World");
        labelController.setModel(labelModel);

        return labelController;
    }

}

