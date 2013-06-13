///<reference path="IElementViewFactory.ts"/>
///<reference path="DocumentFragmentElementView.ts"/>
///<reference path="IElementReference.ts"/>
///<reference path="../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc {

    /**
     * constant to allow us to create unique ids for the divs
     */
    var divElementCount: number = 0;

    export class DocumentFragmentElementViewFactory implements IElementViewFactory {

        constructor(private _html?:string) {
            if (this._html == null) {
                this._html = "<div></div>";
            }
        }

        public create(container: IElementReference, prepend?:bool): IElementView {
            return this._createDiv(container, prepend, this._html);
        }

        public _createDiv(container: IElementReference, prepend:bool, html: string) : IElementView {
            var count: number = divElementCount;
            var id = "__div_ele_" + count;
            divElementCount++;
            return DocumentFragmentElementView.createFromHTML(html, container, prepend, id);
        }
    }
}