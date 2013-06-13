///<reference path="BorrowedElementView.ts"/>
///<reference path="../IElementViewFactory.ts"/>

///<reference path="../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc.jquery {

    // Class
    export class BorrowedElementViewFactory implements IElementViewFactory {
        // Constructor
        constructor(private _selector: string) {
        }

        create(container: IElementReference, prefix?: bool): IElementView {
            return new BorrowedElementView(container, this._selector);
        }
    }

}