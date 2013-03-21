///<reference path="../AbstractJQueryController.ts"/>
///<reference path="../IJQuerySelectorHandler.ts"/>
///<reference path="../JQueryElementReference.ts"/>
///<reference path="../../ViewRootElementReference.ts"/>
///<reference path="../../../composite/ICompositeControllerModel.ts"/>
///<reference path="../../composite/AbstractCompositeElementController.ts"/>
///<reference path="../../../../../d.ts/jquery.d.ts"/>

module templa.mvc.element.jquery.composite {
    export class AbstractCompositeJQueryController extends templa.mvc.element.composite.AbstractCompositeElementController implements templa.mvc.element.jquery.IJQuerySelectorHandler {

        constructor(viewFactory: templa.mvc.element.IElementViewFactory) {
            super(viewFactory);
        }


        public $(selector: string): JQuery {
            // do a careful jquery (only owned elements)
            var roots:Node[] = this._view.getRoots();
            var allChildRoots: Node[] = [];
            for (var i in this._controllers) {
                var controller: IController = this._controllers[i];
                var view: IElementView = <IElementView>controller.getView();
                var childRoots = view.getRoots();
                templa.util.Arrays.pushAll(allChildRoots, childRoots);
            }
            // selector goes first as checking the parenthood is quite expensive
            var query = $(<Element[]>roots).find(selector).find(function (index) {
                var valid = true;
                var e:Node = this;
                while (e != null) {
                    if (roots.indexOf(e) >= 0) {
                        // we're at our root, it's OK
                        break;
                    } else if (childRoots.indexOf(e) >= 0) {
                        valid = false;
                        break;
                    } else {
                        e = e.parentNode;
                    }
                }
            });
            // we inherently know that our roots are valid (no need to check lineage)
            var self: JQuery = $(<Element[]>roots).filter(selector);
            query = query.add(self);
            return query;
        }

        public $reference(selector: string): IElementReference {
            return new JQueryElementReference(this, selector);
        }

        public getControllerContainer(controller: templa.mvc.IController): IElementReference {
            var selector = this.getControllerContainerSelector(controller);
            var result: IElementReference;
            if (selector == null) {
                result = super.getControllerContainer(controller);
            } else {
                result = new JQueryElementReference(this, selector);
            }
            return new ViewRootElementReference(this._view);;
        }

        public getControllerContainerSelector(controller: templa.mvc.IController): string {
            return null;
        }

    }
}