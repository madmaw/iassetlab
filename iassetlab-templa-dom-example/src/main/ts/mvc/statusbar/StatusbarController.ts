///<reference path="IStatusbarControllerModel.ts"/>

///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa-dom.d.ts"/>
///<reference path="../../../../../build/defs/jquery.d.ts"/>

// Module
module iassetlab.client.core.mvc.statusbar {

    // Class
    export class StatusbarController extends templa.dom.mvc.jquery.AbstractJQueryController<IStatusbarControllerModel> {
        // Constructor
        constructor(viewFactory: templa.dom.mvc.IElementViewFactory) {
            super(viewFactory);
        }
    }

}