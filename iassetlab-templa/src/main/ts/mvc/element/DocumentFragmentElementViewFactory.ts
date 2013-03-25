///<reference path="IElementViewFactory.ts"/>
///<reference path="DocumentFragmentElementView.ts"/>

module templa.mvc.element {

    /**
     * constant to allow us to create unique ids for the divs
     */
    var divElementCount: number = 0;

    export class DocumentFragmentElementViewFactory implements IElementViewFactory {

        constructor(private _html:string) {

        }

        public create(container: IElementReference): IElementView {
            var count: number = divElementCount;
            var id = "__div_ele_" + count;
            divElementCount++;
            return new DocumentFragmentElementView(this._html, container, id);
        }
    }
}