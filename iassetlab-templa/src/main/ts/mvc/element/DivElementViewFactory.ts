///<reference path="IElementViewFactory.ts"/>
///<reference path="HTMLElementView.ts"/>

module templa.mvc.element {

    /**
     * constant to allow us to create unique ids for the divs
     */
    var divElementCount: number = 0;

    export class DivElementViewFactory implements IElementViewFactory {

        constructor(private _html:string) {

        }

        public create(container: IElementReference): IElementView {
            var count: number = divElementCount;
            var id = "__div_ele_" + count;
            divElementCount++;
            var html = "<div id='" + id + "'>" + this._html + "</div>";
            return new HTMLElementView(html, container, id);
        }
    }
}