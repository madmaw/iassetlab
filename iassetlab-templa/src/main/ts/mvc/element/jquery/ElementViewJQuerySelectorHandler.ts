///<reference path="IJQuerySelectorHandler.ts"/>
///<reference path="../IElementView.ts"/>

module templa.mvc.element.jquery {


    export class ElementViewJQuerySelectorHandler implements templa.mvc.element.jquery.IJQuerySelectorHandler {

        constructor(private _view: templa.mvc.element.IElementView, private _excludedViews?: templa.mvc.element.IElementView[]) {

        }

        public $(selector?: string): JQuery {
            // do a careful jquery (only owned elements)
            var roots = this._view.getRoots();
            // TODO I dislike parsing the selector twice, I also dislike marching the results twice though
            var self: JQuery = $(<Element[]>roots);
            var query;
            if (selector) {
                query = $(<Element[]>roots).find(selector);
                if (this._excludedViews != null) {
                    var allChildRoots: Node[] = [];
                    for (var i in this._excludedViews) {
                        var excludedView: templa.mvc.element.IElementView = this._excludedViews[i];
                        templa.util.Arrays.pushAll(allChildRoots, excludedView.getRoots());
                    }
                    // selector goes first as checking the parenthood is quite expensive
                    query = query.filter(function (index) {
                        var valid = true;
                        var e: Node = this;
                        while (e != null) {
                            if (roots.indexOf(e) >= 0) {
                                // we're at our root, it's OK
                                break;
                            } else if (allChildRoots.indexOf(e) >= 0) {
                                valid = false;
                                break;
                            } else {
                                e = e.parentNode;
                            }
                        }
                        return valid;
                    });
                }

                self = self.filter(selector);
                query = query.add(self);
            } else {
                query = self;
            }
            return query;
        }

    }

}