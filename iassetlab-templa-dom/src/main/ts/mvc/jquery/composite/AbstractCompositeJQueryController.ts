///<reference path="../AbstractJQueryController.ts"/>
///<reference path="../IJQuerySelectorHandler.ts"/>
///<reference path="../JQueryElementReference.ts"/>
///<reference path="../../ViewRootElementReference.ts"/>
///<reference path="../../IElementView.ts"/>
///<reference path="../../IElementReference.ts"/>
///<reference path="../../DirectElementReference.ts"/>
///<reference path="../../composite/AbstractCompositeElementController.ts"/>

///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/> 

// Module
module templa.dom.mvc.jquery.composite {
    export class AbstractCompositeJQueryController<ModelType extends templa.mvc.composite.ICompositeControllerModel> extends templa.dom.mvc.composite.AbstractCompositeElementController<ModelType> implements templa.dom.mvc.jquery.IJQuerySelectorHandler {

        constructor(viewFactory: templa.dom.mvc.IElementViewFactory) {
            super(viewFactory);
        }


        public $(selector: string): JQuery {
            // do a careful jquery (only owned elements)
            var roots:Node[] = this._view.getRoots();
            var allChildRoots: Node[] = [];
            for (var i in this._controllers) {
                var controller: templa.mvc.IController = this._controllers[i];
                var view: IElementView = <IElementView>controller.getView();
                if (view != null) {
                    // we can get odd situations where the owner controller is initialized, but the children are not
                    var childRoots = view.getRoots();
                    if (childRoots != null) {
                        templa.util.Arrays.pushAll(allChildRoots, childRoots);
                    }
                }
            }
            // selector goes first as checking the parenthood is quite expensive
            var query = $(<Element[]>roots).find(selector).filter(function (index) {
                var valid = true;
                var e:Node = this;
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
            // we inherently know that our roots are valid (no need to check lineage)
            var self: JQuery = $(<Element[]>roots).filter(selector);
            query = query.add(self);
            return query;
        }

        public $reference(selector: string): IElementReference {
            // too slow!
            //return new JQueryElementReference(this, selector);
            var query = this.$(selector);
            var result;
            if (query.length > 0) {
                result = new DirectElementReference(query.get(0));
            } else {
                result = null;
            }
            return result;
        }

        public getControllerContainer(controller: templa.mvc.IController): IElementReference {
            var selector = this.getControllerContainerSelector(controller);
            var result: IElementReference;
            if (selector == null) {
                result = super.getControllerContainer(controller);
            } else {
                result = this.$reference(selector);
            }
            if (result == null) {
                throw "no container for selector " + selector;
            }
            return result;
        }

        public getControllerContainerSelector(controller: templa.mvc.IController): string {
            return null;
        }

    }
}