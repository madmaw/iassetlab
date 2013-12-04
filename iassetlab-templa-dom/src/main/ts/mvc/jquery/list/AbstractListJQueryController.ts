///<reference path="../IJQuerySelectorHandler.ts"/>
///<reference path="../../AbstractElementController.ts"/>
///<reference path="../../DirectElementReference.ts"/>
///<reference path="../../ViewRootElementReference.ts"/>

///<reference path="../../../../../../build/defs/jquery.d.ts"/>
///<reference path="../../../../../../build/defs/iassetlab-templa.d.ts"/>

// Module
module templa.dom.mvc.jquery.list {



    export class AbstractListJQueryListItem {

        constructor(private _controller: templa.mvc.IController, private _controllerType:string, private _containerView?:templa.dom.mvc.IElementView) {
        }

        public getController(): templa.mvc.IController {
            return this._controller; 
        }

        public getControllerType(): string {
            return this._controllerType;
        }

        public getContainerView(): templa.dom.mvc.IElementView {
            return this._containerView;
        }

    }

    // Class
    export class AbstractListJQueryController<ModelType extends templa.mvc.list.IListControllerModel> extends templa.dom.mvc.AbstractElementController<ModelType> implements templa.dom.mvc.jquery.IJQuerySelectorHandler {

        private _positionsToListItems: { number: AbstractListJQueryListItem; };
        private _typesToReusableControllers: { [_:string]: templa.mvc.IController[]; };

        // Constructor
        constructor(viewFactory: templa.dom.mvc.IElementViewFactory, private _listItemContainerViewFactory:templa.dom.mvc.IElementViewFactory) {
            super(viewFactory);
            this._positionsToListItems = <any>{};
            this._typesToReusableControllers = {};
        }

        public _initAndStart(controller: templa.dom.mvc.IElementController, container:templa.dom.mvc.IElementReference) {
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

        public _doLoad(model: templa.mvc.list.IListControllerModel) {

            // unload everything
            this._clear();

            var listModel: templa.mvc.list.IListControllerModel = model;
            
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
                    var controller = <templa.dom.mvc.IElementController>listModel.getController(i, reusableController);
                    var listItemContainer: templa.dom.mvc.IElementView = this._listItemContainerViewFactory.create(container);
                    listItemContainer.attach();
                    this._initAndStart(controller, new templa.dom.mvc.ViewRootElementReference(listItemContainer));
                    this._positionsToListItems[i] = new AbstractListJQueryListItem(controller, controllerType, listItemContainer);
                } else {
                    break;
                }
            }
        }

        public _keepLoading(listModel: templa.mvc.list.IListControllerModel, position:number): boolean {
            return true;
        }

        public _doInit(): boolean {
            var result = super._doInit();
            if (result) {
                // hope this iterates in numeric order!
                for (var position in this._positionsToListItems) {
                    var listItem: AbstractListJQueryListItem = this._positionsToListItems[position];
                    var containerView = listItem.getContainerView();
                    containerView.attach();
                    var controller = <templa.dom.mvc.IElementController>listItem.getController();
                    controller.init(new templa.dom.mvc.ViewRootElementReference(containerView));
                }
            }
            return result;
        }

        public _doStart(): boolean {

            // TODO : these controllers are probably going to be reloaded anyway, so starting them may not be much use?

            // start all controllers
            for (var position in this._positionsToListItems) {
                var listItem = <AbstractListJQueryListItem>this._positionsToListItems[position];
                var controller = listItem.getController();
                this._start(controller);
            }
            return super._doStart();
        }

        public _doStop(): boolean {

            // stop all controllers
            for (var position in this._positionsToListItems) {
                var listItem = <AbstractListJQueryListItem>this._positionsToListItems[position];
                var controller = listItem.getController();
                this._stop(controller);
            }
            return super._doStop();
        }

        public _doDestroy(): boolean {
            // just clear it
            /*
            for (var position in this._positionsToListItems) {
                var listItem: AbstractListJQueryListItem = this._positionsToListItems[position];
                var controller = listItem.getController();
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
                var controller = listItem.getController();
                this._stop(controller);
                this._destroy(controller);
                listItem.getContainerView().detach();
                var reusableControllers: templa.mvc.IController[] = this._typesToReusableControllers[listItem.getControllerType()];
                if (reusableControllers == null) {
                    reusableControllers = [];
                    this._typesToReusableControllers[listItem.getControllerType()] = reusableControllers;
                }
                reusableControllers.push(controller);
            }
            // TODO save any discarded controllers for later
            this._positionsToListItems = <any>{};
        }

        // all list items are assumed to go into the same container!
        public _getContainer(): templa.dom.mvc.IElementReference {
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
                    var view: IElementView = listItem.getContainerView();
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
                result = new templa.dom.mvc.DirectElementReference(query.get(0));
            } else {
                result = null;
            }
            return result;
        }
    }

}