///<reference path="BorrowedElementView.ts"/>
///<reference path="../IElementViewFactory.ts"/>

// Module
module templa.mvc.element.jquery {

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