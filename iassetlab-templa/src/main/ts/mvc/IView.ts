// Module
module templa.mvc {

    export interface IView {
        attach():void;

        detach(): void;

        /**
         * called when the view should check it's layout (typically on the window resizing), return true if the layout has recreated some elements internally and the 
         * controller should re-load
         */
        layout(): bool;
    }

}

