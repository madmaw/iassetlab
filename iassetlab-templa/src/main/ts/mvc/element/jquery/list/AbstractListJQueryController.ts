///<reference path="../IJQuerySelectorHandler.ts"/>
///<reference path="../../AbstractElementController.ts"/>
///<reference path="../../DirectElementReference.ts"/>
///<reference path="../../../list/IListControllerModel.ts"/>
///<reference path="../../ViewRootElementReference.ts"/>

///<reference path="../../../../../d.ts/jquery.d.ts"/>

// Module
module templa.mvc.element.jquery.list {



    export class AbstractListJQueryListItem {

        constructor(private _controller:templa.mvc.IController, private _controllerType:string, private _containerView?:templa.mvc.element.IElementView) {
        }

        public get controller(): templa.mvc.IController {
            return this._controller;
        }

        public get controllerType(): string {
            return this._controllerType;
        }

        public get containerView(): templa.mvc.element.IElementView {
            return this._containerView;
        }

    }

    // Class
    export class AbstractListJQueryController extends templa.mvc.element.AbstractElementController implements templa.mvc.element.jquery.IJQuerySelectorHandler {

        private _positionsToListItems: { number: AbstractListJQueryListItem; };
        private _typesToReusableControllers: { string: templa.mvc.IController[]; };

        // Constructor
        constructor(viewFactory: templa.mvc.element.IElementViewFactory, private _listItemContainerViewFactory:templa.mvc.element.IElementViewFactory) {
            super(viewFactory);
            this._positionsToListItems = <any>{};
            this._typesToReusableControllers = <any>{};
        }

        public _initAndStart(controller: templa.mvc.IController, container:templa.mvc.IElementReference) {
            var state = controller.getState();
            if (state == templa.mvc.ControllerStateUninitialized) {
                // initialize it
                controller.init(container);
            }
            this._start(controller);
        }

        public _start(controller: templa.mvc.IController) {
            var state = controller.getState();
            if (state == templa.mvc.ControllerStateInitialized) {
                // start it
                controller.start();
            }
        }

        public _stop(controller: templa.mvc.IController) {
            var state = controller.getState();
            if (state == templa.mvc.ControllerStateStarted) {
                controller.stop();
            }
        }

        public _destroy(controller: templa.mvc.IController) {
            var state = controller.getState();
            if (state == templa.mvc.ControllerStateInitialized) {
                controller.destroy();

            }
        }

        public _doLoad(model: templa.mvc.IModel) {

            // unload everything
            this._clear();

            var listModel: templa.mvc.list.IListControllerModel = <templa.mvc.list.IListControllerModel>model;
            
            // load everything for now
            var controllerCount = listModel.getControllerCount();
            var container = this._getContainer();
            for (var i = 0; i < controllerCount; i++) {
                if (this._keepLoading(listModel, i)) {
                    var controllerType = listModel.getControllerType(i);
                    // check reusable controllers
                    var reusableControllers: templa.mvc.IController[] = this._typesToReusableControllers[controllerType];
                    var reusableController: templa.mvc.IController;
                    if (reusableControllers != null && reusableControllers.length > 0) {
                        // note, this controller gets removed from the reuse pile regardless of whether it is actually used or not
                        reusableController = reusableControllers.pop();
                    } else {
                        reusableController = null;
                    }
                    var controller = listModel.getController(i, reusableController);
                    var listItemContainer: templa.mvc.element.IElementView = this._listItemContainerViewFactory.create(container);
                    listItemContainer.attach();
                    this._initAndStart(controller, new templa.mvc.element.ViewRootElementReference(listItemContainer));
                    this._positionsToListItems[i] = new AbstractListJQueryListItem(controller, controllerType, listItemContainer);
                } else {
                    break;
                }
            }
        }

        public _keepLoading(listModel: templa.mvc.list.IListControllerModel, position:number): bool {
            return true;
        }

        public _doInit(container:templa.mvc.IElementReference, prepend:bool): bool {
            var result = super._doInit(container, prepend);
            if (result) {
                // hope this iterates in numeric order!
                for (var position in this._positionsToListItems) {
                    var listItem: AbstractListJQueryListItem = this._positionsToListItems[position];
                    var containerView = listItem.containerView;
                    containerView.attach();
                    var controller = listItem.controller;
                    controller.init(new templa.mvc.element.ViewRootElementReference(containerView));
                }
            }
            return result;
        }

        public _doStart(): bool {

            // TODO : these controllers are probably going to be reloaded anyway, so starting them may not be much use?

            // start all controllers
            for (var position in this._positionsToListItems) {
                var listItem = this._positionsToListItems[position];
                var controller = listItem.controller;
                this._start(controller);
            }
            return super._doStart();
        }

        public _doStop(): bool {

            // stop all controllers
            for (var position in this._positionsToListItems) {
                var listItem = this._positionsToListItems[position];
                var controller = listItem.controller;
                this._stop(controller);
            }
            return super._doStop();
        }

        public _doDestroy(): bool {
            // just clear it
            /*
            for (var position in this._positionsToListItems) {
                var listItem: AbstractListJQueryListItem = this._positionsToListItems[position];
                var controller = listItem.controller;
                this._destroy(controller);
                listItem.containerView.detach();
            }
            */
            this._clear();
            return super._doDestroy();

        }

        public layout(): void {
            // TODO layout subordinate controllers;
            super.layout();
        }


        public _clear() {
            for (var position in this._positionsToListItems) {
                var listItem: AbstractListJQueryListItem = this._positionsToListItems[position];
                var controller = listItem.controller;
                this._stop(controller);
                this._destroy(controller);
                listItem.containerView.detach();
                var reusableControllers: templa.mvc.IController[] = this._typesToReusableControllers[listItem.controllerType];
                if (reusableControllers == null) {
                    reusableControllers = [];
                    this._typesToReusableControllers[listItem.controllerType] = reusableControllers;
                }
                reusableControllers.push(controller);
            }
            // TODO save any discarded controllers for later
            this._positionsToListItems = <any>{};
        }

        // all list items are assumed to go into the same container!
        public _getContainer(): templa.mvc.IElementReference {
            // just use the root element
            return this.$reference();
        }

        public $(selector?: string): JQuery {
            // do a careful jquery (only owned elements)
            var roots: Node[] = this._view.getRoots();
            // we inherently know that our roots are valid (no need to check lineage)
            var self: JQuery = $(<Element[]>roots);
            var query;
            if (selector != null) {
                var allChildRoots: Node[] = [];
                // initialized controllers
                for (var position in this._positionsToListItems) {
                    var listItem: AbstractListJQueryListItem = this._positionsToListItems[position];
                    var view: IElementView = listItem.containerView;
                    if (view != null) {
                        // we can get odd situations where the owner controller is initialized, but the children are not
                        var childRoots = view.getRoots();
                        if (childRoots != null) {
                            templa.util.Arrays.pushAll(allChildRoots, childRoots);
                        }
                    }
                }

                // selector goes first as checking the parenthood is quite expensive
                query = $(<Element[]>roots).find(selector).filter(function (index) {
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
                self = self.filter(selector);
                query = query.add(self);
            } else {
                query = self;
            }
        
            return query;
        }

        public $reference(selector?: string): IElementReference {
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