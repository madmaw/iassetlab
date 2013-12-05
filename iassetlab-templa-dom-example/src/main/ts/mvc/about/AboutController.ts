///<reference path="IAboutControllerModel.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>

// Module
module iassetlab.client.core.mvc.about {

    // Class
    export class AboutController extends templa.dom.mvc.jquery.AbstractJQueryController<IAboutControllerModel> { 
        // Constructor
        constructor(viewFactory:templa.dom.mvc.IElementViewFactory) {
            super(viewFactory);
        }

        
    }

}