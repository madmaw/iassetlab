// Module
module templa.mvc {

    export interface IView {
        attach():void;

        detach(): void;

        /**
         * called when the view should check it's layout (typically on the window resizing), return true if the controller should 
         * recreate itself entirely (stop, destroy, init, start) because the view needs to change elements. If returning true, then
         * the call to layout should do nothing (the controller will destroy/recreate anyway)
         */
        layout(): bool;
    }

}

