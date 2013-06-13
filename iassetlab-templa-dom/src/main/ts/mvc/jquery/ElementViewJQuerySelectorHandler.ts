///<reference path="IJQuerySelectorHandler.ts"/>
///<reference path="../IElementView.ts"/>

///<reference path="../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc.jquery {


    export class ElementViewJQuerySelectorHandler implements templa.dom.mvc.jquery.IJQuerySelectorHandler {

        constructor(private _view: templa.dom.mvc.IElementView, private _excludedViews?: templa.dom.mvc.IElementView[]) {

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
                        var excludedView: templa.dom.mvc.IElementView = this._excludedViews[i];
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