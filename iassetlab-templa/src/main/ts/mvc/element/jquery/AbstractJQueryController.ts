///<reference path="IJQuerySelectorHandler.ts"/>
///<reference path="JQueryElementReference.ts"/>
///<reference path="../AbstractElementController.ts"/>
///<reference path="../DirectElementReference.ts"/>
///<reference path="../../../../d.ts/jquery.d.ts"/>

// Module
module templa.mvc.element.jquery {

    // Class
    export class AbstractJQueryController extends AbstractElementController implements IJQuerySelectorHandler {
        // Constructor
        constructor(_viewFactory: IElementViewFactory) {
            super(_viewFactory);
        }

        public $(selector?:string, roots?:Node[]): JQuery {
            // do a careful jquery (only owned elements)
            if (roots == null) {
                roots = this._view.getRoots();
            }
            // TODO I dislike parsing the selector twice, I also dislike marching the results twice though
            if (selector) {
                var self: JQuery = $(<Element[]>roots).filter(selector);
                return $(<Element[]>roots).find(selector).add(self);
            } else {
                return $(<Element[]>roots);
            }
        }

        public $reference(selector: string): IElementReference {
            // too slow!
            //return new JQueryElementReference(this, selector);
            var query = this.$(selector);
            var result;
            if (query.length > 0) {
                result = new templa.mvc.element.DirectElementReference(query.get(0));
            } else {
                result = null;
            }
            return result;
        }
    }

}